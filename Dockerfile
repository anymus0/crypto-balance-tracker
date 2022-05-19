# 1st stage
FROM node AS build
WORKDIR /app
COPY . .
RUN corepack enable && yarn set version stable && yarn install && yarn build
RUN yarn run next export

# 2nd stage
FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/out .
# replace default env variables on runtime
RUN apt update && apt upgrade -y && apt install zsh -y
RUN echo "#!/usr/bin/zsh" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "# Script was generated in the Dockerfile during build time" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "escapedEthNodeUrl=\$(printf '%q\n' \$ETH_NODE_URL)" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "escapedExplorerApiKey=\$(printf '%q\n' \$EXPLORER_API_KEY)" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "escapedApiBaseUrl=\$(printf '%q\n' \$EXPLORER_API_BASE_URL)" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "if ! [ -z \${ETH_NODE_URL+x} ]; then sed -i s~http:\/\/localhost:8545~\$escapedEthNodeUrl~g /usr/share/nginx/html/**/*.js; fi" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "if ! [ -z \${EXPLORER_API_BASE_URL+x} ]; then sed -i s~https://api.etherscan.io~\$escapedApiBaseUrl~g /usr/share/nginx/html/**/*.js; fi" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN echo "if ! [ -z \${EXPLORER_API_BASE_URL+x} ]; then sed -i s~YOUR_EXPLORER_API_KEY~\$escapedExplorerApiKey~g /usr/share/nginx/html/**/*.js; fi" >> /docker-entrypoint.d/1-dockerSetup.sh
RUN chmod +x /docker-entrypoint.d/1-dockerSetup.sh
CMD [ "nginx", "-g", "daemon off;" ]