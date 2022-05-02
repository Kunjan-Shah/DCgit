const fs = require('fs');
const web3 = require('web3');
const crypto = require('crypto');
const chalk = require('chalk');
const privateKeyDecryption = require('../utils/decryptWithPrivateKey');
const pushFolderToIPFS = require('../utils/pushFolderToIPFS');

async function push() {
    // load dcgit.json
    const dcgit = JSON.parse(fs.readFileSync('./.dcgit.json', 'utf8'));

    // create the decipher by decrypting the encryption key and IV
    const encryptionKey = await privateKeyDecryption(dcgit.userPrivateKey, dcgit.encryptedKey);
    const iv = await privateKeyDecryption(dcgit.userPrivateKey, dcgit.encryptedIV);

    // encrypt the zip file with encryption key
    const cipher = crypto.createCipheriv('aes256', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));

    const { ipfsAddress, integrity } = await pushFolderToIPFS('./.git', cipher);
    dcgit.ipfsAddress = ipfsAddress;
    dcgit.integrity = integrity;
    // TODO: call pushToRepo
    // write dcgit.json and encrypted zip file to the repo
    fs.writeFileSync('./.dcgit.json', JSON.stringify(dcgit));
    console.log(chalk.greenBright("Pushed successfully"));
}

module.exports = push;
