<script setup>
defineProps({
  size: {
    type: String,
    default: 'sm', // Options: 'sm', '', 'lg' (custom if you write your own)
  },
  color: {
    type: String,
    default: 'primary', // Bootstrap contextual color classes
  },
  customClass: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'status',
  },
})
</script>

<template>
  <span
    :class="['spinner-border', size === 'sm' ? 'spinner-border-sm' : '', `text-${color}`, customClass]"
    :role="role"
    aria-hidden="true"
  />
</template>
