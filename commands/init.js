import chalk from "chalk"

export default function init() {
    /******* TODO *********/

    // upload current repo to IPFS and get back the "storage_address". Store "storage_address" in .dcgit file
    // find HASH of current repo and save it in "integrity". Store "integrity" in .dcgit file
    // generate repo encyption key and save it in "key". Store "key" in .dcgit file
    // call initialize_repo(storage_address, integrity, key) -> returns repo uuid
    // store uuid in .dcgit file
    // Error handling
    console.log(chalk.greenBright("DCgit repo initialized successfully"));
}

