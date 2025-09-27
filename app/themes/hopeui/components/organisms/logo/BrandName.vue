<template>
  {{ appName }}
</template>

<script>
import { computed } from 'vue'

// Pinia Store
import { useSetting } from '../../../store/index'
export default {
  setup() {
    const store = useSetting()
    const appName = computed(() => store.app_name_value)
    return { appName }
  }
}
</script>
