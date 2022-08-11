import os from 'os'
import path from 'path'
import fs from 'fs'
import simpleGit from 'simple-git'
import AdmZip from 'adm-zip'

/**
 * Takes the zipped .git folder and merges the specified branch with the local one
 * @param {Buffer} zip - The zipped .git folder
 */
export default async function cloneRepo (zip) {
  const tempFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'dcgit-'))

  const zipFilePath = path.join(tempFolder, 'dcgit-pulled.zip')

  fs.writeFileSync(zipFilePath, zip.toString('binary'), 'binary')

  fs.mkdirSync(path.join(tempFolder, '.git'))

  // unzip the zip file
  const zipFile = new AdmZip(zipFilePath)
  zipFile.extractAllTo(path.join(tempFolder, '.git'), true)

  // remove the zip file
  fs.unlinkSync(zipFilePath)

  // move the clone to current directory
  fs.renameSync(path.join(tempFolder, '.git'), path.join('.', '.git'))

  const git = simpleGit()
  await git.reset(['--hard'])

  await fs.promises.rm(tempFolder, { recursive: true })
}
