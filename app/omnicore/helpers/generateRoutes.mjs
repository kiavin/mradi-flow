import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesPath = path.resolve(__dirname, '../../../modules'); // Adjust this if needed
const outputFilePath = path.resolve(__dirname, '../generatedRoutes.js');

if (!fs.existsSync(modulesPath)) {
    console.warn('⚠️  Modules directory not found:', modulesPath);
    process.exit(1);
}

const modules = fs.readdirSync(modulesPath).filter(folder => {
    return fs.statSync(path.join(modulesPath, folder)).isDirectory();
});

let routes = [];

modules.forEach(module => {
    const routeFile = path.join(modulesPath, module, 'routes', 'index.js');

    if (fs.existsSync(routeFile)) {
        const importStatement = `import ${module}Routes from '@/${module}/routes/index.js';`; // Use alias
        const routeArray = `${module}Routes`;

        if (!routes.find(r => r.routeArray === routeArray)) {
            routes.push({ importStatement, routeArray });
        }
    }
});

// Generate the final file
const imports = routes.map(r => r.importStatement).join('\n');
const exports = `export default [\n  ${routes.map(r => `...${r.routeArray}`).join(',\n  ')}\n];`;

fs.writeFileSync(outputFilePath, `${imports}\n\n${exports}`, 'utf-8');
console.log('✅ Routes generated successfully at:', outputFilePath);
