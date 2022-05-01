const fs = require('fs');
const crypto = require('crypto');
const chalk = require('chalk');
const publicKeyEncryption = require('../utils/encryptWithPublicKey');
const pushFolderToIPFS = require('../utils/pushFolderToIPFS');
const { randomUUID } = require('crypto');
const initializeRepo = require('../smart_contract/initializeRepo')
const getRepoInfo = require('../smart_contract/getRepoInfo')

async function init() {
  try {
    // Load user data file
    // TODO: what if file does not exist?
    const dcgit = JSON.parse(await fs.promises.readFile('.dcgit.json', 'utf8'));
    // Generating uuid for the repo
    const uuid = randomUUID();
    // Generate a 256 bit symmetric encrytion key and initialization vector
    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // encrypt the key with the user's public key
    const encryptedKey = await publicKeyEncryption(dcgit.userPublicKey, encryptionKey.toString('hex'));
    const encryptedIV = await publicKeyEncryption(dcgit.userPublicKey, iv.toString('hex'));

    // add the encrypted key to dcgit.json
    dcgit.encryptedKey = encryptedKey;
    dcgit.encryptedIV = encryptedIV;

    // push encrypted repo to IPFS
    const cipher = crypto.createCipheriv('aes256', encryptionKey, iv);
    const { ipfsAddress, integrity } = await pushFolderToIPFS('./.git', cipher);
    dcgit.ipfsAddress = ipfsAddress;
    dcgit.integrity = integrity;
    dcgit.uuid = uuid;

    console.log({ ipfsAddress, integrity });

    await fs.promises.writeFile('.dcgit.json', JSON.stringify(dcgit));

    console.log(chalk.greenBright("DCgit repo initialized successfully"));

    
    // call initializeRepo smart contract function
    // await initializeRepo(uuid, ipfsAddress, integrity, encryptedKey, encryptedIV)
    const updatedRepoInfo = await getRepoInfo(uuid);
    console.log(updatedRepoInfo);

  } catch (error) {
    console.log(chalk.red(error));
  }
}

module.exports = init;
