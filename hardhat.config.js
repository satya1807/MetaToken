require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    solidity: "0.8.9",

    networks: {
        mumbai: {
            accounts: [process.env.KEY],
            url: process.env.RPC,
        },
    },
};
