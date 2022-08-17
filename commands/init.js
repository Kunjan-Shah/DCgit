import crypto from 'crypto'
import chalk from 'chalk'
import ora from 'ora-classic'
import publicKeyEncryption from '../utils/encryptWithPublicKey.js'
import { contract } from '../contract/contract.js'
import { config, PROPERTIES } from '../config/config.js'
import pushFolderToIPFS from '../utils/pushFolderToIPFS.js'

export default async function init (uuid) {
  const spinner = ora('Loading unicorns')

  try {
    // Generate a 256 bit symmetric encrytion key and initialization vector
    const encryptionKey = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)

    // encrypt the key with the user's public key
    const encryptedKey = await publicKeyEncryption(config.get('userPublicKey'), encryptionKey.toString('hex'))
    const encryptedIV = await publicKeyEncryption(config.get('userPublicKey'), iv.toString('hex'))

    config.set(PROPERTIES.REPO_UUID, uuid)
    config.set(PROPERTIES.ENCRYPTION_KEY, encryptionKey.toString('hex'))
    config.set(PROPERTIES.ENCRYPTION_IV, iv.toString('hex'))

    // push encrypted repo to IPFS
    const cipher = crypto.createCipheriv('aes256', encryptionKey, iv)
    const { ipfsAddress, integrity } = await pushFolderToIPFS('./.git', cipher)

    config.set(PROPERTIES.IPFS_ADDRESS, ipfsAddress)
    config.set(PROPERTIES.INTEGRITY, integrity)

    console.info('Calling Smart Contract for initialize repo')

    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Please wait while polygon processes your transaction'

    const receipt = await contract.init(uuid, ipfsAddress, integrity, encryptedKey, encryptedIV)

    spinner.stop()

    console.log(chalk.greenBright('Repo initialized successfully in transation: ' + receipt.transactionHash))
  } catch (error) {
    spinner.stop()
    console.error(chalk.red(error))
  }
}
