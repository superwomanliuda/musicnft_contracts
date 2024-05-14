// imports
const { ethers } = require("hardhat")

// async main
async function main() {
    const [deployer] = await ethers.getSigners()

    console.log("Deploying AlbumFactory with the account:", deployer.address)

    // Replace "YourAlbumImplementationAddress" with the actual address of your Album implementation
    const albumImplementationAddress =
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    // 替换为您的 LalaToken 合约的实际地址
    const lalaTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const AlbumFactory = await ethers.getContractFactory("AlbumFactory")
    const albumFactory = await AlbumFactory.deploy(
        albumImplementationAddress,
        lalaTokenAddress
    )

    // 等待合约部署完成
    await albumFactory.waitForDeployment()

    console.log("AlbumFactory address:", albumFactory.target)
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
