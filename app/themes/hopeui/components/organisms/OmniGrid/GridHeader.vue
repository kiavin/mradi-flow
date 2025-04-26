<script setup>
import { ref } from 'vue';
import SearchInput from '../../molecules/SearchInput.vue'
import PageDropDownSelect from '../../molecules/PageDropDownSelect.vue'

const emit = defineEmits(['search', 'update:modelValue', 'update:perPage', 'changePage'])
const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [], paginationData: {} }),
  },

})

const searchQuery = ref('')

const handlePerPageChange = (newPerPage) => {
  console.log(`NEW PER PAGE ${newPerPage}`)
  emit('update:perPage', newPerPage)
  emit('changePage', 1)
}

// const handleSearch = () => {
//   if (props.searchInBackend) {
//     console.log('searching', searchQuery.value)
//     emit('search', searchQuery.value)
//   }
// }
// In GridHeader.vue
const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>
<template>
  <div class="d-flex align-items-center justify-content-between mb-4 w-100">
    <PageDropDownSelect
      :modelValue="props.data?.paginationData?.perPage"
      @update:modelValue="handlePerPageChange"
    />
    <SearchInput v-model="searchQuery" @search="handleSearch" type="text" class="border p-0"/>
  </div>
</template>
