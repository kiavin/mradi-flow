<script setup>
 const date = new Date().getFullYear()
</script>


<template>
  <footer class="footer bg-dark text-white text-center p-3">
    <p>&copy; {{ date }} CrackIiTechnologies | All rights reserved</p>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
