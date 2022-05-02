const cred = require('./credentials.json');
const Web3 = require('web3');

const pushToRepo = async (uuid, ipfsAddress, integrity, encryptedKey, encryptedIV) => {
    try {
        console.log("^^^^^^^^^^ function");
        const web3 = new Web3(new Web3.providers.HttpProvider(cred.rpcURL))
        const contractInstance = new web3.eth.Contract(cred.contractABI, cred.contractAddress);

        encoded = contractInstance.methods.initializeRepo(uuid, ipfsAddress, integrity, encryptedKey, encryptedIV).encodeABI()

        var tx = {
            to : cred.contractAddress,
            data : encoded,
            gas: 3000000
        }
        
        // TODO: change developerPrivateKey to clientPrivateKey
        web3.eth.accounts.signTransaction(tx, cred.developerPrivateKey).then(signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
        });
    }
    catch(error) {
        console.log(chalk.red(error));
    }
  }

  module.exports = pushToRepo;