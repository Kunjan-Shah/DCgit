const fs = require('fs')
const chalk = require('chalk');
const EthCrypto = require('eth-crypto');
const ora = require('ora-classic');
const publicKeyEncryption = require('../utils/encryptWithPublicKey');
const { contractInstance, web3, contractAddress } = require('../contract');

async function permit({ role, identity }) {
    try {
        // verify that the role is either "read" or "write"
        if (role !== 'read' && role !== 'write') {
            console.log(chalk.red('Error: Role must be either "read" or "write".'))
            return
        }

        // read .dcgit.json
        const fileExist = fs.existsSync('./.dcgit.json');
        if (!fileExist) {
            console.log(chalk.redBright('No dcgit.json file found. Please run "dcgit setup" first.'));
            return;
        }

        const dcgit = JSON.parse(fs.readFileSync('./.dcgit.json', 'utf8'))

        if (dcgit.uuid === undefined) {
            console.log(chalk.redBright('DCGit repo not initialized. Please run "dcgit init" first.'));
            return;
        }

        const key = dcgit.key;
        const iv = dcgit.iv;

        // encrypt the key with the identity public key
        const encryptedKey = await publicKeyEncryption(identity, key);
        const encryptedIV = await publicKeyEncryption(identity, iv);

        console.log({ encryptedKey, encryptedIV });

        console.log("Calling Smart Contract for Granting Access");

        var spinner = ora('Loading unicorns').start();
        spinner.color = 'blue';
        spinner.text = 'Please wait while ethereum processes your transaction'

        const encoded = contractInstance.methods.grantAccess(
            dcgit.uuid,
            EthCrypto.publicKey.toAddress(identity),
            role === 'read' ? 1 : 2,
            encryptedKey,
            encryptedIV
        ).encodeABI()

        const tx = {
            to: contractAddress,
            data: encoded,
            gas: 3000000
        }

        const signed = await web3.eth.accounts.signTransaction(tx, dcgit.userPrivateKey)
        await web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
        
        spinner.stop();
        console.log(chalk.greenBright("Permission added successfully"));
    } catch (error) {
        spinner.stop();
        console.log(chalk.red(error))
    }
}

module.exports = permit;
