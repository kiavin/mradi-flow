<script setup>
import MainAssets from '../bundles/MainAssets'

const { Hero, Features, Features2, Features3, Warpcard } = MainAssets.getComponents()
</script>

<template>
  <main class="cih8s">
    <Hero />
    <Features />
    <Features2 />
    <Features3 />
    <Warpcard />
  </main>
</template>

<style scoped></style>
