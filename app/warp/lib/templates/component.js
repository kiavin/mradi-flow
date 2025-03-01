export default function componentTemplate(name) {
    const template = `
     <script setup>
        import { ref } from 'vue';
        
        const name = ref('${name}');
     </script>
     
     <template>
        <div>{{ name }} Component</div>
     </template>
  
     <style scoped></style>
    `
    template.trim();
    return template;
  }
  