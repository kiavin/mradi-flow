<script setup>
const props = defineProps({
  labelFor: { type: String, default: '' },
  required: { type: Boolean, default: false },
  tooltip: { type: String, default: '' },
  customClass: { type: String, default: '' }, // Custom classes for Bootstrap/Tailwind
})

// Default base styles
const baseClasses = 'font-medium text-gray-700 dark:text-gray-200'
</script>

<template>
  <label :for="labelFor" :class="[baseClasses, customClass]">
    <slot></slot>

    <span v-if="required" class="text-red"> *</span>

    <span v-if="tooltip" class="ml-2 text-gray-500 text-sm cursor-help" :title="tooltip">ℹ️</span>
  </label>
</template>
<style scoped>
.text-red {
    color: red;
}
</style>
