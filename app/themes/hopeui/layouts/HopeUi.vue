<script setup>
import { onMounted, onUnmounted } from 'vue';
import HopeUiAssets from '../../bundles/HopeUiAssets' //asset manager

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSetting } from '~/themes/hopeui/store/index.js'

const route = useRoute()
const store = useSetting()
const isBanner = computed(() => route.meta.isBanner)
const bannerStyle = computed(() => store.header_banner_value)

onMounted(async () => {
  await HopeUiAssets.register()
})

onUnmounted(() => {
  HopeUiAssets.cleanup()
})
const { HeaderComponent, MainContentComponent, SidebarComponent, FooterComponent, SubHeader } =
  HopeUiAssets.getComponents()
</script>
<template>
  <sidebar-component></sidebar-component>
  <main class="main-content">
    <div :class="`position-relative  ${isBanner ? 'iq-banner ' + bannerStyle : ''}`">
      <header-component></header-component>
      <template v-if="isBanner">
        <sub-header></sub-header>
      </template>
    </div>
    <main-content-component>
      <slot></slot>
    </main-content-component>

    <footer-component></footer-component>
  </main>
</template>

<style lang="scss">
@import '~/themes/hopeui/assets/scss/hope-ui.scss';
@import '~/themes/hopeui/assets/scss/pro.scss';
@import '~/themes/hopeui/assets/scss/custom.scss';
@import '~/themes/hopeui/assets/scss/customizer.scss';
@import '~/themes/hopeui/assets/custom-vue/scss/plugins.scss';
</style>
