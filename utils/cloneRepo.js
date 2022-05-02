const path = require('path')
const fs = require('fs')
const os = require('os')
const simpleGit = require('simple-git');
const AdmZip = require('adm-zip');

/**
 * Takes the zipped .git folder and merges the specified branch with the local one
 * @param {Buffer} zip - The zipped .git folder
 */
async function cloneRepo(zip) {
    try {
        console.log(`Cloning repo`)
        // in the local directory, we create a .tmp folder and save the zip file there
        fs.writeFileSync(path.join('.', 'dcgit-pulled.zip'), zip.toString('binary'), 'binary');

        const tempFolder = '.tmp-dcgit'

        // create a folder call .dcgit
        fs.mkdirSync(tempFolder);
        fs.mkdirSync(path.join(tempFolder, '.git'));

        // unzip the zip file
        const zipFile = new AdmZip(path.join('.', 'dcgit-pulled.zip'));
        zipFile.extractAllTo(path.join('.', tempFolder, '.git'), true);

        // Add the temporary folder as a git remote
        const git = simpleGit()
        await git.clone(path.join('.', tempFolder));

        // delete the temporary folder
        fs.rm(path.join(tempFolder), { recursive: true })
    }
    catch (err) {
        throw err
    }
}

module.exports = cloneRepo
