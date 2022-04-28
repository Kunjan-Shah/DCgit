const IPFS = require('ipfs-core')

/**
 * Retrieves a file from IPFS and decrypts it with decipher
 * @param {string} ipfsAddress - the IPFS address of the file to retrieve
 * @param {crypto.Decipher} decipher - the decipher to use
 * @returns {Promise<Buffer>}
 */
async function pullFromIPFS(ipfsAddress, decipher) {
    const node = await IPFS.create()
    const { content } = await node.cat(ipfsAddress)
    const decryptedContent = decipher.update(content, 'binary', 'binary') + decipher.final('binary');
    await node.stop()
    return Buffer.from(decryptedContent)
}

module.exports = pullFromIPFS
