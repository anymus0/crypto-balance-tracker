const clientEnvVariables = require("./clientEnv");
const withPWA = require("next-pwa");

module.exports = withPWA({
  webpack5: true,
  env: {
    ethNodeURL: clientEnvVariables.ethNodeURL
  },
  pwa: {
    dest: "public",
  },
});
