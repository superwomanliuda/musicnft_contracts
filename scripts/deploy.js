// imports
const { ethers } = require("hardhat")

// async main
async function main() {
    const Album = await ethers.getContractFactory("Album")
    console.log("Deploying contract...")
    const album = await Album.deploy({ gasLimit: 5000000 })
    await album.deployed()
    console.log(`Deployed contract to: ${album.address}`)
}

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

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
