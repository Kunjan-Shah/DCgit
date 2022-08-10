import fs from 'fs'
import crypto from 'crypto'
import chalk from 'chalk'
import ora from 'ora-classic'
import { contractInstance, web3, contractAddress } from '../contract.js'
import pushFolderToIPFS from '../utils/pushFolderToIPFS.js'

export default async function push () {
  const spinner = ora('Loading unicorns')

  try {
    // load dcgit.json
    const dcgit = JSON.parse(fs.readFileSync('./.dcgit.json', 'utf8'))

    // create the decipher by decrypting the encryption key and IV
    const encryptionKey = dcgit.key
    const iv = dcgit.iv

    // encrypt the zip file with encryption key
    const cipher = crypto.createCipheriv('aes256', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'))

    const { ipfsAddress, integrity } = await pushFolderToIPFS('./.git', cipher)
    dcgit.ipfsAddress = ipfsAddress
    dcgit.integrity = integrity
    // TODO: call pushToRepo
    console.log('Calling Smart Contract for pushing repo')

    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Please wait while ethereum processes your transaction'

    const encoded = contractInstance.methods.pushToRepo(dcgit.uuid, ipfsAddress, integrity).encodeABI()

    const tx = {
      to: contractAddress,
      data: encoded,
      gas: 3000000
    }

    const signed = await web3.eth.accounts.signTransaction(tx, dcgit.userPrivateKey)
    await web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    // write dcgit.json and encrypted zip file to the repo
    fs.writeFileSync('./.dcgit.json', JSON.stringify(dcgit))

    spinner.stop()
    console.log(chalk.greenBright('Pushed successfully'))
  } catch (error) {
    console.error(chalk.red(error))
  } finally {
    spinner.stop()
  }
}
