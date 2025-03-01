import { Command } from 'commander';
import chalk from 'chalk';
// import createPage from '../lib/generators/pageGenerator.js';

const pageCommand = new Command('page');

pageCommand
    .description('Page generation commands')
    .action(() => {
        console.log(`
  ${chalk.green.bold('voyage page')}
  ${chalk.gray('--------------------------------')}
  Usage:
    ${chalk.green('voyage page:create --name=PageName --path=./src/pages')}
  
  Options:
    ${chalk.yellow('--name')}    Name of the page component
    ${chalk.yellow('--path')}    Directory to save the page file
  `);
    });

pageCommand
    .command('create')
    .description('Create a new page component')
    .option('--name <name>', 'Name of the page component')
    .option('--path <path>', 'Directory to save the page')
    .action((options) => {
        if (!options.name || !options.path) {
            console.log(chalk.red('Error: Name and Path are required.'));
            process.exit(1);
        }
        createPage(options.name, options.path);
    });

export default pageCommand;
