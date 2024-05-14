const { ethers } = require("hardhat")

// async main
async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[1]
    console.log("Deploying NFT with account:", deployer.address)

    // 你的代理合约地址
    const proxyAddress = "0x75537828f2ce51be7289709686A69CbFDbB714F1"

    // 连接到代理合约
    const Album = await ethers.getContractFactory("Album")
    const album = Album.attach(proxyAddress).connect(deployer)

    // Retrieve and print the details
    const owner = await album.owner()
    const name = await album.albumName()
    const symbol = await album.albumSymbol()

    console.log("Owner:", owner)
    console.log("Name:", name)
    console.log("Symbol:", symbol)

    // 确保提供了有效的 token URI
    const tokenid = "1" // 替换为实际的 tokenid

    try {
        const tx = await album.burnToken(tokenid)
        await tx.wait()
        console.log("NFT deleted successfully!")
    } catch (error) {
        console.error("Failed to delete NFT:", error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
