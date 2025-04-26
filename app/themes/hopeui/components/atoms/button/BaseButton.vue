<script setup>
const props = defineProps({
  as: { type: String, default: 'button' },
  href: { type: String, default: '#' },

  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },  
  rounded: { type: Boolean, default: false },
  pill: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  icon: { type: String, default: null },
  iconPosition: { type: String, default: 'left' },
  disabled: { type: Boolean, default: false },
  customClass: { type: String, default: '' },
});

const sizeClasses = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};
</script>

<!-- <template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'btn',
      `btn-${variant}`,
      sizeClasses[size],
      { 'rounded': rounded, 'rounded-pill': pill },
      customClass,
    ]"
  >
    <span v-if="iconPosition === 'left' && $slots.icon" class="me-2">
      <slot name="icon" />
    </span>

    <span v-if="$slots.default">
      <slot />
    </span>

    <span v-if="iconPosition === 'right' && $slots.icon" class="ms-2">
      <slot name="icon" />
    </span>
  </button>
</template> -->
<template>
  <component
    :is="as === 'link' ? 'a' : 'button'"
    :href="as === 'link' ? href : null"
    :type="as === 'link' ? null : type"
    :disabled="as === 'link' ? null : disabled"
    :class="[
      'btn',
      `btn-${variant}`,
      sizeClasses[size],
      { 'rounded': rounded, 'rounded-pill': pill, disabled: as === 'link' && disabled },
      customClass,
    ]"
  >
    <span v-if="iconPosition === 'left' && $slots.icon" class="me-2">
      <slot name="icon" />
    </span>

    <span v-if="$slots.default">
      <slot />
    </span>

    <span v-if="iconPosition === 'right' && $slots.icon" class="ms-2">
      <slot name="icon" />
    </span>
  </component>
</template>

