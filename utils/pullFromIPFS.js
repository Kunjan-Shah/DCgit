import { fileGet } from './ipfs.js'

/**
 * Retrieves a file from IPFS and decrypts it with decipher
 * @param {string} ipfsAddress - the IPFS address of the file to retrieve
 * @param {crypto.Decipher} decipher - the decipher to use
 * @returns {Promise<Buffer>}
 */
export default async function pullFromIPFS (ipfsAddress, decipher) {
  const content = await fileGet(ipfsAddress)

  const zippedGit = decipher.update(Buffer.from(content), 'binary', 'binary') + decipher.final('binary')

  return zippedGit
}
