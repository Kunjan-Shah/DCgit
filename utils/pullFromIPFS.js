const util = require('util');
const AdmZip = require('adm-zip');

/**
 * Retrieves a file from IPFS and decrypts it with decipher
 * @param {string} ipfsAddress - the IPFS address of the file to retrieve
 * @param {crypto.Decipher} decipher - the decipher to use
 * @returns {Promise<Buffer>}
 */
async function pullFromIPFS(ipfsAddress, decipher) {
    //Connceting to the ipfs network via infura gateway
    const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

    ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log(file.path)
          console.log(file.content.toString('utf8'))
        })
    })
    return "TODO"
}

module.exports  = pullFromIPFS
