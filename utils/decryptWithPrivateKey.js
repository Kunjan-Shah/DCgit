const EthCrypto = require('eth-crypto');

/**
 * 
 * @param {String} privateKey 
 * @param {String} data 
 * @returns {String} encrypted data
 */
async function privateKeyDecryption(privateKey, data) {
    const encryptedObject = EthCrypto.cipher.parse(data);

    const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encryptedObject
    );

    return decrypted;
}

module.exports = privateKeyDecryption;
