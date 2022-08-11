import Web3 from 'web3'
import { config, PROPERTIES } from './config.js'

class Contract {
  constructor () {
    this.rpcURL = 'https://polygon-mumbai.g.alchemy.com/v2/piyrMa1vttCRy_IGCuHtIl6FkojIH6e8'
    this.contractAddress = '0x2db0fb82a08d4222202cf646dc4412b065c24022'
    this.contractABI = [
      {
        inputs: [
          {
            internalType: 'string',
            name: '_uuid',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_storageAddress',
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
        name: 'init',
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
            name: '_uuid',
            type: 'string'
          },
          {
            internalType: 'address',
            name: '_address',
            type: 'address'
          },
          {
            internalType: 'enum DCGit.Permissions',
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
        name: 'permit',
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
            name: '_storageAddress',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_integrity',
            type: 'string'
          }
        ],
        name: 'push',
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
            name: 'storageAddress',
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
            internalType: 'enum DCGit.Permissions',
            name: '',
            type: 'uint8'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ]
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcURL))
    this.contractInstance = new this.web3.eth.Contract(this.contractABI, this.contractAddress)
  }

  async send (encoded) {
    // Creating a signing account from a private key
    const signer = this.web3.eth.accounts.privateKeyToAccount(
      config.get(PROPERTIES.USER_PRIVATE_KEY)
    )

    this.web3.eth.accounts.wallet.add(signer)

    const tx = {
      from: signer.address,
      to: this.contractAddress,
      data: encoded,
      gas: 3000000,
      gasPrice: this.web3.utils.toWei('10', 'gwei')
    }

    // Sending the transaction to the network
    return await this.web3.eth
      .sendTransaction(tx)
      .once('transactionHash', (txhash) => {
        console.log(': Mining transaction ...')
        console.log(`Transaction hash: ${txhash}`)
      })
  }

  async init (uuid, storageAddress, integrity, key, iv) {
    const encoded = this.contractInstance.methods
      .init(uuid, storageAddress, integrity, key, iv)
      .encodeABI()

    return await this.send(encoded)
  }

  async permit (uuid, address, role, key, iv) {
    const encoded = this.contractInstance.methods
      .permit(uuid, address, role, key, iv)
      .encodeABI()

    return await this.send(encoded)
  }

  async push (uuid, storageAddress, integrity) {
    const encoded = this.contractInstance.methods
      .push(uuid, storageAddress, integrity)
      .encodeABI()

    return await this.send(encoded)
  }

  async getKeys (uuid) {
    return await this.contractInstance.methods
      .keys(uuid, config.get(PROPERTIES.USER_ADDRESS))
      .call()
  }

  async getRepository (uuid) {
    return await this.contractInstance.methods
      .repositories(uuid)
      .call()
  }

  async getUserPermissions (uuid) {
    return await this.contractInstance.methods
      .userPermissions(uuid, config.get(PROPERTIES.USER_ADDRESS))
      .call()
  }
}

Contract.instance = new Contract()

export const contract = Contract.instance
