<script setup>
import { useRoute } from 'vue-router'
import { watch, computed } from 'vue'
import Modal from '~/components/organisms/GlobalModal'
import { useLayoutStore } from '~/omnicore/stores/layoutStore.js'
import { useAuthStore } from './omnicore/stores/authStore'

const route = useRoute()
const layoutStore = useLayoutStore()

const auth = useAuthStore()

onMounted(() => {
  auth.initStore()
})

watch(
  () => route.meta.layout,
  (layoutName) => {
    layoutStore.setLayout(layoutName)
  },
  { immediate: true }
)
const CurrentLayout = computed(() => layoutStore.layout || 'div')
</script>

<template>
  <component :is="CurrentLayout">
    <RouterView />
  </component>
  <Modal />
</template>
