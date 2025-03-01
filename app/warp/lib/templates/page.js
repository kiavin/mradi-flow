export default function pageTemplate(name) {
    const template = `
      <script setup>
        import { ref } from 'vue';
  
        const name = ref('${name}');
        </script>
        <template>
            <div class="page-container">
            <h1>{{ name }} Page</h1>
            </div>
        </template>
        
        <style scoped></style>
    `
    template.trim();
    return template;
}
