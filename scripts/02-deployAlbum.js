// imports
const { ethers } = require("hardhat")

// async main
async function main() {
    const [deployer] = await ethers.getSigners()

    console.log("Deploying Album with the account:", deployer.address)

    const Album = await ethers.getContractFactory("Album")
    const album = await Album.deploy()

    // 等待合约部署完成
    await album.waitForDeployment()

    console.log("Album address:", album.target)
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

/*const Album = await ethers.getContractFactory("Album")
    console.log("Deploying contract...")
    const album = await Album.deploy({ gasLimit: 5000000 })
    await album.deploy()
    console.log(`Deployed contract to: ${album.address}`)*/

// async function verify(contractAddress, args) {
/*const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}*/
