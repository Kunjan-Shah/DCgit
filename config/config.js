import Conf from 'conf'

export const config = new Conf({
  projectName: 'dcgit',
  configName: '.dcgit',
  cwd: process.cwd()
})

export const PROPERTIES = {
  SETUP: 'setup',
  USER_PRIVATE_KEY: 'userPrivateKey',
  USER_PUBLIC_KEY: 'userPublicKey',
  USER_ADDRESS: 'userAddress',
  REPO_UUID: 'uuid',
  ENCRYPTION_KEY: 'key',
  ENCRYPTION_IV: 'iv',
  IPFS_ADDRESS: 'ipfsAddress',
  INTEGRITY: 'integrity'
}
