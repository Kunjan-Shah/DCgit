#! /usr/bin/env node
const { program } = require('commander');
const setup = require("./commands/setup");
const init = require("./commands/init");
const permit = require("./commands/permit");
const push = require('./commands/push.js');
const pull = require('./commands/pull.js');

/************************* Instruction to run the code ***********************************/
/*   run npm i -g to install the cli named "dcgit"
     try dcgit --help to get help for any command
     Following commands are supported:
     1. dcgit init
     2. dcgit permit --role <role> --identity <identity>
     3. dcgit push
*/
program
    .command('setup')
    .description('Setup Ethereum Wallet to use for DCGit')
    .requiredOption('-p, --privateKey <private key>', 'Private key of the Ethereum wallet')
    .action(setup)

program
    .command('init')
    .description('Initialize a DCgit repo')
    .action(init)

// TODO: generate cli error when --role is neither "read" nor "write"
program
    .command('permit')
    .description('Grant read/write access to a user (one at a time)')
    .requiredOption('-r, --role <role>', 'Grant a read or write role. Default is read role')
    .requiredOption('-i, --identity <identity>', 'Public key of the user to whom you want to grant access')
    .action(permit)

program
    .command('push')
    .description('Push the repo')
    .action(push)

program
    .command('pull')
    .description('Pull the changes to the repo to the specified branch')
    .requiredOption('-b, --branch <branch>', 'The branch to which you want to pull the changes')
    .action(pull)


program.parse();
