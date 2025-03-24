<template>
  <div :class="`content-inner pb-0 ${pageLayout}`" id="page_layout">
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue'

// Pinia Store
import { useSetting } from '~/themes/hopeui/store/index.js'

export default {
  setup() {
    const store = useSetting()
    const pageLayout = computed(() => store.page_layout)
    return {
      pageLayout,
    }
  },
}
</script>
