<script setup>
const props = defineProps({
  options: {
    type: Object,
    default: () => ({
      containerWidth: 100,
      containerHeight: 100,
      borderRadius: '50%',
      border: '1px solid cyan',
      imgWidth: 90,
      imgHeight: 90,
      objectFit: 'contain',
      src: '/storage/logos/removebg.png',
      alt: 'fb',
    }),
  },
})
</script>

<template>
  <div
    :style="{
      width: props.options.containerWidth + 'px',
      height: props.options.containerHeight + 'px',
      borderRadius: props.options.borderRadius,
      border: props.options.border,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }"
  >
    <img
      src="/logos/removebg.png"
      :alt="props.options.alt"
      loading="lazy"
      :style="{
        width: props.options.imgWidth + 'px',
        height: props.options.imgHeight + 'px',
        objectFit: props.options.objectFit,
      }"
    />
  </div>
</template>
