<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSetting } from '~/themes/hopeui/store/index.js'
import HeaderComponent from '~/themes/hopeui/components/molecules/partials/HeaderComponent.vue'
import MainContentComponent from '~/themes/hopeui/components/molecules/partials/MainContentComponent.vue'
import SidebarComponent from '~/themes/hopeui/components/molecules/partials/SidebarComponent.vue'
import FooterComponent from '~/themes/hopeui/components/molecules/partials/FooterComponent.vue'
import SubHeader from '~/themes/hopeui/components/molecules/SubHeaderComponent.vue'

const route = useRoute()
const store = useSetting()
const isBanner = computed(() => route.meta.isBanner)
const bannerStyle = computed(() => store.header_banner_value)
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
