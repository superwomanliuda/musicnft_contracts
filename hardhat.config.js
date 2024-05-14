require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("@nomicfoundation/hardhat-chai-matchers")

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL
const PRIVATE_KEY_ONE = process.env.PRIVATE_KEY_ONE
const PRIVATE_KEY_TWO = process.env.PRIVATE_KEY_TWO
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY_ONE, PRIVATE_KEY_TWO],
            chainId: 80001,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY_ONE, PRIVATE_KEY_TWO],
            chainId: 11155111,
        },
        localhost: {
            url: "http://127.0.0.1:8545", //将 Hardhat 配置中的 localhost 网络的 URL 从 "http://localhost:8545" 改为 "http://127.0.0.1:8545"
            chainId: 31337,
        },
    },
    solidity: "0.8.3",
}
