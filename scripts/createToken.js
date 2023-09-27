const { ethers } = require("ethers")
require("dotenv").config()
const fs = require("fs")

// 1. 配置你的以太坊网络提供者，这里使用了Infura作为例子
const providerUrl = process.env.MUMBAI_RPC_URL
const privateKey = process.env.PRIVATE_KEY
const provider = new ethers.providers.JsonRpcProvider(providerUrl)

// 2. 使用你的私钥连接到以太坊网络
const wallet = new ethers.Wallet(privateKey, provider)

// 3. 部署合约
const contractAddress = "0x032f3d5c544dAf8E98f1Cb639259f360a5a3Ca85" // 合约部署后的地址
const abi = JSON.parse(
    fs.readFileSync("artifacts/contracts/Album.sol/Album.json")
).abi

const contract = new ethers.Contract(contractAddress, abi, wallet)

// 4. 调用 createToken 函数来创建NFT
async function createNFT() {
    try {
        const tokenURI =
            "ipfs://QmcuMjbk9vRbC5xrg3Sjb3c9yW2iXrktMRdRPuhpNET7vC/metadata/2.json"

        const tx = await contract.createToken(tokenURI)

        // 等待交易被确认
        await tx.wait()

        console.log("NFT 创建成功！")
    } catch (error) {
        console.error("NFT 创建失败：", error)
    }
}

createNFT()
