import fs from 'fs';
import path from 'path';
import formTemplate from '../templates/form.js';

export function createFormTemplate(name, module, route, savePath, schema) {
    try {
        if (!schema || !schema.properties) {
            console.log(`⚠️ No properties found for ${route}. Skipping form generation.`);
            return false;
        }

        const formComponent = formTemplate(name, schema.properties);
        const formPath = path.join(savePath, 'views', route, 'form.vue');

        // Ensure directory exists
        fs.mkdirSync(path.dirname(formPath), { recursive: true });

        // Overwrite form.vue with the new template
        fs.writeFileSync(formPath, formComponent, 'utf-8');
        console.log(`✅ form.vue for "${route}" has been created/overwritten.`);

        return true;
    } catch (error) {
        console.error('❌ Error generating form:', error);
        return false;
    }
}



export function createLayout(){

}