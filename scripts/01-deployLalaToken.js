const { ethers } = require("hardhat")

async function main() {
    const [deployer] = await ethers.getSigners()
    console.log("Deploying contracts with the account:", deployer.address)

    // 获取合约工厂
    const LalaToken = await ethers.getContractFactory("LalaToken")

    // 部署合约
    console.log("Deploying LalaToken contract...")
    const lalaToken = await LalaToken.deploy()

    // 等待合约部署完成
    await lalaToken.waitForDeployment()

    console.log("LalaToken contract deployed to:", lalaToken.target)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
