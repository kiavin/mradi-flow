import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesPath = path.resolve(__dirname, '../../../modules'); // Ensure this path is correct
const outputFilePath = path.join(__dirname, '../generatedRoutes.json');

if (!fs.existsSync(modulesPath)) {
    console.warn('⚠️  Modules directory not found:', modulesPath);
    fs.writeFileSync(outputFilePath, "export default [];\n", "utf-8");
    process.exit(1);
}

// Scan for modules containing a 'router/index.js' file
const modules = fs.readdirSync(modulesPath).filter(folder => {
    const routeFile = path.join(modulesPath, folder, 'router', 'index.js'); // Correct variable usage
    return fs.statSync(path.join(modulesPath, folder)).isDirectory() && fs.existsSync(routeFile);
});

if (modules.length === 0) {
    console.warn('⚠️ No valid module routes found.');
    fs.writeFileSync(outputFilePath, "export default [];\n", "utf-8");
    process.exit(0);
}

const imports = modules.map(
    module => `import ${module}Routes from '@/${module}/router/index.js';`
).join('\n');

const exports = `export default [\n  ${modules.map(module => `...${module}Routes`).join(',\n  ')}\n];`;

// Write to file
fs.writeFileSync(outputFilePath, `${imports}\n\n${exports}`, 'utf-8');

console.log("✅ Routes generated successfully at:", outputFilePath);

