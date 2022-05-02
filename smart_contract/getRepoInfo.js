const cred = require('./credentials.json');
const Web3 = require('web3');
const chalk = require('chalk');

const getRepoInfo = async (uuid) => {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(cred.rpcURL))
        const contractInstance = new web3.eth.Contract(cred.contractABI, cred.contractAddress);

        // const repoInfo = await contractInstance.methods.getRepoInfo(uuid).call();
        // return repoInfo

        encoded = contractInstance.methods.getRepoInfo(uuid).encodeABI()

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

  module.exports = getRepoInfo;