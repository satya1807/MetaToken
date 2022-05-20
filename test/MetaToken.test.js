const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Biconomy } = require("@biconomy/mexa");
const { signTypedMessage } = require("eth-sig-util");

require("dotenv").config();

describe("Meta Token", function () {
    let token;

    before(async () => {
        const Token = await ethers.getContractFactory("MetaToken");
        token = await Token.attach(
            "0x3b0754CA0E63fA95e68e553A1563F038305474F4"
        );

        signer = new ethers.Wallet(process.env.KEY);

        bico = new Biconomy(
            new ethers.providers.JsonRpcProvider(process.env.RPC),
            {
                apiKey: process.env.BICO,
                debug: true,
            }
        );

        provider = await bico.getEthersProvider();
        pk = process.env.KEY;

        rawTx = {
            to: ethers.utils.getAddress(token.address),
            data: "",
            from: signer.address,
        };

        contractInterface = token.interface;
    });

    xit(".. should test configuration", async function () {
        expect(await token.name()).to.be.equal("MetaToken");
    });

    it(".. should transfer tokens to another user", async () => {
        rawTx.data = contractInterface.encodeFunctionData("transfer", [
            "0x2a969B6AEe9448c975b68B98Db9eC15A7c1b3162",
            ethers.utils.parseEther("1"),
        ]);

        let signedTx = await signer.signTransaction(rawTx);
        const forwardData = await bico.getForwardRequestAndMessageToSign(
            signedTx
        );

        console.log(forwardData);

        const signature = signTypedMessage(
            new Buffer.from(pk, "hex"),
            { data: forwardData.eip712Format },
            "V3"
        );

        let data = {
            signature: signature,
            forwardRequest: forwardData.request,
            rawTransaction: signedTx,
            signatureType: bico.EIP712_SIGN,
        };

        let tx = await provider.send("eth_sendRawTransaction", [data]);
        console.log(tx);
    });
});
