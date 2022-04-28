const EthCrypto = require('eth-crypto');

async function publicKeyEncryption(publicKey, data) {
    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey,
        data
    );

    return EthCrypto.cipher.stringify(encrypted);
}

module.exports = publicKeyEncryption;
