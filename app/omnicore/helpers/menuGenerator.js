import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODULES_DIR = path.join(__dirname, '../../../modules');
const OUTPUT_FILE_PATH = path.join(__dirname, 'menu.json');

function toTitleCase(str) {
    return str.replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\b\w/g, char => char.toUpperCase());
}

export async function generateMenu() {
    console.log('🔍 Scanning modules directory:', MODULES_DIR);

    if (!fs.existsSync(MODULES_DIR)) {
        console.error('❌ Modules directory does not exist.');
        return;
    }

    const moduleDirs = fs.readdirSync(MODULES_DIR).filter(dir =>
        fs.statSync(path.join(MODULES_DIR, dir)).isDirectory()
    );

    const menuData = {};

    for (const module of moduleDirs) {
        const routerDir = path.join(MODULES_DIR, module, 'router');

        if (!fs.existsSync(routerDir) || !fs.statSync(routerDir).isDirectory()) {
            continue; // Skip modules without a router directory
        }

        const categoryRoutes = {};
        const routeFiles = fs.readdirSync(routerDir).filter(file => file.endsWith('.js'));

        for (const file of routeFiles) {
            const categoryName = path.basename(file, '.js');
            if (categoryName === 'index' || categoryName === 'default') {
                continue; // Ignore 'index.js' and 'default.js' files
            }

            // Dynamically import the route file
            const routeFilePath = path.join(routerDir, file);
            const routeModule = await import(routeFilePath);

            // Extract routes from the default export
            const routes = routeModule.default;

            // Filter out routes with dynamic segments (e.g., '/:id')
            const filteredRoutes = routes.filter(route => !route.path.includes('/:id'));

            // Map filtered routes to menu items
            const menuItems = filteredRoutes.map(route => {
                let title = route.meta?.title || '';
                if (title.startsWith('Omniface - ')) {
                    title = title.replace('Omniface - ', ''); // Remove the "Omniface - " prefix
                }
                if (!title) {
                    title = route.path.includes('/create') ? `Create ${toTitleCase(categoryName)}` : toTitleCase(categoryName);
                }
                return {
                    name: route.name,
                    title: title,
                };
            });

            if (menuItems.length > 0) {
                categoryRoutes[categoryName] = menuItems;
            }
        }

        if (Object.keys(categoryRoutes).length > 0) {
            menuData[module] = categoryRoutes;
        }
    }

    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(menuData, null, 4));
    console.log('✅ Menu file generated successfully:', OUTPUT_FILE_PATH);
}

if (import.meta.url === `file://${__filename}`) {
    generateMenu();
}