const fs = require('fs');
const crypto = require('crypto');
const chalk = require('chalk');
const privateKeyDecryption = require('../utils/decryptWithPrivateKey');
const pullFromIPFS = require('../utils/pullFromIPFS')
const syncRepo = require('../utils/syncRepo')

async function pull({ branch }) {
    try {
        // Load dcgit.json
        const dcgit = JSON.parse(fs.readFileSync('.dcgit.json', 'utf8'));

        // create the decipher by decrypting the encryption key and IV
        const encryptionKey = await privateKeyDecryption(dcgit.userPrivateKey, dcgit.encryptedKey);
        const iv = await privateKeyDecryption(dcgit.userPrivateKey, dcgit.encryptedIV);

        const decipher = crypto.createDecipheriv('aes256', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));

        const zippedGit = await pullFromIPFS(dcgit.IPFSAddress, decipher);

        console.log(chalk.greenBright("Zipped git pulled successfully"));

        // await syncRepo(branch, zippedGit);
    } catch (error) {
        console.log(chalk.red(error));
    }
}

module.exports = pull;
