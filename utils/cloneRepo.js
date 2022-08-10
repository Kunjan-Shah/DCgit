import path from 'path'
import fs from 'fs'
import simpleGit from 'simple-git'
import AdmZip from 'adm-zip'

/**
 * Takes the zipped .git folder and merges the specified branch with the local one
 * @param {Buffer} zip - The zipped .git folder
 */
export default async function cloneRepo (zip) {
  console.log('Cloning repo')
  // in the local directory, we create a .tmp folder and save the zip file there
  fs.writeFileSync(path.join('.', 'dcgit-pulled.zip'), zip.toString('binary'), 'binary')

  const tempFolder = '/tmp/dcgit'
  if (fs.existsSync(tempFolder)) {
    await fs.promises.rm(path.join(tempFolder), { recursive: true }, (err) => {
      if (err) throw err
    })
  }

  // create a folder call .dcgit
  fs.mkdirSync(tempFolder)
  fs.mkdirSync(path.join(tempFolder, '.git'))
  console.log('unzipping......')

  // unzip the zip file
  const zipFile = new AdmZip(path.join('.', 'dcgit-pulled.zip'))
  zipFile.extractAllTo(path.join('.', tempFolder, '.git'), true)

  // remove the zip file
  fs.unlinkSync(path.join('.', 'dcgit-pulled.zip'))

  console.log('unzip done')

  // Add the temporary folder as a git remote
  const git = simpleGit()
  fs.mkdirSync('newRepo')
  await git.clone(path.join('.', tempFolder), path.join('.', 'newRepo'))

  // delete the temporary folder
  fs.rm(path.join(tempFolder), { recursive: true }, (err) => {
    if (err) throw err
  })

  // bring the contents (including folders) of the newRepo folder to the current folder
  await fs.promises.cp(path.join('.', 'newRepo'), path.join('.'), { recursive: true })
  fs.rmSync('newRepo', { recursive: true, force: true }, (err) => {
    if (err) throw err
  })
}
