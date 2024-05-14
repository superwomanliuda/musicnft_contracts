// 引入必要的模块
const fs = require("fs")
const { ethers, network } = require("hardhat")
const frontEndContractsFile =
    "../musicNFT-client-side-moralis-firebase/src/constants/contractAddress.json"
const frontEndAbiLocation =
    "../musicNFT-client-side-moralis-firebase/src/constants/abi/"

const contracts = {
    LalaToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    Album: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    AlbumFactory: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
}

async function main() {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        await updateContractAddresses()
        for (const [name, address] of Object.entries(contracts)) {
            await updateAbi(name, address)
        }
        console.log("Front end updated successfully!")
    }
}

async function updateContractAddresses() {
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )

    if (network.config.chainId.toString() in contractAddresses) {
        contractAddresses[network.config.chainId.toString()] = {
            ...contractAddresses[network.config.chainId.toString()],
            ...contracts,
        }
    } else {
        contractAddresses[network.config.chainId.toString()] = { ...contracts }
    }

    fs.writeFileSync(
        frontEndContractsFile,
        JSON.stringify(contractAddresses, null, 2)
    )
}

async function updateAbi(contractName, address) {
    const contract = await ethers.getContractAt(contractName, address)
    const abiJson = contract.interface.formatJson()
    fs.writeFileSync(
        `${frontEndAbiLocation}/${contractName}.json`,
        abiJson,
        "utf8"
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
