const clientEnvVariables = require("./clientEnv.prod");
const withPWA = require("next-pwa");

module.exports = withPWA({
  webpack5: true,
  env: {
    ethNodeURL: clientEnvVariables.ethNodeURL,
    explorerApiBaseURL: clientEnvVariables.explorerApiBaseURL,
    explorerApiKey: clientEnvVariables.explorerApiKey
  },
  pwa: {
    dest: "public",
  },
});
