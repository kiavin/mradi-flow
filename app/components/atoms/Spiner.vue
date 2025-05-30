<script setup>
defineProps({
  size: {
    type: String,
    default: 'sm', // Accepts: 'sm', '', 'lg', or custom values
  },
  color: {
    type: String,
    default: 'primary', // Bootstrap color class
  },
  customClass: {
    type: String,
    default: '', // Optional custom class names
  },
  role: {
    type: String,
    default: 'status',
  },
})
</script>

<template>
  <span
    :class="[
      'spinner-border',
      size === 'sm' ? 'spinner-border-sm' : '',
      `text-${color}`,
      customClass,
    ]"
    :role="role"
    aria-hidden="true"
  />
</template>
