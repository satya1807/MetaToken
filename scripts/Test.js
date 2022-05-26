const { ethers, network } = require("hardhat");
const { Biconomy } = require("@biconomy/mexa");
const { signTypedMessage } = require("eth-sig-util");

require("dotenv").config();

const main = async () => {
    let token;
    const Token = await ethers.getContractFactory("MetaToken");
    token = await Token.attach("0x3b0754CA0E63fA95e68e553A1563F038305474F4");

    pk = process.env.KEY;
    signer = new ethers.Wallet(pk);

    bico = new Biconomy(
        new ethers.providers.JsonRpcProvider(
            "https://matic-mumbai.chainstacklabs.com"
        ),
        {
            apiKey: process.env.BICO,
        }
    );

    provider = await bico.getEthersProvider();

    console.log(
        "Balance: ",
        (await provider.getBalance(signer.address)).toString()
    );

    rawTx = {
        to: ethers.utils.getAddress(token.address),
        data: "",
        from: signer.address,
    };

    contractInterface = token.interface;
    bico.onEvent(bico.READY, async () => {
        rawTx.data = contractInterface.encodeFunctionData("transfer", [
            "0x2a969B6AEe9448c975b68B98Db9eC15A7c1b3162",
            ethers.utils.parseEther("1"),
        ]);

        let signedTx = await signer.signTransaction(rawTx);
        const forwardData = await bico.getForwardRequestAndMessageToSign(
            signedTx
        );

        // console.log(forwardData);

        const signature = signTypedMessage(
            new Buffer.from(pk, "hex"),
            { data: forwardData.eip712Format },
            "V3"
        );

        data = {
            signature: signature,
            forwardRequest: forwardData.request,
            rawTransaction: signedTx,
            signatureType: bico.EIP712_SIGN,
        };
        console.log("Bico ready");
    }).onEvent(bico.ERROR, (error, message) => {});
};

main();
