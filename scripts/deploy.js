const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const forwarder = "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b";
    const Token = await hre.ethers.getContractFactory("MetaToken");
    const token = await Token.deploy(
        "MetaToken",
        "MT",
        ethers.utils.parseEther("1000"),
        forwarder
    );

    await token.deployed();

    console.log("Token deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
