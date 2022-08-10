import Web3 from 'web3'

export const contractAddress = '0x14c71bc7dc49aa44723640d37d10fedc668ad72b'
const contractABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uuid',
        type: 'string'
      },
      {
        internalType: 'address',
        name: '_address',
        type: 'address'
      },
      {
        internalType: 'enum GitRepoContract.Permissions',
        name: '_role',
        type: 'uint8'
      },
      {
        internalType: 'string',
        name: '_key',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_iv',
        type: 'string'
      }
    ],
    name: 'grantAccess',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uuid',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_storage_address',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_integrity',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_key',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_iv',
        type: 'string'
      }
    ],
    name: 'initializeRepo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uuid',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_storage_address',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_integrity',
        type: 'string'
      }
    ],
    name: 'pushToRepo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'keys',
    outputs: [
      {
        internalType: 'string',
        name: 'key',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'iv',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    name: 'repositories',
    outputs: [
      {
        internalType: 'string',
        name: 'uuid',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'storage_address',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'integrity',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'userPermissions',
    outputs: [
      {
        internalType: 'enum GitRepoContract.Permissions',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
const rpcURL = 'https://goerli.infura.io/v3/84afcc18a6904bfe9557d4431bbbdade' // "https://rinkeby.infura.io/v3/49cc660be5284f6485525762167b6f74";

// var provider = new Provider(developerPrivateKey, rpcURL);
export const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL))
export const contractInstance = new web3.eth.Contract(contractABI, contractAddress)
