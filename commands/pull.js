import crypto from 'crypto'
import chalk from 'chalk'
import { contract } from '../contract/contract.js'
import { config, PROPERTIES } from '../config/config.js'
import pullFromIPFS from '../utils/pullFromIPFS.js'
import syncRepo from '../utils/syncRepo.js'

export default async function pull ({ branch }) {
  try {
    const uuid = config.get(PROPERTIES.REPO_UUID)

    // create the decipher by decrypting the encryption key and IV
    const encryptionKey = config.get(PROPERTIES.ENCRYPTION_KEY)
    const iv = config.get(PROPERTIES.ENCRYPTION_IV)

    // Retrieve the repo information from the smart contract
    const { storageAddress, integrity } = await contract.getRepository(uuid)

    config.set(PROPERTIES.IPFS_ADDRESS, storageAddress)
    config.set(PROPERTIES.INTEGRITY, integrity)

    const decipher = crypto.createDecipheriv('aes256', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'))

    const zippedGit = await pullFromIPFS(storageAddress, decipher)

    await syncRepo(branch, zippedGit)

    console.log(chalk.greenBright(`Branch ${branch} synced successfully`))
  } catch (error) {
    console.log(chalk.red(error))
  }
}
