import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Creates the module folders and adds a default.txt file in each.
 */
// export function createFolders(modulePath) {
//     const folders = [
//         'components/atoms',
//         'components/molecules',
//         'components/organisms',
//         'plugins',
//         'utils',
//         'stores',
//         'services',
//         'middleware',
//         'views',
//         'router'
//     ];

//     folders.forEach(folder => {
//         const fullPath = path.join(modulePath, folder);
//         fs.mkdirSync(fullPath, { recursive: true });

//         // Add a default.txt file with a comment
//         const defaultFile = path.join(fullPath, 'default.txt');
//         fs.writeFileSync(defaultFile, '// default data');

//         console.log(chalk.yellow(`📂 Created: ${fullPath}`));
//         console.log(chalk.gray(`📄 Added default.txt to ${fullPath}`));
//     });
// }

export function createFolders(modulePath, selectedFolders, moduleName) {
    selectedFolders.forEach(folder => {
        const fullPath = path.join(modulePath, folder);
        fs.mkdirSync(fullPath, { recursive: true });

        // Add a default.txt file with a comment
        const defaultFile = path.join(fullPath, 'default.txt');
        fs.writeFileSync(defaultFile, '// default data');

        console.log(chalk.yellow(`📂 Created: ${fullPath}`));
        console.log(chalk.gray(`📄 Added default.txt to ${fullPath}`));
    });

    // Create the `module.config.js` file **once per module**
    const configFile = path.join(modulePath, `${capitalize(moduleName)}.config.js`);

    if (!fs.existsSync(configFile)) {
        // Default config file
        const configContent = `export default {
        // Default Configuration for ${moduleName} module
        IS_SECURE: false, // If false, authentication is required for this module
        SAFE_ROUTES: [] // Routes accessible without authentication
    };`;

        fs.writeFileSync(configFile, configContent);
        console.log(chalk.green(`⚙️ Created module.config.js`));
    }
}

/**
 * Generates a Pinia Store for the module.
 */
export function generateStore(moduleName, moduleData, modulePath) {
    const storePath = path.join(modulePath, 'stores', `${moduleName}Store.js`);
    const storeContent = `
import { defineStore } from 'pinia';

export const use${capitalize(moduleName)}Store = defineStore('${moduleName}', {
  state: () => ({
    ${Object.keys(moduleData.components.schemas).map(route => `${route}: []`).join(',\n    ')}
  }),
  actions: {
    async fetch${capitalize(moduleName)}() {
      try {
        const  data  = await fetch('/api/${moduleName}');
        this.${moduleName} = data.value;
      } catch (error) {
        console.error(error);
      }
    }
  }
});
`;

    fs.writeFileSync(storePath, storeContent.trim());
    console.log(chalk.blue(`📄 Created: ${storePath}`));
}


/**
 * Generates API service functions for the module.
 */
export function generateService(moduleName, modulePath) {
    const servicePath = path.join(modulePath, 'services', `${moduleName}Service.js`);
    const serviceContent = `
export default {
  async fetchAll() {
    return await fetch('/api/${moduleName}');
  },
  async create(data) {
    return await fetch('/api/${moduleName}', { method: 'POST', body: data });
  },
  async update(id, data) {
    return await fetch(\`/api/${moduleName}/\${id}\`, { method: 'PUT', body: data });
  },
  async delete(id) {
    return await fetch(\`/api/${moduleName}/\${id}\`, { method: 'DELETE' });
  }
};
`;

    fs.writeFileSync(servicePath, serviceContent.trim());
    console.log(chalk.blue(`📄 Created: ${servicePath}`));
}



/**
 * Generates Vue route files from Swagger schema.
 *
 * @param {Object} schema - The Swagger module schema.
 * @param {string} modulePath - Path to the module directory.
 */
export const generateModuleRoutes = (schema, modulePath) => {
    if (!schema || !schema.components || !schema.components.schemas) {
        console.error(chalk.red('❌ Invalid schema: Missing components or schemas.'));
        return;
    }

    const routeImports = [];
    const routesIndexPath = path.join(modulePath, 'router', 'index.js');

    // Ensure router directory exists
    fs.mkdirSync(path.join(modulePath, 'router'), { recursive: true });

    Object.keys(schema.components.schemas).forEach(route => {
        const routePath = path.join(modulePath, 'views', route);
        const routerPath = path.join(modulePath, 'router', `${route}.js`);
        fs.mkdirSync(routePath, { recursive: true });

        // Create Vue files (index.vue, create.vue, update.vue)
        ['index.vue', 'create.vue', 'update.vue'].forEach(file => {
            const filePath = path.join(routePath, file);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, `<template>\n  <div>${route} ${file.replace('.vue', '')} page</div>\n</template>\n`);
                console.log(chalk.blue(`📄 Created: ${filePath}`));
            }
        });

        // Generate router file for each route
        const routerContent = `
export default [
  {
    path: '/${route}/create',
    name: '${route}-create',
    component: () => import('../views/${route}/create.vue'),
  },
  {
    path: '/${route}/update',
    name: '${route}-update',
    component: () => import('../views/${route}/update.vue'),
  },
  {
    path: '/${route}',
    name: '${route}',
    component: () => import('../views/${route}/index.vue'),
  }
];
`;
        fs.writeFileSync(routerPath, routerContent.trim());
        console.log(chalk.blue(`📄 Created: ${routerPath}`));

        // Store route import for index.js
        routeImports.push(`import ${route}Routes from './${route}.js';`);
    });

    // Create index.js to export all routes
    const indexContent = `
${routeImports.join('\n')}

export default [
  ${Object.keys(schema.components.schemas).map(route => `...${route}Routes`).join(',\n  ')}
];
`;
    fs.writeFileSync(routesIndexPath, indexContent.trim());
    console.log(chalk.green(`✅ Generated router index: ${routesIndexPath}`));
};
