#! /usr/bin/env node
import { program } from "commander";
import init from './commands/init.js';
import permit from './commands/permit.js';
import push from './commands/push.js';

/************************* Instruction to run the code ***********************************/
/*   run npm i -g to install the cli named "dcgit"
     try dcgit --help to get help for any command
     Following commands are supported:
     1. dcgit init
     2. dcgit permit --role <role> --identity <identity>
     3. dcgit push
*/

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


program.parse();
