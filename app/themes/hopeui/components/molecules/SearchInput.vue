<script setup>
import BaseInput from '../atoms/input/BaseInput.vue';
import { ref } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  placeholder: { type: String, default: 'Search...' },
  id: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'search']);

const searchQuery = ref(props.modelValue);

// Emit search event on input change (live search)
const handleInputChange = (value) => {
  searchQuery.value = value;
  emit('update:modelValue', value);
  emit('search', value); // Auto search as user types
};

// Emit search event on button click (manual search)
const handleSearchSubmit = () => {
  emit('search', searchQuery.value);
};
</script>

<template>
  <div class="search-container">
    <!-- Search Input -->
    <BaseInput
      v-bind="$props"
      type="text"
      :modelValue="searchQuery"
      @update:modelValue="handleInputChange"
      class="search-input"
    />

    <!-- Search Button (Bootstrap) -->
    <button class="btn btn-primary search-btn" @click="handleSearchSubmit">
      <slot name="search-icon">
        Search
      </slot>
    </button>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  background: white;
  overflow: hidden;
}

.search-input {
  flex: 1;
  border: none;
  /* border-bottom: 1px dotted black; */
  outline: none;
  padding: 8px;
}

.search-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
