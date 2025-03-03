<script setup>
const props = defineProps({
  title: { type: String },
})
</script>
<template>
  <button
    class="c4h8f cpq1v cqbkb cta5t cz8jp cm2qf cscsd coh5f c90mn c4cae cpaw2 cb919 citnk c6rcm c405v"
    :class="tab !== '1' ? 'cj4h1 ca93n' : 'ckqrw cx431 cl5ur'"
    @click.prevent="tab = '1'"
  >
    <slot name="icon"></slot>

    <span>{{ props.title }}</span>
  </button>
</template>