import chalk from 'chalk'
import ora from 'ora-classic'
import EthCrypto from 'eth-crypto'
import assert from 'assert'
import publicKeyEncryption from '../utils/encryptWithPublicKey.js'
import { contract } from '../contract/contract.js'
import { config, PROPERTIES } from '../config/config.js'

export default async function permit ({ role, identity }) {
  assert(config.get(PROPERTIES.SETUP) === true, 'Please run `dcgit setup` first')
  assert(config.get(PROPERTIES.REPO_UUID) !== undefined, 'Please run `dcgit clone` or `dcgit init` first')

  const spinner = ora('Loading unicorns')

  try {
    // verify that the role is either "read" or "write"
    if (role !== 'read' && role !== 'write') {
      console.log(chalk.red('Error: Role must be either "read" or "write".'))
      return
    }

    // encrypt the key with the identity public key
    const encryptedKey = await publicKeyEncryption(identity, config.get(PROPERTIES.ENCRYPTION_KEY))
    const encryptedIV = await publicKeyEncryption(identity, config.get(PROPERTIES.ENCRYPTION_IV))

    console.log({ encryptedKey, encryptedIV })

    console.log('Calling Smart Contract for Granting Access')

    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Please wait while polygon processes your transaction'

    const receipt = await contract.permit(config.get(PROPERTIES.REPO_UUID),
      EthCrypto.publicKey.toAddress(identity),
      role === 'read' ? 1 : 2,
      encryptedKey,
      encryptedIV
    )

    spinner.stop()

    console.log(chalk.greenBright('Permission added successfully in transaction: ' + receipt.transactionHash))
  } catch (error) {
    spinner.stop()
    console.log(chalk.red(error))
  }
}
