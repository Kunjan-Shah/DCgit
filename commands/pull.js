const fs = require('fs');
const crypto = require('crypto');
const privateKeyDecryption = require('../utils/decryptWithPrivateKey');
const pullFromIPFS = require('../utils/pullFromIPFS')
const syncRepo = require('../utils/syncRepo')

async function pull({ branch }) {
    // load dcgit.json
    const dcgit = JSON.parse(fs.readFileSync('./dcgit.json', 'utf8'));

    // create the decipher by decrypting the encryption key and IV
    const encryptionKey = await privateKeyDecryption(dcgit.userPrivateKey, dcgit.encryptedKey);
    const iv = await privateKeyDecryption(dcgit.userPrivateKey, dcgit.encryptedIV);

    const decipher = crypto.createDecipheriv('aes256', encryptionKey, iv);

    const zippedGit = await pullFromIPFS('./.git', decipher);

    await syncRepo(branch, zippedGit);

    // pull the IPFS file
    const { content } = await pullFromIPFS(dcgit.ipfsAddress);
}

module.exports = pull;
