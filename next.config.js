const kucoin = require('./clientEnv');

const config = {
  future: {
    webpack5: true,
  },
  env: {
    kucoinKey: kucoin.key,
    kucoinSecret: kucoin.secret,
    kucoinPasshrase: kucoin.passhrase,
  },
}

module.exports = config