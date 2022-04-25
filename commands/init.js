const fs = require('fs');
const web3 = require('web3');
const crypto = require('crypto');
const chalk = require('chalk');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');
const publicKeyEncryption = require('./encryptWithPublicKey');

function init() {
  // load dcgit.json
  const dcgit = JSON.parse(fs.readFileSync('./dcgit.json', 'utf8'));

  // 1. Generate a 256 bit symmetric encrytion key and initialization vector
  const encryptionKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  // encrypt the key with the user's public key
  const encryptedKey = publicKeyEncryption(dcgit.userPublicKey, encryptionKey);
  const encryptedIV = publicKeyEncryption(dcgit.userPublicKey, iv);

  // add the encrypted key to dcgit.json
  dcgit.encryptedKey = encryptedKey;
  dcgit.encrytedIV = encryptedIV;

  // zip the .git folder
  const zip = new AdmZip();

  zip.addLocalFolder('./.git'); // use "git reset --hard" to recover the repo

  // encrypt the zip file with encryption key
  const cipher = crypto.createCipheriv('aes256', encryptionKey, iv);
  const encryptedZip = cipher.update(zip.toBuffer(), 'binary', 'binary') + cipher.final('binary');;

  // add the SHA256 hash of the encrypted zip file to dcgit.json
  dcgit.integrity = crypto.createHash('sha256').update(encryptedZip).digest('hex');

  // write dcgit.json and encrypted zip file to the repo
  fs.writeFileSync('./dcgit.json', JSON.stringify(dcgit));
  fs.writeFileSync('./dcgit.zip', encryptedZip);

  // push the dcgit.zip to IPFS and get the IPFS hash to be stored in dcgit.json
  console.log(chalk.greenBright('Pushing dcgit.zip to IPFS...'));
  exec('ipfs add dcgit.zip', (err, stdout, stderr) => {
    if (err) {
      console.log(chalk.redBright('Failed to push dcgit.zip to IPFS'));
      return;
    }
    const ipfsHash = stdout.split(' ')[1];
    dcgit.ipfsHash = ipfsHash;
    fs.writeFileSync('./dcgit.json', JSON.stringify(dcgit));
    console.log(chalk.greenBright('Successfully pushed dcgit.zip to IPFS'));
  });

  console.log(chalk.greenBright("DCgit repo initialized successfully"));
  //   ethereum.request({ method: "eth_requestAccounts" });

  //   const rpcURL = "https://rinkeby.infura.io/v3/49cc660be5284f6485525762167b6f74";
  //   const web3 = new Web3(rpcURL);
  //   let account;

  //    // here is our contract Address, which we grabbed from Remix
  // let contractAddress = '0xA6ebEcc8d075Eb5301452358e0cBF7c8Ae69d857';


  // // here is our function to make our smart contract call! window.ethereum.selectedAddress is our connected metamask account,
  // // contract address is the one we deployed
  // // value is 0 because we are not putting any arguments to this function call
  // // gasPrice is 0 because a read function in solidity does not cost gas
  // // gas has to have a minumum of 21064, when making read only function calls, but no gas is actually consumed
  // // data is our function hash from our complication details in Remix
  // // notice that our paramaters must be in Hexadecimal
  // // finnaly, our result is changed into a number with the web3 utility method, otherwise our result would be a hexadecimal

  // const handleClick = async () => {
  //     let account = window.ethereum.selectedAddress
  //         window.ethereum
  //           .request({
  //             method: 'eth_call',
  //             params: [
  //               {
  //                 from: account,
  //                 to: contractAddress,
  //                 value: '0x0',
  //                 gasPrice: '0x0',
  //                 gas: '0x30000',
  //                 data: '0x2e64cec1'
  //               },
  //             ],
  //           })
  //           .then((result) => {
  //             console.log (web3.utils.hexToNumber(result))
  //             }).catch((error) => {
  //               console.log(error)
  //             })}

  //   console.log(chalk.greenBright("DCgit repo initialized successfully"));
}

module.exports = init;
