import { createPageTemplate, updatePageTemplate, viewPageTemplate, indexPageTemplate } from './pages.js';

export default function pageTemplate(route, type, tableColumns, moduleName) {
  switch (type) {
    case 'create':
      return createPageTemplate(route, moduleName);
    case 'update':
      return updatePageTemplate(route, moduleName);
    case 'view':
      return viewPageTemplate(route, moduleName);
    case 'index':
      return indexPageTemplate(route, tableColumns, moduleName);
    default:
      throw new Error(`Unknown page type: ${type}`);
  }
}