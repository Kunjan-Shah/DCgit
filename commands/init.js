const fs = require('fs');
const crypto = require('crypto');
const chalk = require('chalk');
const publicKeyEncryption = require('../utils/encryptWithPublicKey');
const pushFolderToIPFS = require('../utils/pushFolderToIPFS');
const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const { contractInstance, web3, contractAddress } = require('../contract');

async function init() {
  try {
    // Load user data file
    const fileExist = fs.existsSync('./.dcgit.json');
    if (!fileExist) {
      console.log(chalk.redBright('No dcgit.json file found. Please run "dcgit setup" first.'));
      return;
    }
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
    console.log("Calling Smart Contract for initialize repo");

    encoded = contractInstance.methods.initializeRepo(uuid, ipfsAddress, integrity, encryptedKey, encryptedIV).encodeABI()

    const tx = {
      to: contractAddress,
      data: encoded,
      gas: 3000000
    }

    const signed = await web3.eth.accounts.signTransaction(tx, dcgit.userPrivateKey)
    web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
  } catch (error) {
    console.log(chalk.red(error));
  }
}

module.exports = init;