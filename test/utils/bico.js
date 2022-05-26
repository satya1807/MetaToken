const { Biconomy } = require("@biconomy/mexa");

const b = new Biconomy(new ethers.providers.JsonRpcProvider(process.env.RPC), {
    apiKey: process.env.BICO,
    debug: true,
});

b.onEvent(b.READY, async (aa) => {
    console.log("Bico ready");
    console.log("akdkbksdh: ", aa);
});

module.exports = b;
