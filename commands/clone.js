import crypto from 'crypto'
import chalk from 'chalk'
import ora from 'ora-classic'
import assert from 'assert'
import { contract } from '../contract/contract.js'
import { config, PROPERTIES } from '../config/config.js'
import privateKeyDecryption from '../utils/decryptWithPrivateKey.js'
import pullFromIPFS from '../utils/pullFromIPFS.js'
import cloneRepo from '../utils/cloneRepo.js'

export default async function clone (uuid) {
  assert(config.get(PROPERTIES.SETUP) === true, 'Please run `dcgit setup` first')

  const spinner = ora('Loading unicorns')

  try {
    spinner.start()
    spinner.color = 'blue'
    spinner.text = `Cloning into ${uuid}`

    config.set(PROPERTIES.REPO_UUID, uuid)

    const keys = await contract.getKeys(uuid)

    if (keys.key === '' || keys.iv === '') {
      throw new Error('No keys found for this repository. Are you sure you have permission to access this repository?')
    }

    // create the decipher by decrypting the encryption key and IV
    const encryptionKey = await privateKeyDecryption(config.get(PROPERTIES.USER_PRIVATE_KEY), keys.key)
    const iv = await privateKeyDecryption(config.get(PROPERTIES.USER_PRIVATE_KEY), keys.iv)

    config.set(PROPERTIES.ENCRYPTION_KEY, encryptionKey)
    config.set(PROPERTIES.ENCRYPTION_IV, iv)

    // Retrieve the repo information from the smart contract
    const { storageAddress, integrity } = await contract.getRepository(uuid)

    config.set(PROPERTIES.IPFS_ADDRESS, storageAddress)
    config.set(PROPERTIES.INTEGRITY, integrity)

    const decipher = crypto.createDecipheriv('aes256', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'))

    const zippedGit = await pullFromIPFS(storageAddress, decipher)
    await cloneRepo(zippedGit)

    spinner.stop()
    console.log(chalk.greenBright('Repo cloned successfully'))
  } catch (error) {
    spinner.stop()
    console.log(chalk.red(error))
  }
}
