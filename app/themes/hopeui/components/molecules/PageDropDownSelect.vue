<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 20 },
  options: {
    type: Array,
    default: () => [5, 10, 20, 50, 100],
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <select
    class="form-select per-page-dropdown"
    :value="modelValue"
    @change="emit('update:modelValue', Number($event.target.value))"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<style scoped>
.per-page-dropdown {
  width: auto;
  min-width: 60px;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 35px;
}
</style>
