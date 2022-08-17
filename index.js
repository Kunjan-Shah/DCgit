#! /usr/bin/env node

import { program } from 'commander'
import setup from './commands/setup.js'
import init from './commands/init.js'
import clone from './commands/clone.js'
import permit from './commands/permit.js'
import push from './commands/push.js'
import pull from './commands/pull.js'

program
  .description('A command line tool for managing decentralized git repositories')
  .usage('[command] [options]')

program
  .command('setup')
  .description('Setup Ethereum Wallet to use for DCGit')
  .argument('<private key>', 'Private key of the Ethereum wallet')
  .action(setup)

program
  .command('init')
  .description('Initialize a DCgit repo')
  .argument('<uuid>', 'Unique identifier for the repo')
  .action(init)

program
  .command('clone')
  .description('Clone a DCgit repo')
  .argument('<uuid>', 'Unique identifier for the repo to clone')
  .action(clone)

// TODO: generate cli error when --role is neither "read" nor "write"
program
  .command('permit')
  .description('Grant read/write access to a user (one at a time)')
  .argument('<role>', 'Grant a read or write role. Default is read role')
  .argument('<identity>', 'Public key of the user to whom you want to grant access')
  .action(permit)

program
  .command('push')
  .description('Push the repo')
  .action(push)

program
  .command('pull')
  .description('Pull the changes to the repo to the specified branch')
  .argument('<branch>', 'The branch to which you want to pull the changes')
  .action(pull)

program.parse()
