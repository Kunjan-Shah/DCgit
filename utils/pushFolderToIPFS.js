import crypto from 'crypto'
import AdmZip from 'adm-zip'
import { fileAdd } from './ipfs.js'

/**
 * Zips and pushes a folder to IPFS, encrpyting it with the given cipher, returns its IPFS address and SHA256 hash
 * @param {string} folderPath - the path to the folder to push
 * @param {crypto.Cipher} cipher - the cipher to use
 * @returns {Promise<{ipfsAddress: string, integrity: string}>}
 */
export default async function pushFolderToIPFS (folderPath, cipher) {
  try {
    const zip = new AdmZip()
    zip.addLocalFolder(folderPath)
    const encryptedZip = cipher.update(zip.toBuffer(), 'binary', 'binary') + cipher.final('binary')
    zip.writeZip('.dcgit.zip')
    const hash = crypto.createHash('sha256').update(encryptedZip).digest('hex')

    const { cid } = await fileAdd(Buffer.from(encryptedZip, 'binary'))

    return {
      ipfsAddress: cid.toString(),
      integrity: hash
    }
  } catch (error) {
    console.log(error)
  }
}
