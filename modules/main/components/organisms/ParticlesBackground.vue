<script setup>
import { ref } from 'vue';

const options = ref({
  background: {
    color: "#0d0d0d", // Dark theme
  },
  particles: {
    number: { value: 100 },
    color: { value: "#00ffcc" }, // Neon particles
    shape: { type: "circle" },
    opacity: { value: 0.8 },
    size: { value: 3 },
    move: { enable: true, speed: 1 },
  }
});
</script>

<template>
  <vue-particles id="tsparticles" :options="options" />
</template>
