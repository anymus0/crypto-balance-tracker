This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Env variables

#### ETH_NODE_URL
- The RPC endpoint of the EVM compatible blockchain node
- Example: `http://localhost:8545`

#### EXPLORER_API_BASE_URL
- The API URL of an etherscan like blockchain explorer
- Example: `https://api.etherscan.io`

#### EXPLORER_API_KEY
- Your API key for the etherscan explorer

You can create a `.env` file and paste the contets from `.env.example`.



## Setup

- Yarn is the preferred package manager of this repository

### Update yarn:
```bash
corepack enable
yarn set version stable
```

### Install dependencies:
- The repository supports yarn [Zero-Installs](https://yarnpkg.com/features/zero-installs)
```bash
yarn install
```


Run the development server:

```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production build
```bash
yarn build
```
### Deploy
- You can start to serve the build by starting a local server:
```bash
yarn run start
```
- Or you can export the static files:
```bash
yarn run next export
```

## Docker

### Build an image
```bash
docker build -t imageName .
```

### Run a container

- To set the env variables, define them during runtime.

Example:
```bash
docker run -dp 3000:80 -e "ETH_NODE_URL=http://mynoderpc.app/rpc" -e "EXPLORER_API_KEY=mySecretAPIkey
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
