<script setup>
import Illustrator from '../atoms/Illustrator.vue'
import HeroContent from './HeroContent.vue'
</script>
<template>
  <section>
    <div class="c7rlc c4lt2 ca7yh cxk7g c62s6">
      <!-- Particles animation -->
      <div class="csbhs cvjd3 cblyu" aria-hidden="true">
        <canvas data-particle-animation=""></canvas>
      </div>
      <div class="cdzmb ckqbz cxmgp csbhs cvjd3 ca0nu" aria-hidden="true">
        <div class="ca1ms cq6fz csbhs cmjk5">
          <Illustrator />
        </div>
      </div>
      <HeroContent />
    </div>
  </section>
</template>

<style scoped>
.cblyu {
  z-index: -10;
}
</style>