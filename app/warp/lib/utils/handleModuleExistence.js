import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Handle existing module check and optional overwrite.
 * @param {string} name - The name of the module.
 * @returns {Promise<boolean>} - Returns true if the module can be created, false otherwise.
 */
export async function handleExistingModule(name) {
    const modulePath = path.resolve(`modules/${name}`);

    if (fs.existsSync(modulePath)) {
        try {
            console.log(chalk.red(`⚠️ Module "${name}" already exists!`));

            const { overwrite } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `Would you like to overwrite the existing module?`,
                    default: false
                }
            ]);

            if (!overwrite) {
                console.log(chalk.red('❌ Module generation cancelled.'));
                return false;
            }

            const { confirmName } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'confirmName',
                    message: `Type the module name to confirm overwriting:`,
                    validate: (input) => input === name ? true : 'Module names do not match. Try again.'
                }
            ]);

            if (confirmName !== name) {
                console.log(chalk.red('❌ Module names do not match. Aborting overwrite.'));
                return false;
            }

            console.log(chalk.yellow(`🗑️  Removing existing module: ${name}...`));
            fs.rmSync(modulePath, { recursive: true, force: true });

        } catch (error) {
            if (error.isTtyError) {
                console.error(chalk.red('❌ Error: The terminal does not support prompts.'));
            } else {
                console.log(chalk.yellow('\n👋 Exiting Warp CLI. Goodbye!'));
                process.exit(0);
            }
        }
    }
    return true;
}
