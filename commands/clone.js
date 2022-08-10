import fs from 'fs'
import crypto from 'crypto'
import chalk from 'chalk'
import { contractInstance } from '../contract.js'
import privateKeyDecryption from '../utils/decryptWithPrivateKey.js'
import pullFromIPFS from '../utils/pullFromIPFS.js'
import cloneRepo from '../utils/cloneRepo.js'

export default async function clone ({ uuid }) {
  try {
    // Load dcgit.json
    const dcgit = JSON.parse(fs.readFileSync('.dcgit.json', 'utf8'))

    dcgit.uuid = uuid

    const keys = await contractInstance.methods.keys(uuid, dcgit.userAddress).call()

    console.log(keys)

    // create the decipher by decrypting the encryption key and IV
    const encryptionKey = await privateKeyDecryption(dcgit.userPrivateKey, keys.key)
    const iv = await privateKeyDecryption(dcgit.userPrivateKey, keys.iv)

    dcgit.key = encryptionKey
    dcgit.iv = iv

    // Retrieve the repo information from the smart contract
    const repo = await contractInstance.methods.repositories(dcgit.uuid).call()

    console.log(repo, repo.uuid)

    dcgit.ipfsAddress = repo.storage_address
    dcgit.integrity = repo.integrity

    const decipher = crypto.createDecipheriv('aes256', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'))

    const zippedGit = await pullFromIPFS(dcgit.ipfsAddress, decipher)
    console.log('comes here')
    await cloneRepo(zippedGit)
    console.log('comes here 2')
    await fs.promises.writeFile('.dcgit.json', JSON.stringify(dcgit))

    console.log(chalk.greenBright('Repo cloned successfully'))
  } catch (error) {
    console.log(chalk.red(error))
  }
}
