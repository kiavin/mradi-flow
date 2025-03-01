import fs from 'fs';

function createouteFile(routePath, module, route, componentName) {
    let newRouteEntry = `{
    path: '/${module}/${route}',
    name: '${componentName}',
    component: () => import('@/views/${module}/${route}.vue')
  },\n`;

    if (!fs.existsSync(routePath)) {
        console.log(`📁 Creating new route file: ${routePath}`);
        fs.writeFileSync(routePath, `export default [\n${newRouteEntry}];\n`, 'utf8');
    } else {
        let existingRoutes = fs.readFileSync(routePath, 'utf8');
        existingRoutes = existingRoutes.replace(/\];\s*$/, `${newRouteEntry}];`); // Add before closing ]
        fs.writeFileSync(routePath, existingRoutes, 'utf8');
    }

    console.log(`✅ Route file updated: ${routePath}`);
}


// const modules = ['auth', 'scheduler'];
// const moduleRoutes = modules.map(m => require(`./${m}`).default);
// const routes = [...moduleRoutes.flat()];
