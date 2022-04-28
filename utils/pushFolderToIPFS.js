const crypto = require('crypto')
const IPFS = require('ipfs-core')
const AdmZip = require('adm-zip')

/**
 * Zips and pushes a folder to IPFS, encrpyting it with the given cipher, returns its IPFS address and SHA256 hash
 * @param {string} folderPath - the path to the folder to push
 * @param {crypto.Cipher} cipher - the cipher to use
 * @returns {Promise<{ipfsAddress: string, integrity: string}>}
 */
async function pushFolderToIPFS(folderPath, cipher) {
    const zip = new AdmZip();
    zip.addLocalFolder(folderPath);
    const encryptedZip = cipher.update(zip.toBuffer(), 'binary', 'binary') + cipher.final('binary');
    const hash = crypto.createHash('sha256').update(encryptedZip).digest('hex');

    // save the encrypted zip file to IPFS
    const node = await IPFS.create()
    const { cid }  = await node.add({
        path: 'dcgit.zip',
        content: encryptedZip
    })

    await node.stop()

    return {
        ipfsAddress: cid.toString(),
        integrity: hash
    }
}

module.exports = pushFolderToIPFS
