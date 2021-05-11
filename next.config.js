const clientEnvVariables = require('./clientEnv')

const config = {
  future: {
    webpack5: true,
  },
  env: {
    ethNodeURL: clientEnvVariables.ethNodeURL,
    kucoinKey: clientEnvVariables.kucoin.key,
    kucoinSecret: clientEnvVariables.kucoin.secret,
    kucoinPasshrase: clientEnvVariables.kucoin.passhrase,
  },
}

module.exports = config