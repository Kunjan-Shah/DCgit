import crypto from 'crypto'
import chalk from 'chalk'
import ora from 'ora-classic'
import { contract } from '../contract/contract.js'
import { config, PROPERTIES } from '../config/config.js'
import pushFolderToIPFS from '../utils/pushFolderToIPFS.js'

export default async function push () {
  const spinner = ora('Loading unicorns')

  try {
    const uuid = config.get(PROPERTIES.REPO_UUID)

    // create the decipher by decrypting the encryption key and IV
    const key = config.get(PROPERTIES.ENCRYPTION_KEY)
    const iv = config.get(PROPERTIES.ENCRYPTION_IV)

    // encrypt the zip file with encryption key
    const cipher = crypto.createCipheriv('aes256', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'))

    const { ipfsAddress, integrity } = await pushFolderToIPFS('./.git', cipher)

    config.set(PROPERTIES.IPFS_ADDRESS, ipfsAddress)
    config.set(PROPERTIES.INTEGRITY, integrity)

    console.log('Calling Smart Contract for pushing repo')

    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Please wait while polygon processes your transaction'

    const receipt = await contract.push(uuid, ipfsAddress, integrity)

    spinner.stop()
    console.log(chalk.greenBright('Pushed successfully in transation: ' + receipt.transactionHash))
  } catch (error) {
    spinner.stop()
    console.error(chalk.red(error))
  }
}
