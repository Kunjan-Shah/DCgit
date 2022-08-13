import path from 'path'
import AdmZip from 'adm-zip'

/**
 * Extracts the .git folder from the zipped .git folder into the temporary folder
 * @param {string} folder The temporary folder to extract the .git folder into
 * @param {Buffer} zip The zipped .git folder
 */
export default function createTemporaryGitRepo (folder, zip) {
  const zipFile = new AdmZip(zip)
  zipFile.extractAllTo(path.join(folder, '.git'), true)
}
