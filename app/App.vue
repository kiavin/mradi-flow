<script setup>
import { useRoute } from 'vue-router'
import { watch, computed } from 'vue'
import Modal from '~/themes/hopeui/components/organisms/GlobalModal'
import { useLayoutStore } from '~/omnicore/stores/layoutStore.js'

const route = useRoute()
const layoutStore = useLayoutStore()

watch(
  () => route.meta.layout,
  (layoutName) => {
    layoutStore.setLayout(layoutName)
  },
  { immediate: true },
)
const CurrentLayout = computed(() => layoutStore.layout || 'div')
</script>

<template>
  <component :is="CurrentLayout">
    <RouterView />
  </component>
  <Modal />
</template>

<style lang="scss">
// @import '@/assets/custom-vue/scss/styles.scss';
@import '~/themes/hopeui/assets/scss/hope-ui.scss';
@import '~/themes/hopeui/assets/scss/pro.scss';
@import '~/themes/hopeui/assets/scss/custom.scss';
@import '~/themes/hopeui/assets/scss/customizer.scss';
@import '~/themes/hopeui/assets/custom-vue/scss/plugins.scss';
</style>
