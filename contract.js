const Web3 = require('web3');

const contractAddress = '0xc38e0413acbc40fd6563b1e1a9f869f1fed1e8a4';
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
            },
            {
                "internalType": "string",
                "name": "iv",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "key",
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
const rpcURL = "https://rinkeby.infura.io/v3/49cc660be5284f6485525762167b6f74";

// var provider = new Provider(developerPrivateKey, rpcURL);
const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL))
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contractAddress, contractInstance };