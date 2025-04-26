<script setup>
import BaseInput from '../atoms/input/BaseInput.vue'
import { ref } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  placeholder: { type: String, default: 'Search...' },
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'search'])

const searchQuery = ref(props.modelValue)

// Emit search event on input change (live search)
const handleInputChange = (value) => {
  searchQuery.value = value
  emit('update:modelValue', value)
  emit('search', value)
}

// Emit search event on button click (manual search)
const handleSearchSubmit = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <div class="search-container">
    <BaseInput
      v-bind="$props"
      type="text"
      :modelValue="searchQuery"
      @update:modelValue="handleInputChange"
      class="search-input"
    />
    <button class="search-btn" @click="handleSearchSubmit" :disabled="!searchQuery">
      <slot name="search-icon">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </slot>
    </button>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  background: white;
  overflow: hidden;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 12px;
}

.search-input:focus {
  outline: none;
  box-shadow: none;
}

.search-btn {
  border: none;
  background: transparent;
  padding: 0 12px;
  color: #6c757d;
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
}

.search-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.search-btn:focus {
  outline: none;
  box-shadow: none;
}
</style>
