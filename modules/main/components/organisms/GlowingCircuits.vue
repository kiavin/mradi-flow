<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';

onMounted(() => {
  gsap.fromTo(
    ".circuit-line",
    { opacity: 0 },
    { opacity: 1, duration: 2, repeat: -1, yoyo: true, stagger: 0.3 }
  );
});
</script>

<template>
  <div class="circuit">
    <div class="circuit-line"></div>
    <div class="circuit-line"></div>
    <div class="circuit-line"></div>
  </div>
</template>

<style scoped>
.circuit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80vw;
  height: 50vh;
  transform: translate(-50%, -50%);
}

.circuit-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #00ffcc, #0077ff);
  box-shadow: 0px 0px 10px rgba(0, 255, 204, 0.8);
  margin: 20px 0;
  opacity: 0;
}
</style>
