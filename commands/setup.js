const fs = require('fs')
const chalk = require('chalk')
const EthCrypto = require('eth-crypto');

async function setup({ privateKey }) {
    // private key to 0x prefix hex
    if (privateKey.startsWith('0x') == false) {
        privateKey = '0x' + privateKey;
    }
    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);

    // create dcgit.json file
    const dcgit = {
        "userPrivateKey": privateKey,
        "userPublicKey": publicKey,
        "userAddress": EthCrypto.publicKey.toAddress(publicKey),
    }

    await fs.promises.writeFile('./dcgit.json', JSON.stringify(dcgit));
}

module.exports = setup;
