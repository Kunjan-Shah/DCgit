const util = require('util');
const AdmZip = require('adm-zip');
const ipfsAPI = require('ipfs-api');

/**
 * Retrieves a file from IPFS and decrypts it with decipher
 * @param {string} ipfsAddress - the IPFS address of the file to retrieve
 * @param {crypto.Decipher} decipher - the decipher to use
 * @returns {Promise<Buffer>}
 */
async function pullFromIPFS(ipfsAddress, decipher) {
    //Connceting to the ipfs network via infura gateway
    const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

    const fileGet = util.promisify(ipfs.files.get)

    const file = await fileGet(ipfsAddress)

    const zippedGit = decipher.update(file[0].content, 'binary', 'binary') + decipher.final('binary');

    return zippedGit
}

module.exports  = pullFromIPFS
