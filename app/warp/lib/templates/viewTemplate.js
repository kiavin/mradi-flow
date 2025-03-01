export default function viewTemplate(name, module, route) {
    return `
<script setup>
import ${name} from '@/views/modules/${module}/${route}/${name}.vue';

 
</script>
<template>
  <div>
    <h1>${name} Page</h1>
    <${name} />
  </div>
</template>
`;
}
