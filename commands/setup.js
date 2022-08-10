import fs from 'fs'
import chalk from 'chalk'
import EthCrypto from 'eth-crypto'
import ora from 'ora-classic'

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

    // create dcgit.json file
    const dcgit = {
      userPrivateKey: privateKey,
      userPublicKey: publicKey,
      userAddress: EthCrypto.publicKey.toAddress(publicKey)
    }

    await fs.promises.writeFile('.dcgit.json', JSON.stringify(dcgit))
  } catch (error) {
    console.log(chalk.red(error))
  } finally {
    spinner.stop()
  }
}
