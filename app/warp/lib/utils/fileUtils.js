import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function createFile(name, savePath, content) {
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
    }

    const filePath = path.join(savePath, `${name}.vue`);
    fs.writeFileSync(filePath, content.trim(), 'utf8');

    console.log(chalk.green(`✅ Form component created at: ${filePath}`));
}
