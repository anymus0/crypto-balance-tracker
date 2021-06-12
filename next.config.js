const clientEnvVariables = require("./clientEnv");
const withPWA = require("next-pwa");

module.exports = withPWA({
  future: {
    webpack5: true,
  },
  env: {
    ethNodeURL: clientEnvVariables.ethNodeURL
  },
  pwa: {
    dest: "public",
  },
});
