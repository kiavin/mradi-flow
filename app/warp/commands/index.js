import formCommand from './form.js';
import pageCommand from './page.js';
import componentCommand from './component.js';
import moduleCommand from './module.js';


export default function registerCommands(program) {
    program.addCommand(formCommand);
    program.addCommand(moduleCommand);
    program.addCommand(pageCommand);
    program.addCommand(componentCommand);
}
