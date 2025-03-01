import formCommand from './form.js';
import pageCommand from './page.js';
import componentCommand from './component.js';

export default function registerCommands(program) {
    program.addCommand(formCommand);
    program.addCommand(pageCommand);
    program.addCommand(componentCommand);
}
