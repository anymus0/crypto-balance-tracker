const clientEnvVariables = require("./clientEnv");
const withPWA = require("next-pwa");

module.exports = withPWA({
  future: {
    webpack5: true,
  },
  env: {
    ethNodeURL: clientEnvVariables.ethNodeURL,
    kucoinKey: clientEnvVariables.kucoin.key,
    kucoinSecret: clientEnvVariables.kucoin.secret,
    kucoinPasshrase: clientEnvVariables.kucoin.passhrase,
  },
  pwa: {
    dest: "public",
  },
});
