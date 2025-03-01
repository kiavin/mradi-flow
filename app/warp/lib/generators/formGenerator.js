import { createFile } from '../utils/fileUtils.js';
import formTemplate from '../templates/form.js';
import { fetchSwaggerJson } from '../utils/apiUtils.js';

export async function generateForm(name, module, route, savePath) {
  try {
    const schema = await fetchSwaggerJson(module, route);

    if (schema.error) {
      console.log(`⚠️ ${schema.error}`);
      return false; 
    }

    if (!schema.properties) {
      console.log('⚠️ No properties found in schema.');
      return false;
    }

    const formComponent = formTemplate(name, schema.properties);

    const modulePath = `${savePath}/modules/${module}/${route}`;

    createFile(name, modulePath, formComponent);

    console.log('✅ Form component created successfully!');
    return true;

    // const viewComponent = viewTemplate(name, module, route);
    // const viewPath = `${savePath}/views/${module}`;
    // createFile(`${route}.vue`, viewPath, viewComponent);

    // console.log('✅ View page created successfully!');

    // const routePath = `${savePath}/router/${module}.js`;
    // updateRouteFile(routePath, module, route, name);
  } catch (error) {
    console.error('❌ Error generating form:', error);
    return false;
  }
}
