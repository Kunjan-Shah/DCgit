const ethEcies = require('eth-ecies');

function publicKeyEncryption(publicKey, data) {
    const userPublicKey = new Buffer(String(publicKey), 'hex');
    const bufferData = new Buffer(String(data), 'hex');

    const encryptedData = ethEcies.encrypt(userPublicKey, bufferData);

    return encryptedData.toString('base64')
}

module.exports = publicKeyEncryption;
