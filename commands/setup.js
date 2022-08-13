import chalk from 'chalk'
import EthCrypto from 'eth-crypto'
import ora from 'ora-classic'
import { config, PROPERTIES } from '../config/config.js'

export default async function setup ({ privateKey }) {
  const spinner = ora('Loading unicorns')

  try {
    spinner.start()
    spinner.color = 'blue'
    spinner.text = 'Please wait while your wallet is set up'

    // private key to 0x prefix hex
    if (privateKey.startsWith('0x') === false) {
      privateKey = '0x' + privateKey
    }

    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey)
    const address = EthCrypto.publicKey.toAddress(publicKey)

    config.set(PROPERTIES.USER_PRIVATE_KEY, privateKey)
    config.set(PROPERTIES.USER_PUBLIC_KEY, publicKey)
    config.set(PROPERTIES.USER_ADDRESS, address)

    config.set(PROPERTIES.SETUP, true)
  } catch (error) {
    console.log(chalk.red(error))
  } finally {
    spinner.stop()
  }
}
