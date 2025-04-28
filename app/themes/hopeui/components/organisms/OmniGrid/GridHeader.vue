<script setup>
import { ref } from 'vue'
import SearchInput from '../../molecules/SearchInput.vue'
import PageDropDownSelect from '../../molecules/PageDropDownSelect.vue'
import BaseButton from '../../atoms/button/BaseButton.vue'

const emit = defineEmits([
  'search',
  'update:modelValue',
  'update:perPage',
  'changePage',
  'create',
  'refresh',
  'toggleShowAll',
  'export',
])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [], paginationData: {} }),
  },
  toolbar: {
    type: Object,
    default: () => ({
      show: false,
      showCreateButton: false,
      showExportButton: false,
    }),
  },
  showCreateButton: { type: Boolean, default: false },
  showRefreshButton: { type: Boolean, default: true },
  showShowAllToggle: { type: Boolean, default: false },
  showExportButton: { type: Boolean, default: false },
})

const searchQuery = ref('')
const showAll = ref(false)

const handlePerPageChange = (newPerPage) => {
  emit('update:perPage', newPerPage)
  emit('changePage', 1)
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const onCreate = () => emit('create')
const onRefresh = () => emit('refresh')
const onToggleShowAll = () => emit('toggleShowAll')
const onExport = (type) => emit('export', type)
</script>

<template>
  <div class="d-flex flex-column mb-4 w-100">
    <!-- Toolbar -->
    <div v-if="toolbar.show" class="d-flex justify-content-between align-items-center mb-2">
      <!-- Left Section (Custom Slot Buttons) -->
      <div class="d-flex align-items-center">
        <template v-if="toolbar.showCreateButton">
          <slot name="left-buttons"></slot>
        </template>
      </div>

      <!-- Right Section (Action Buttons) -->
      <div class="d-flex align-items-center">
        <!-- Create Button -->

        <BaseButton @click="onCreate" class="btn btn-light btn-sm me-2" title="Create">
          <template #icon>
            <font-awesome-icon :icon="['fas', 'plus']" class="icon-cs" />
          </template>
        </BaseButton>

        <!-- Refresh Button -->
        <BaseButton @click="onRefresh" class="btn btn-light btn-sm me-2" title="Refresh">
          <template #icon>
            <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" class="icon-cs" />
          </template>
        </BaseButton>

        <!-- Show All Toggle -->
        <BaseButton @click="onToggleShowAll" class="btn btn-light btn-sm me-2" title="Show All">
          <template #icon>
            <font-awesome-icon :icon="['fas', showAll ? 'compress' : 'expand']" class="icon-cs" />
          </template>
        </BaseButton>

        <!-- Export Options -->
        <div class="dropdown" v-if="showExportButton">
          <BaseButton
            class="btn btn-light btn-sm dropdown-toggle"
            type="button"
            id="exportDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <template #icon>
              <font-awesome-icon :icon="['fas', 'up-right-from-square']" class="icon-cs" />
            </template>
          </BaseButton>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="exportDropdown">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="onExport('csv')">Export CSV</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="onExport('excel')">Export Excel</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="onExport('pdf')">Export PDF</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Existing Search and Page Dropdown -->
    <div class="d-flex align-items-center justify-content-between">
      <PageDropDownSelect
        :modelValue="props.data?.data?.paginationData?.perPage"
        @update:modelValue="handlePerPageChange"
      />
      <SearchInput v-model="searchQuery" @search="handleSearch" type="text" class="border p-0" />
    </div>
  </div>
</template>
<style scoped>
.icon-cs {
  font-size: 1.2rem;
}
</style>
