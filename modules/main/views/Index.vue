<script setup>
import { onMounted, onUnmounted } from 'vue';

// import '../assets/style.css'
// import '../assets/js/main.js'

// import '../assets/css/vendors/aos.css'
import '../assets/css/vendors/swiper-bundle.min.css'
import Hero from '@/main/components/organisms/Hero.vue'
import Header from '@/main/components/organisms/Header.vue'
import Features from '@/main/components/organisms/Features.vue'
import Features2 from '@/main/components/organisms/Features2.vue'
import Features3 from '@/main/components/organisms/Features3.vue'
import Warpcard from '../components/molecules/Warpcard.vue'
import Footer from '../components/organisms/Footer.vue'



onMounted(() => {
  import('../assets/style.css');
});

onUnmounted(() => {
  document.querySelectorAll('link[href*="style.css"]').forEach(link => link.remove());
});
</script>

<template>
  <body class="c54cm ctzj3 cp877 cbh0c c9xyi">
    <div class="clfoz cxmgp cwkat cg9hr citnk">
      <Header />
      <main class="cih8s">
        <Hero />
        <Features />
        <Features2 />
        <Features3 />
        <Warpcard />
      </main>
      <Footer />
    </div>
  </body>
</template>

<style scoped>
</style>
