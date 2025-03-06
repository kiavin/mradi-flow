<script setup>
import { ref, computed, defineEmits, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import SearchInput from '../molecules/SearchInput.vue'
import PageDropDownSelect from '../molecules/PageDropDownSelect.vue'

const emit = defineEmits(['view', 'edit', 'delete', 'changePage', 'search', 'update:perPage'])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [], paginationData: {} }),
  },
  columns: Array,
  searchInBackend: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  showView: { type: Boolean, default: true },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  actions: {
    type: Array,
    default: () => [],
  },
  columnFormatters: {
    type: Object,
    default: () => ({}), // Allows users to pass custom formatters
  },
  mergedColumns: {
    type: Array,
    default: () => [], // Example: [{ keys: ['start_time', 'end_time'], label: 'Time Range', separator: ' - ' }]
  },
})

const actions = computed(() => {
  const defaultActions = [
    {
      label: 'View',
      key: 'view',
      icon: faEye,
      callback: (row) => emit('view', row.id),
      show: props.showView,
    },
    {
      label: 'Edit',
      key: 'edit',
      icon: ['fas', 'pen-to-square'],
      callback: (row) => emit('edit', row.id),
      show: props.showEdit,
    },
    {
      label: 'Delete',
      key: 'delete',
      icon: faTrashCan,
      callback: (row) => emit('delete', row.id),
      show: props.showDelete,
    },
  ]

  // Add `show` property to custom actions (if not provided, default to true)
  const customActions = props.actions.map((action) => ({
    ...action,
    show: action.show !== undefined ? action.show : true, // Default to visible
  }))

  return [...defaultActions, ...customActions].filter((action) => action.show)
})

const searchQuery = ref('')

watch(searchQuery, (newQuery) => {
  if (props.searchInBackend) {
    emit('search', newQuery)
  }
})

watch(
  () => props.data,
  (newData) => {
    console.log('DataTable received new data:', newData)
  },
  { deep: true },
)

const filteredData = computed(() => {
  if (props.searchInBackend) {
    return props.data.data // Access data inside the object
  }

  return props.data.data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
  )
})

const paginatedData = computed(() => {
  const start = (props.data.paginationData.currentPage - 1) * props.data.paginationData.perPage
  return filteredData.value.slice(start, start + props.data.paginationData.perPage)
})

const isMergedColumnHidden = (columnKey) => {
  return props.mergedColumns.some((merged) => merged.keys.includes(columnKey))
}

const getMergedValue = (row, merged) => {
  return merged.keys.map((key) => row[key] || '').join(merged.separator || ' ')
}

const handleSearch = () => {
  if (props.searchInBackend) {
    emit('search', searchQuery.value)
  }
}

// Change page using paginationData
const changePage = (page) => {
  if (page > 0 && page <= props.data.paginationData.totalPages) {
    props.data.paginationData.currentPage = page
    emit('changePage', page)
  }
}

// Handle per page change
const handlePerPageChange = (newPerPage) => {
  emit('update:perPage', newPerPage)
  props.data.paginationData.currentPage = 1 // Reset to first page when perPage changes
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-between mb-4 w-100">
    <PageDropDownSelect
      :modelValue="props.data.paginationData.perPage"
      @update:modelValue="handlePerPageChange"
    />
    <SearchInput v-model="searchQuery" @search="handleSearch" type="text" />
  </div>

  <!-- Table -->
  <div class="table-responsive table-wrapper">
    <table class="table table-sm table-hover">
      <thead class="table-secondary">
        <tr>
          <template v-for="col in columns" :key="col.key">
            <th v-if="!isMergedColumnHidden(col.key)">{{ col.label }}</th>
          </template>
          <template v-for="merged in mergedColumns" :key="merged.label">
            <th>{{ merged.label }}</th>
          </template>
          <th v-if="showActions">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="props.data.length === 0">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center">
            No results found
          </td>
        </tr>
        <template v-else>
          <tr v-for="(row, index) in paginatedData" :key="index">
            <template v-for="col in columns" :key="col.key">
              <td v-if="!isMergedColumnHidden(col.key)" class="fs-6">
                <template v-if="props.columnFormatters[col.key]">
                  <component
                    :is="
                      typeof props.columnFormatters[col.key] === 'function'
                        ? props.columnFormatters[col.key]()
                        : props.columnFormatters[col.key]
                    "
                    :value="row[col.key]"
                    :row="row"
                    :data="row"
                  />
                </template>
                <template v-else>
                  {{ row[col.key] }}
                </template>
              </td>
            </template>

            <!-- Merged Columns -->
            <template v-for="merged in mergedColumns" :key="merged.label">
              <td>
                {{ getMergedValue(row, merged) }}
              </td>
            </template>

            <!-- Actions Column -->
            <td v-if="showActions" class="actions">
              <template v-for="action in actions" :key="action.key">
                <slot :name="`${action.key}-icon`" :row="row">
                  <font-awesome-icon
                    :icon="action.icon"
                    @click="() => action.callback(row)"
                    class="icon"
                    :class="{
                      'text-primary': action.key !== 'delete',
                      'text-danger': action.key === 'delete',
                    }"
                  />
                </slot>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Pagination -->
  <nav>
    <ul class="pagination justify-content-end">
      <li class="page-item">
        <a
          class="page-link on-hover"
          @click="changePage(props.data.paginationData.currentPage - 1)"
          :class="{ disabled: props.data.paginationData.currentPage === 1 }"
          >Previous</a
        >
      </li>
      <li class="page-item" v-for="count in props.data.paginationData.totalPages" :key="count">
        <a class="page-link" style="cursor: pointer" @click="changePage(count)">{{ count }}</a>
      </li>
      <li class="page-item">
        <a
          class="page-link on-hover"
          @click="changePage(props.data.paginationData.currentPage + 1)"
          :class="{
            disabled:
              props.data.paginationData.currentPage === props.data.paginationData.totalPages,
          }"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.on-hover {
  cursor: pointer;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.icon {
  font-size: 1.2rem;
  margin-right: 5px;
}
.table-wrapper {
  overflow-x: auto;
  white-space: nowrap;
  max-width: 100%;
}
</style>
