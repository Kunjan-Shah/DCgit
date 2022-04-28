const crypto = require('crypto')
const AdmZip = require('adm-zip');
const ipfsAPI = require('ipfs-api');
const util = require('util');

/**
 * Zips and pushes a folder to IPFS, encrpyting it with the given cipher, returns its IPFS address and SHA256 hash
 * @param {string} folderPath - the path to the folder to push
 * @param {crypto.Cipher} cipher - the cipher to use
 * @returns {Promise<{ipfsAddress: string, integrity: string}>}
 */
async function pushFolderToIPFS(folderPath, cipher) {
    try {
        const zip = new AdmZip();
        zip.addLocalFolder(folderPath);
        const encryptedZip = cipher.update(zip.toBuffer(), 'binary', 'binary') + cipher.final('binary');
        const hash = crypto.createHash('sha256').update(encryptedZip).digest('hex');

        let ipfsAddress;

        //Connceting to the ipfs network via infura gateway
        const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

        const fileAdd = util.promisify(ipfs.files.add)

        const file = await fileAdd(Buffer.from(encryptedZip, 'binary'))

        return {
            ipfsAddress: file[0].hash,
            integrity: hash
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = pushFolderToIPFS
