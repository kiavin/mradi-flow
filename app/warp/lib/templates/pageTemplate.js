export default function pageTemplate(name, type) {
    let scriptContent = `<script setup>\nimport { ref } from 'vue';\n`;
    let templateContent = `<template>\n  <div class="container">\n    <h1>{{ name }} Page</h1>\n`;
  
    // Include Form component for 'create' and 'update' pages
    if (['create', 'update'].includes(type)) {
      scriptContent += `import Form from './form';\n`;
      templateContent += `    <Form />\n`;
    }
  
    // Include useRoute for 'view' and 'update' pages
    if (['view', 'update'].includes(type)) {
      scriptContent += `import { useRoute } from 'vue-router';\n\nconst route = useRoute();\nconsole.log('ID received:', route.params.id);\n`;
    }
  
    scriptContent += `const name = ref('${name}');\n</script>\n`;
    templateContent += `  </div>\n</template>\n\n<style scoped></style>\n`;
  
    return scriptContent + templateContent;
  }
  

