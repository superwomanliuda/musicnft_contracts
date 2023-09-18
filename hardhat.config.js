require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

const MUMBAI_RPC_URL =
  process.env.MUMBAI_RPC_URL

  const PRIVATE_KEY =
  process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
  },
  solidity: "0.8.3",
};
