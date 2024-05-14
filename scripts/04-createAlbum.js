// imports
const { ethers } = require("hardhat")
const albumFactoryABI =
    require("../artifacts/contracts/AlbumFactory.sol/AlbumFactory.json").abi
const albumABI = require("../artifacts/contracts/Album.sol/Album.json").abi

// async main
async function main() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]

    console.log("Calling createAlbum with the account:", deployer.address)

    // Replace with the actual address of your AlbumFactory contract
    const albumFactoryAddress = "0x8F692C555c7f90Be9AD0912fD396d8C6527a2f14"
    const lalaTokenAddress = "0x6E434cdffA121B2EEAe947e6cE1d0d95C5fcA32A"

    // Directly create the AlbumFactory contract instance
    const albumFactory = new ethers.Contract(
        albumFactoryAddress,
        albumFactoryABI,
        deployer
    )

    console.log("Connected to AlbumFactory:", albumFactory)

    // 替换为所需的 _name, _symbol 和 _albumUri 参数
    const _name = "LiuDaDaLocal"
    const _symbol = "LDDL"
    const _albumUri =
        "ipfs://QmXo8W6qWZcafo3UqRT11eCPC3MC63sobgKof2koSJn2UM/metadata/album.json" // 替换为实际的 IPFS URI
    const _price = ethers.parseUnits("1.0", 18) // 将 1 LalaToken 转换为 wei
    const _amount = 11 // 替换为要创建的NFT数量

    // 克隆并初始化一个新的 Album 合约
    const cloneAndInitTx = await albumFactory.cloneAndInitializeAlbum(
        _name,
        _symbol,
        _albumUri,
        _price,
        _amount
    )
    const receipt = await cloneAndInitTx.wait()
    console.log("Clone and initialization successful!", receipt)

    // 获取最后一次克隆的地址
    const clonedAlbumAddress = await albumFactory.getLastClonedAlbum()
    console.log("Cloned album address:", clonedAlbumAddress)

    const clonedAlbum = new ethers.Contract(
        clonedAlbumAddress,
        albumABI,
        deployer
    )

    // 检索并打印详细信息
    const owner = await clonedAlbum.owner()
    const name = await clonedAlbum.albumName()
    const symbol = await clonedAlbum.albumSymbol()
    const albumUri = await clonedAlbum.getAlbumIPFSUri()
    const nftPrice = await clonedAlbum.salePrice()
    const nftAmount = await clonedAlbum.totalSupply()

    console.log("Album initialized with details:")
    console.log("Owner:", owner)
    console.log("Name:", name)
    console.log("Symbol:", symbol)
    console.log("IPFS URI:", albumUri)
    console.log("Current NFT Price:", nftPrice.toString())
    console.log("Current NFT Amount:", nftAmount.toString())

    // 获取第一个NFT的所有者
    const firstTokenId = 1 // 假设第一个NFT的ID为1
    const ownerOfFirstNFT = await clonedAlbum.ownerOf(firstTokenId)
    console.log("Owner of the first NFT:", ownerOfFirstNFT)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
