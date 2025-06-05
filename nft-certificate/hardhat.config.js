require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

console.log("RPC_URL:", process.env.RPC_URL);
console.log(
  "PRIVATE_KEY:",
  process.env.PRIVATE_KEY ? "PRIVATE_KEY is set" : "PRIVATE_KEY is not set"
);
console.log(
  "ETHERSCAN_API_KEY:",
  process.env.ETHERSCAN_API_KEY
    ? "ETHERSCAN_API_KEY is set"
    : "ETHERSCAN_API_KEY is not set"
);

module.exports = {
  solidity: "0.8.28",
  networks: {
    testnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
