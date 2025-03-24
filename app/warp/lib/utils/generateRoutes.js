import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/default.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateRoutes() {
    const modulesPath = path.resolve(config.MODULES_PATH || path.join(__dirname, '../../../modules'));
    const outputFilePath = config.MODULE_ROUTES_PATH;

    console.log(`📂 Scanning modules in: ${modulesPath}`);

    if (!fs.existsSync(modulesPath)) {
        console.warn('⚠️ Modules directory not found:', modulesPath);
        fs.writeFileSync(outputFilePath, `export default [];`, 'utf-8');
        process.exit(1);
    }

    // Filter modules that contain a 'router/index.js' file
    const modules = fs.readdirSync(modulesPath).filter(folder => {
        const routePath = path.join(modulesPath, folder, 'router', 'index.js');
        return fs.statSync(path.join(modulesPath, folder)).isDirectory() && fs.existsSync(routePath);
    });

    if (modules.length === 0) {
        console.warn('⚠️ No valid module routes found.');
        fs.writeFileSync(outputFilePath, `export default [];`, 'utf-8');
        process.exit(0);
    }

    const imports = modules.map(
        module => `import ${module}Routes from '@/${module}/router/index.js';`
    ).join('\n');

    const exports = `export default [\n${modules.map(module => `  ...${module}Routes`).join(',\n')}\n];`;

    // Write to the specified output file
    fs.writeFileSync(config.MODULE_ROUTES_PATH, `${imports}\n\n${exports}`, 'utf-8');

    console.log(`✅ Routes generated successfully at: ${config.MODULE_ROUTES_PATH}`);
}

// Auto-execute when script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateRoutes();
}
