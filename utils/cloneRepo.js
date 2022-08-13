import os from 'os'
import path from 'path'
import fs from 'fs'
import simpleGit from 'simple-git'
import createTemporaryGitRepo from './createTemoraryGitRepo.js'

/**
 * Takes the zipped .git folder and merges the specified branch with the local one
 * @param {Buffer} zip - The zipped .git folder
 */
export default async function cloneRepo (zip) {
  const tempFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'dcgit-'))

  createTemporaryGitRepo(tempFolder, zip)

  // move the clone to current directory
  fs.renameSync(path.join(tempFolder, '.git'), path.join('.', '.git'))

  const git = simpleGit()
  await git.reset(['--hard'])

  await fs.promises.rm(tempFolder, { recursive: true })
}
