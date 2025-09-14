<template>
  <Multiselect
    v-model="internalValue"
    :options="options"
    :placeholder="placeholder"
    :mode="mode"
    :searchable="searchable"
    :close-on-select="closeOnSelect"
    :track-by="trackBy"
    :label="label"
    :taggable="taggable"
    :create-option="createOption"
  />
</template>
<script setup>
import { ref, watch } from 'vue'
import Multiselect from '@vueform/multiselect'

// Define and destructure props
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select',
  },
  mode: {
    type: String,
    default: 'default', // 'default' | 'single' | 'multiple' | 'tags'
  },
  taggable: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  closeOnSelect: {
    type: Boolean,
    default: true,
  },
  label: {
    type: String,
    default: 'label',
  },
  trackBy: {
    type: String,
    default: 'value',
  },
  createOption: {
    type: Function,
    default: (input) => ({ label: input, value: input }),
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Properly use modelValue from props
const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val
  },
)

watch(internalValue, (val) => {
  emit('update:modelValue', val)
})
</script>
