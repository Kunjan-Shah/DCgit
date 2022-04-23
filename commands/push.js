import chalk from "chalk"

export default function init() {
    /******* TODO *********/
    // check before pushing if the state is ready to be pushed or not. If not, throw error
    // get repo "uuid" from .dcgit
    // encrypt repo with changes and push to IPFS and get new "storage_address"
    // generate new "integrity"
    // call push_to_repo(uuid, storage_address, integrity)
    // Error handling
    console.log(chalk.greenBright("Pushed successfully"));
}