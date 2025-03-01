import { Command } from 'commander';
import chalk from 'chalk';
import { generateForm } from '../lib/generators/formGenerator.js';

const formCommand = new Command('form')
  .description('Form generation commands')
  .action(() => {
    console.log(`
  ${chalk.green.bold('warp form')}
  ${chalk.gray('--------------------------------')}
  Usage:
    ${chalk.green('warp form:create --name=FormName --module=scheduler --route=appointments')}
  
  Options:
    ${chalk.yellow('--name')}    Name of the form component (required)
    ${chalk.yellow('--path')}    Directory to save the form file (optional, default: src/views/<module>/<route>/)
    ${chalk.yellow('--module <module>')} Module where the form belongs (default: default)
    ${chalk.yellow('--route <route>')}   Route associated with the form (default: default)
    ${chalk.yellow('-h, --help ')}       Display help for form commands

  Example Usage:
    ${chalk.green('warp form:create --name=UserForm --module=scheduler --route=appointments')}
    ${chalk.green('warp form:create --name=UserForm --module=scheduler --route=appointments --path=./components')}
  `);
  });

const formCreateCommand = new Command('create')
  .alias('form:create')
  .alias('form/create')
  .description('Create a new form component')
  .requiredOption('--name <name>', 'Name of the form component')
  .option('--path <path>', 'Directory to save the form')
  .requiredOption('--module <module>', 'Module where the form belongs')
  .requiredOption('--route <route>', 'Route associated with the form')
  .action(async (options) => {
    let { name, path: userPath, module, route } = options;

    // Default path if not provided
    const defaultPath = `src/views/modules/${module}/${route}/`;
    const savePath = userPath ? userPath : defaultPath;

    console.log(chalk.green('🚀 Generating form with the following options:'));
    console.log(chalk.yellow(`- Name: ${name}`));
    console.log(chalk.yellow(`- Path: ${savePath}`));
    console.log(chalk.yellow(`- Module: ${module}`));
    console.log(chalk.yellow(`- Route: ${route}`));


    try {
      const success = await generateForm(name, module, route, savePath);
      if (success) {
        console.log(chalk.green(`✅ Form successfully generated at: ${savePath}`));
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error generating form: ${error.message}`));
    }

  });

formCommand.addCommand(formCreateCommand);
export default formCommand;
