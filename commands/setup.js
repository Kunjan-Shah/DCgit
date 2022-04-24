const fs = require('fs')
const chalk = require('chalk')
const util = require("ethereumjs-util")
const Wallet = require('ethereumjs-wallet')

async function setup({ privateKey }) {
    // private key to 0x prefix hex
    if (privateKey.startsWith('0x') == false) {
        privateKey = '0x' + privateKey;
    }
    // verify that the private key is valid ETH private key
    const privateKeyBuffer = util.toBuffer(privateKey);
    const privateKeyBufferLength = privateKeyBuffer.length;
    if (privateKeyBufferLength !== 32) {
        console.log(chalk.redBright('Invalid private key'));
        return;
    }

    const wallet = Wallet['default'].fromPrivateKey(privateKeyBuffer);

    // create dcgit.json file
    const dcgit = {
        "userPrivateKey": privateKey,
        "userPublicKey": wallet.getPublicKey().toString('hex'),
        "userAddress": wallet.getPublicKey().toString('hex'),
    }

    await fs.promises.writeFile('./dcgit.json', JSON.stringify(dcgit));
}

module.exports = setup;
