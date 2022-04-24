const chalk = require('chalk')

function permit(role, identity) {
    /******* TODO *********/
    // get repo "uuid" from .dcgit
    // generate "key" which is encrypted by "identity" public key
    // generate "address" using "identity" public key
    // convert role sting to enum index for read/write access respectively
    // call grant_access(uuid, address, role, key)
    // Error handling
    
    console.log(chalk.greenBright("Permission added successfully successfully"));
}

module.exports = permit;
