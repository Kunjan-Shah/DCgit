const Web3 = require('web3');

const contractAddress = '0x40c95d9e174f8771ac9e6fd6a4f41eb8a1e52296';
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_uuid",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_address",
            "type": "address"
          },
          {
            "internalType": "enum GitRepoContract.Permissions",
            "name": "_role",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "_key",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_iv",
            "type": "string"
          }
        ],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_uuid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_storage_address",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_integrity",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_key",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_iv",
            "type": "string"
          }
        ],
        "name": "initializeRepo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_uuid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_storage_address",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_integrity",
            "type": "string"
          }
        ],
        "name": "pushToRepo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_uuid",
            "type": "string"
          }
        ],
        "name": "getRepoInfo",
        "outputs": [
          {
            "internalType": "string",
            "name": "storage_address",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "integrity",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "keys",
        "outputs": [
          {
            "internalType": "string",
            "name": "key",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "iv",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "userPermissions",
        "outputs": [
          {
            "internalType": "enum GitRepoContract.Permissions",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    const accountAddress = '0xA6ebEcc8d075Eb5301452358e0cBF7c8Ae69d857';
    // TODO: put in ENV variables
    const developerPrivateKey = '3583a8d47eba5c2ef0f68203142eff0edd0557a76e7dbd48e933b8deca8d0874' // TODO: must be user private key
    const rpcURL = "https://rinkeby.infura.io/v3/49cc660be5284f6485525762167b6f74";

    const callEthereumInit = async () => {
      console.log("^^^^^^^^^^ function");
      // var provider = new Provider(developerPrivateKey, rpcURL);
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL))
      // // var web3 = new Web3(provider);

      // const myContract = new web3.eth.Contract(contractABI, contractAddress);
      // myContract.methods.initializeRepo(ipfsAddress, integrity, encryptedKey, encryptedIV).send({from: accountAddress})
      // .then(function(receipt){
      //     console.dir(receipt, {def: null});
      // });

      // const contract = new web3.eth.Contract(contractABI);
      const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

    //   encoded = contractInstance.methods.initializeRepo(uuid, ipfsAddress, integrity, encryptedKey, encryptedIV).encodeABI()

    //   var tx = {
    //       to : contractAddress,
    //       data : encoded,
    //       gas: 3000000
    //   }
      
    //   web3.eth.accounts.signTransaction(tx, developerPrivateKey).then(signed => {
    //       web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    //   });
      web3.eth.handleRevert = true;
      const data = await contractInstance.methods.getRepoInfo('24e745ef-90a8-4783-b88c-29e2df984070').call();
      // console.log("************* uuid = " + repo_uuid);
      console.dir(data, {depth: null});
    }

    callEthereumInit();