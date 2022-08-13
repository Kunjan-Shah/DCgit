import fs from 'fs'
import os from 'os'
import path from 'path'
import simpleGit from 'simple-git'
import createTemporaryGitRepo from './createTemoraryGitRepo.js'

/**
 * Takes the zipped .git folder and merges the specified branch with the local one
 * @param {string} branch - The branch to merge with
 * @param {Buffer} zip - The zipped .git folder
 */
export default async function syncRepo (branch, zip) {
  console.log(`Syncing repo with branch ${branch}`)
  // in the local directory, we create a .tmp folder and save the zip file there
  const tempFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'dcgit-'))

  createTemporaryGitRepo(tempFolder, zip)

  // Add the temporary folder as a git remote
  const git = simpleGit()

  const remoteName = 'dcgit'

  const remotes = await git.remote(['-v'])

  if (remotes.includes(remoteName)) {
    await git.removeRemote(remoteName)
  }

  await git.addRemote(remoteName, tempFolder)

  // Merge the specified branch with the local one
  await git.fetch(remoteName, branch)
  await git.pull(remoteName, branch)

  await git.checkout(branch)

  // delete the remote
  await git.removeRemote(remoteName)

  // delete the temporary folder
  await fs.promises.rm(tempFolder, { recursive: true })
}
