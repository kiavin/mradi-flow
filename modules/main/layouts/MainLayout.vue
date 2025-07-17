<script setup>
import { onMounted, onUnmounted } from 'vue'
import MainAssets from '../bundles/MainAssets' //asset manager
 
onMounted(async () => {
  await MainAssets.register()
})

onUnmounted(() => {
  MainAssets.cleanup()
})
const { Header, Footer } = MainAssets.getComponents()
</script>
<template>
  <body class="c54cm ctzj3 cp877 cbh0c c9xyi">
    <div class="clfoz cxmgp cwkat cg9hr citnk">
      <Header />
      <slot></slot>
      <Footer />
    </div>
  </body>
</template>

<style scoped></style>
