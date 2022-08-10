import EthCrypto from 'eth-crypto'

/**
 *
 * @param {String} publicKey
 * @param {String} data
 * @returns {String} encrypted data
 */
export default async function publicKeyEncryption (publicKey, data) {
  const encrypted = await EthCrypto.encryptWithPublicKey(
    publicKey,
    data
  )

  return EthCrypto.cipher.stringify(encrypted)
}
