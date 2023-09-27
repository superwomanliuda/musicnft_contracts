require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ethers")
require("@nomicfoundation/hardhat-chai-matchers")

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL

const PRIVATE_KEY = process.env.PRIVATE_KEY

task("createNFT", "Creates an NFT")
    .addParam("tokenuri", "The tokenuri for the NFT")
    .setAction(async (taskArgs) => {
        const { tokenuri } = taskArgs

        const [deployer] = await ethers.getSigners()
        console.log("Deploying NFT with account:", deployer.address)

        const Contract = await ethers.getContractFactory("Album") // 替换为你的合约名称
        const contract = await Contract.attach(
            "0x032f3d5c544dAf8E98f1Cb639259f360a5a3Ca85"
        ) // 替换为你的合约地址

        try {
            const tx = await contract.createToken(tokenuri)
            await tx.wait()
            console.log("NFT created successfully!")
        } catch (error) {
            console.error("Failed to create NFT:", error)
        }
    })

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
}
