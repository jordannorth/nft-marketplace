require("@nomiclabs/hardhat-waffle");
//Allows us to read from local file system as can be seen below 
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "4ec9fb124f674715873ae917e78d8701";

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
