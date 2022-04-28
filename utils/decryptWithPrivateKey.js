const EthCrypto = require('eth-crypto');

async function privateKeyDecryption(privateKey, data) {
    console.log({data});
    const encryptedObject = EthCrypto.cipher.parse(data);

    console.log({ encryptedObject })

    const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encryptedObject
    );

    return decrypted;
}

module.exports = privateKeyDecryption;
