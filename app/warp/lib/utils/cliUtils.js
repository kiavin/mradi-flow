import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import pageTemplate from '../templates/pageTemplate.js';

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowercase(str) {
  return str.toLowerCase();
}

/**
* Creates the folders for a new module.
*/
export function createFolders(modulePath, selectedFolders, moduleName) {
  selectedFolders.forEach(folder => {
    const fullPath = path.join(modulePath, folder);
    fs.mkdirSync(fullPath, { recursive: true });

    // Check if folder is empty before adding `default.js`
    const files = fs.readdirSync(fullPath);
    if (files.length === 0) {
      const defaultFile = path.join(fullPath, 'default.js');
      fs.writeFileSync(defaultFile, '// default data');
      console.log(chalk.gray(`📄 Added default.js to ${fullPath}`));
    }

    console.log(chalk.yellow(`📂 Created: ${fullPath}`));
  });

  // Create the `module.config.js` file **once per module**
  // const configFile = path.join(modulePath, `${capitalize(moduleName)}.config.js`);

  // if (!fs.existsSync(configFile)) {
  //   const configContent = `export default {
  //     // Default Configuration for ${moduleName} module
  //     IS_SECURE: false, // If false, authentication is required for this module
  //     SAFE_ROUTES: [] // Routes accessible without authentication
  // };`;

  //   fs.writeFileSync(configFile, configContent);
  //   console.log(chalk.green(`⚙️ Created module.config.js`));
  // }
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
export const generateModuleRoutes = (schema, modulePath, moduleName, apiEndpoints) => {
  if (!schema || !schema.components || !schema.components.schemas) {
    console.error(chalk.red('❌ Invalid schema: Missing components or schemas.'));
    return;
  }

  const routeImports = [];
  const routesIndexPath = path.join(modulePath, 'router', 'index.js');

  // Ensure router directory exists
  fs.mkdirSync(path.join(modulePath, 'router'), { recursive: true });

  Object.keys(schema.components.schemas).forEach(route => {
    const schemaProperties = schema.components.schemas[route]?.properties || {};
    // const endpoints = apiEndpoints[route] || {}
    // Generate tableColumns dynamically
    const tableColumns = Object.keys(schemaProperties).map(key => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) // Convert snake_case to "Title Case"
    }));

    const routePath = path.join(modulePath, 'views', route);
    const routerPath = path.join(modulePath, 'router', `${route}.js`);
    fs.mkdirSync(routePath, { recursive: true });

    // Create Vue files using the page template
    ['index', 'create', 'update', 'view'].forEach(file => {
    //   if (!endpoints[file]) {
    //     console.log(chalk.gray(`🚫 Skipping ${file}.vue for ${route}, no API endpoint.`));
    //     return;
    // }
      const filePath = path.join(routePath, `${file}.vue`);
      // const routeName = lowercase(route);
      const pageContent = pageTemplate(route, file, tableColumns, moduleName, apiEndpoints); // Generate based on type

      fs.writeFileSync(filePath, pageContent);
      console.log(chalk.blue(`📄 Created: ${filePath}`));
    });

    // Create form.vue without the page template
    const formPath = path.join(routePath, 'form.vue');
    if (!fs.existsSync(formPath)) {
      const formContent = `<script setup>\n</script>\n<template>\n  <div class="container">\n    <form>\n      <!-- Form content here -->\n    </form>\n  </div>\n</template>\n\n<style scoped></style>\n`;
      fs.writeFileSync(formPath, formContent);
      console.log(chalk.blue(`📄 Created: ${formPath}`));
    }


    // Generate router file for each route
    const routerContent = `
const layout = 'hopeui'
export default [
  {
    path: '/${moduleName}/${route.toLowerCase()}/create',
    name: '${moduleName}/${route.toLowerCase()}/create',
    component: () => import('../views/${route}/create.vue'),
    meta: { title: 'Omniface - Create', layout: layout }
  },
  {
    path: '/${moduleName}/${route.toLowerCase()}/view/:id',
    name: '${moduleName}/${route.toLowerCase()}/view',
    component: () => import('../views/${route}/view.vue'),
    props: true,
    meta: { title: 'Omniface - View', layout: layout }
  },
  {
    path: '/${moduleName}/${route.toLowerCase()}/update/:id',
    name: '${moduleName}/${route.toLowerCase()}/update',
    component: () => import('../views/${route}/update.vue'),
    props: true,
    meta: { title: 'Omniface - Update', layout: layout }
  },
  {
    path: '/${moduleName}/${route.toLowerCase()}',
    name: '${moduleName}/${route.toLowerCase()}',
    component: () => import('../views/${route}/index.vue'),
    meta: { title: 'Omniface - Index', layout: layout }
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


export const getApiEndpoints = (openApiSpec) => {
  const paths = openApiSpec.paths || {};
  const schemas = new Set(Object.keys(openApiSpec.components?.schemas || {}));

  let endPoints = {};

  Object.keys(paths).forEach(path => {
    Object.keys(paths[path]).forEach(method => {
      const operation = paths[path][method];

      if (!operation.tags || operation.tags.length === 0) return;

      const resourceName = operation.tags[0]; // Assuming the first tag is the main resource

      if (schemas.has(resourceName)) {
        if (!endPoints[resourceName]) {
          endPoints[resourceName] = {};
        }

        // Determine CRUD operation
        let action = "";
        if (method === "post") {
          action = "create";
        } else if (method === "get") {
          action = path.includes("{id}") ? "view" : "list";
        } else if (method === "put") {
          action = "update";
        } else if (method === "delete") {
          action = "delete";
        }

        endPoints[resourceName][action] = path;
      }
    });
  });

  return endPoints;
}



