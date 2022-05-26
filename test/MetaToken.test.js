const { expect } = require("chai");
const { ethers } = require("hardhat");
const { signTypedMessage } = require("eth-sig-util");
const bico = require("./utils/bico");
require("dotenv").config();

describe.only("Meta Token", function () {
    let token, signer, provider, pk, rawTx;

    before(async () => {
        const Token = await ethers.getContractFactory("MetaToken");
        token = await Token.attach(
            "0x3b0754ca0e63fa95e68e553a1563f038305474f4"
        );

        console.log("token:, ", token.address);

        signer = new ethers.Wallet(process.env.KEY);
        provider = await bico.getEthersProvider();
        pk = process.env.KEY;
        rawTx = {
            to: token.address,
            data: "",
            from: signer.address,
        };
        signedTx = "";
    });

    it("jhsfjh", async () => {
        rawTx.data = await token.interface.encodeFunctionData("transfer", [
            "0x2a969B6AEe9448c975b68B98Db9eC15A7c1b3162",
            ethers.utils.parseEther("1"),
        ]);

        signedTx = await signer.signTransaction(rawTx);

        console.log("Sign Tx", signedTx);
        const forwardData = await bico.getForwardRequestAndMessageToSign(
            signedTx
        );
        console.log("forward", forwardData);
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

        await provider.send("eth_sendRawTransaction", [data]);
    });
});
