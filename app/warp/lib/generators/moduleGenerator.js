import { fetchSwaggerJson } from '../utils/apiUtils.js';
import path from 'path';
import chalk from 'chalk';
import { console } from 'inspector';
import { generateModuleRoutes, createFolders, generateStore, generateService } from '../utils/cliUtils.js';

export async function generateModule(moduleName, selectedFolders) {

    console.log(chalk.yellow(`🚀 Fetching schema for module: ${moduleName}...`));

    const moduleData = await fetchSwaggerJson(moduleName, '', true);

    if (moduleData.error) {
        console.error(chalk.red(`❌ Failed to fetch module: ${moduleData.error}`));
        return;
    }

    if (!moduleData || moduleData.length === 0 || moduleData.error) {
        console.log(chalk.red(`❌ No schema found for module: ${moduleName}`));
        throw new Error(`❌ No schema found for module: ${moduleName}`)
    }

    const modulePath = path.resolve(`modules/${moduleName}`);

    console.log(chalk.green(`🚀 Generating module: ${moduleName}...`));

    // Create folders and default files
    // createFolders(modulePath);

    // generateModuleRoutes(moduleData, modulePath);

    // Generate Pinia Store
    // generateStore(moduleName, moduleData, modulePath);

    // Generate API Service
    // generateService(moduleName, modulePath);


    // Create only selected folders
    createFolders(modulePath, selectedFolders);

    // Generate Routes (if "router" is selected)
    if (selectedFolders.includes('router')) {
        generateModuleRoutes(moduleData, modulePath);
        console.log(chalk.yellow(`📌 Routes generated`));
    }

    // Generate Pinia Store (if "stores" is selected)
    if (selectedFolders.includes('stores')) {
        generateStore(moduleName, moduleData, modulePath);
        console.log(chalk.yellow(`📦 Pinia store generated`));
    }

    // Generate API Service (if "services" is selected)
    if (selectedFolders.includes('services')) {
        generateService(moduleName, modulePath);
        console.log(chalk.yellow(`🔗 API Service generated`));
    }


    console.log(chalk.green(`✅ Module "${moduleName}" generated successfully!`));
    return true;
}

