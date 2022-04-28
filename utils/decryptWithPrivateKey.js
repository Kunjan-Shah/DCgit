const ethEcies = require("eth-ecies");

function privateKeyDecryption(privateKey, data) {
    const userPrivateKey = new Buffer(String(privateKey), 'hex');
    const bufferData = new Buffer(String(data), 'hex');

    const encryptedData = ethEcies.decrypt(userPrivateKey, bufferData);

    return encryptedData.toString('base64')
}

module.exports = privateKeyDecryption;
