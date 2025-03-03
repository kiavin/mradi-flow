<script setup>
const props = defineProps({
  variant: { type: String, default: 'primary' }, // Bootstrap variant
  size: { type: String, default: 'md' },
  rounded: { type: Boolean, default: false },
  pill: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  icon: { type: String, default: null },
  iconPosition: { type: String, default: 'left' },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' }, // Custom classes for Tailwind/Bootstrap
})

// Default styling (Bootstrap-like)
const baseClasses = 'focus:outline-none transition duration-300'
const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600',
  secondary: 'bg-gray-500 hover:bg-gray-600',
  danger: 'bg-red-500 hover:bg-red-600',
  success: 'bg-green-500 hover:bg-green-600',
  warning: 'bg-yellow-500 hover:bg-yellow-600',
  info: 'bg-teal-500 hover:bg-teal-600',
  light: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  dark: 'bg-gray-800 text-white hover:bg-gray-900',
}
const sizeClasses = {
  sm: 'text-sm px-3 py-1',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-3',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      { rounded: rounded, 'rounded-full': pill },
      customClass,
    ]"
  >
    <span v-if="iconPosition === 'left' && $slots.icon" class="btn-inner">
      <slot name="icon"></slot>
    </span>

    <span v-if="$slots.default">
      <slot></slot>
    </span>

    <span v-if="iconPosition === 'right' && $slots.icon" class="btn-inner">
      <slot name="icon"></slot>
    </span>
  </button>
</template>
