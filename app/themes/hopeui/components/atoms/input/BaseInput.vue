<script setup>
const props = defineProps({
  type: { type: String, default: 'text', required: true },
  state: { type: String },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: '' },
  modelValue: [String, Number],
  className: { type: String, default: 'default-input' }, // New prop for custom classes
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <!-- <InputAtom type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter text" /> -->

  <input
    :type="type"
    :id="id || `input-${type}`"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="className"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
/* Default input styling */
.default-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1.1rem;
}
</style>
