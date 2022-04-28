const path = require('path')
const fs = require('fs')
const os = require('os')
const simpleGit = require('simple-git');

/**
 * Takes the zipped .git folder and merges the specified branch with the local one
 * @param {string} branch - The branch to merge with
 * @param {Buffer} zip - The zipped .git folder
 */
async function syncRepo(branch, zip) {
    try {
        // Create a temporary folder, write the zip buffer to it and unzip it
        const tmpFolder = path.join(os.tmpdir(), 'dcgit')
        fs.mkdirSync(tmpFolder)
        fs.writeFileSync(path.join(tmpFolder, 'dcgit.zip'), zip)
        const zipFile = new AdmZip(path.join(tmpFolder, 'dcgit.zip'))
        zipFile.extractAllTo(tmpFolder, true)

        // Add the temporary folder as a git remote
        const git = simpleGit()
        await git.addRemote('dcgit', tmpFolder)

        // Merge the specified branch with the local one
        await git.checkout(branch)
        await git.pull('dcgit', branch)

        // delete the remote
        await git.removeRemote('dcgit')

        // delete the temporary folder
        fs.rmdirSync(tmpFolder, { recursive: true })
    }
    catch (err) {
        throw err
    }
}

module.exports = syncRepo
