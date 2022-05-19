require('dotenv').config();
const withPWA = require("next-pwa");
const runtimeCaching = require("./cache");

module.exports = withPWA({
  webpack5: true,
  env: {
    ethNodeURL: process.env.ETH_NODE_URL || "http://localhost:8545",
    explorerApiBaseURL: process.env.EXPLORER_API_BASE_URL || "https://api.etherscan.io",
    explorerApiKey: process.env.EXPLORER_API_KEY || "YOUR_EXPLORER_API_KEY",
  },
  pwa: {
    runtimeCaching,
    dest: "public",
  },
});
