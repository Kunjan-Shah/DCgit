import fs from 'fs'
import crypto from 'crypto'
import chalk from 'chalk'
import ora from 'ora-classic'
import publicKeyEncryption from '../utils/encryptWithPublicKey.js'
import { contractInstance, web3, contractAddress } from '../contract.js'
import pushFolderToIPFS from '../utils/pushFolderToIPFS.js'

export default async function init ({ uuid }) {
  const spinner = ora('Loading unicorns')

  try {
    // Load user data file
    const fileExist = fs.existsSync('./.dcgit.json')
    if (!fileExist) {
      console.log(chalk.redBright('No dcgit.json file found. Please run "dcgit setup" first.'))
      return
    }
    const dcgit = JSON.parse(await fs.promises.readFile('.dcgit.json', 'utf8'))

    // Generate a 256 bit symmetric encrytion key and initialization vector
    const encryptionKey = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)

    // encrypt the key with the user's public key
    const encryptedKey = await publicKeyEncryption(dcgit.userPublicKey, encryptionKey.toString('hex'))
    const encryptedIV = await publicKeyEncryption(dcgit.userPublicKey, iv.toString('hex'))

    // add the encrypted key to dcgit.json
    dcgit.key = encryptionKey.toString('hex')
    dcgit.iv = iv.toString('hex')

    // push encrypted repo to IPFS
    const cipher = crypto.createCipheriv('aes256', encryptionKey, iv)
    const { ipfsAddress, integrity } = await pushFolderToIPFS('./.git', cipher)
    dcgit.ipfsAddress = ipfsAddress
    dcgit.integrity = integrity
    dcgit.uuid = uuid

    await fs.promises.writeFile('.dcgit.json', JSON.stringify(dcgit))

    console.info('Calling Smart Contract for initialize repo')

    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Please wait while ethereum processes your transaction'

    const encoded = contractInstance.methods.initializeRepo(uuid, ipfsAddress, integrity, encryptedKey, encryptedIV).encodeABI()

    const tx = {
      to: contractAddress,
      data: encoded,
      gas: 3000000
    }

    const signed = await web3.eth.accounts.signTransaction(tx, dcgit.userPrivateKey)
    await web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)

    console.log(chalk.greenBright('Repo initialized successfully with uuid: ' + uuid))
  } catch (error) {
    console.error(chalk.red(error))
  } finally {
    spinner.stop()
  }
}
