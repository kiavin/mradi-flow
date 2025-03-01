import { Command } from 'commander';
import chalk from 'chalk';
// import createcomponent from '../lib/generators/componentGenerator.js';

const componentCommand = new Command('component');

componentCommand
    .description('component generation commands')
    .action(() => {
        console.log(`
  ${chalk.green.bold('voyage component')}
  ${chalk.gray('--------------------------------')}
  Usage:
    ${chalk.green('voyage component:create --name=componentName --path=./src/components')}
    ${chalk.green('voyage component:delete --name=componentName --path=./src/components')}
    ${chalk.green('voyage component:info --name=componentName --path=./src/components')}

  
  Options:
    ${chalk.yellow('--name')}    Name of the component component
    ${chalk.yellow('--path')}    Directory to save the component file
  `);
    });

componentCommand
    .command('create')
    .description('Create a new component component')
    .option('--name <name>', 'Name of the component component')
    .option('--path <path>', 'Directory to save the component')
    .action((options) => {
        if (!options.name || !options.path) {
            console.log(chalk.red('Error: Name and Path are required.'));
            process.exit(1);
        }
        createcomponent(options.name, options.path);
    });

export default componentCommand;
