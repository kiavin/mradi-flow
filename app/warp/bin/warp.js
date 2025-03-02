#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import registerCommands from '../commands/index.js';
import fs from 'fs';
import dotenv from 'dotenv';


if (!fs.existsSync('.env')) {
  console.error(chalk.red('❌ Error: Missing .env file!'));
  console.error(chalk.red('Please create a .env file with the required configuration.'));
  process.exit(1); 
}

dotenv.config();


const program = new Command();

program
  .name('warp')
  .description(chalk.cyan('Warp CLI Code Generator for Vue 3'))
  .version('1.0.0');

program
  .command('help')
  .description('Display general help')
  .action(() => {
    console.log(`
${chalk.cyan.bold('Warp Code Generator 1.0.0')}
${chalk.gray('--------------------------------')}
Usage:
  ${chalk.green('warp <command> [options]')}

For specific command help, run:
  ${chalk.yellow('warp <command> --help')}

Available Commands:
  ${chalk.green('form')}      Generate a new form component
  ${chalk.green('page')}      Generate a new page
  ${chalk.green('component')} Generate a standalone component
        `);

      //   if (config.FEATURE_FLAGS.DEBUG_MODE) {
      //     console.log(chalk.yellow('⚠️ Debug mode is enabled.'));
      // }
  });

if (process.argv.length > 2) {
  process.argv = process.argv.flatMap(arg =>
    arg.match(/^(form|module)[:/](create)$/) ? [arg.split(/[:/]/)[0], 'create'] : arg
  );
}

// Register all subcommands 
registerCommands(program);

program.parse(process.argv);
