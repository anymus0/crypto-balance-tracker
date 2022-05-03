const clientEnvVariables = require("./clientEnv.prod");
const withPWA = require("next-pwa");
const runtimeCaching = require("./cache");

module.exports = withPWA({
  webpack5: true,
  env: {
    ethNodeURL: clientEnvVariables.ethNodeURL,
    explorerApiBaseURL: clientEnvVariables.explorerApiBaseURL,
    explorerApiKey: clientEnvVariables.explorerApiKey,
  },
  pwa: {
    runtimeCaching,
    dest: "public",
  },
});
