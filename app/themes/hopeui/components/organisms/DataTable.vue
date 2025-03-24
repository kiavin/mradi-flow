here <script setup>
import { ref, computed, watch, watchEffect, onMounted, nextTick } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import SearchInput from '../molecules/SearchInput.vue'
import PageDropDownSelect from '../molecules/PageDropDownSelect.vue'
import { Tooltip } from 'bootstrap'
const emit = defineEmits(['view', 'edit', 'delete', 'changePage', 'search', 'update:perPage'])

onMounted(() => {
  nextTick(() => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
      new Tooltip(el)
    })
  })
})

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [], paginationData: {} }),
  },
  columns: Array,
  filterableColumns: Array,
  searchInBackend: { type: Boolean, default: true },
  showActions: { type: Boolean, default: true },
  showView: { type: Boolean, default: true },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  layouts: {
    type: Object,
    default: () => ({
      center_text: 'text-center',
      stickyHeader: true,
      scrollY: true,
    }),
  },
  sortableColumns: {
    type: Array,
    default: () => ['date'], // Example: ['name', 'created_at']
  },
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
      show: (row) => props.showView && row.is_deleted !== 1,
      colorClass: 'text-primary',
    },
    {
      label: 'Edit',
      key: 'edit',
      icon: ['fas', 'pen-to-square'],
      callback: (row) => emit('edit', row.id),
      show: (row) => props.showEdit && row.is_deleted !== 1,
      colorClass: 'text-primary',
    },
    {
      label: (row) => (row?.is_deleted === 1 ? 'Restore' : 'Delete'),
      key: (row) => (row?.is_deleted === 1 ? 'restore' : 'delete'),
      icon: (row) => (row?.is_deleted === 1 ? ['fas', 'rotate-left'] : faTrashCan),
      callback: (row) => emit('delete', row.id, row?.is_deleted),
      show: props.showDelete,
      colorClass: (row) => (row?.is_deleted === 1 ? 'text-primary' : 'text-danger'),
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
    return props.data.data.map((item) => ({ ...item }))
  }

  const filtered = props.data.data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase()),
    ),
  )

  return filtered.map((item) => ({ ...item }))
})

const paginatedData = ref([])

watch(
  [
    filteredData,
    () => props.data.paginationData.currentPage,
    () => props.data.paginationData.perPage,
  ],
  () => {
    const start = (props.data.paginationData.currentPage - 1) * props.data.paginationData.perPage
    const end = start + props.data.paginationData.perPage

    if (filteredData.value.length > 0) {
      paginatedData.value = filteredData.value.slice(start, end) || []
    } else {
      paginatedData.value = []
    }
  },
)

watchEffect(() => {
  if (filteredData.value.length > 0 && paginatedData.value.length === 0) {
    // console.log('Fixing paginated data since it was empty while filtered data has data')
    const start = (props.data.paginationData.currentPage - 1) * props.data.paginationData.perPage
    const end = start + props.data.paginationData.perPage
    paginatedData.value = filteredData.value || []
  }
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
    emit('changePage', page)
  }
}

// Handle per page change
const handlePerPageChange = (newPerPage) => {
  emit('update:perPage', newPerPage)
  emit('changePage', 1) // Reset to first page when perPage changes
}

// sorting logic

const sortColumn = ref(null)
const sortOrder = ref('asc')

const sortedData = computed(() => {
  if (!sortColumn.value) return props.data.data // No sorting applied initially

  return [...props.data.data].sort((a, b) => {
    const valA = a[sortColumn.value]
    const valB = b[sortColumn.value]

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder.value === 'asc' ? valA - valB : valB - valA
    }

    return 0
  })
})

const toggleSort = (column) => {
  if (!props.sortableColumns.includes(column)) return // Ensure sorting is only applied to sortable columns

  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc' // Toggle order
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc' // Default to ascending order when switching columns
  }
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
      <thead class="table-secondary" :class="{ 'sticky-header': props.layouts.stickyHeader }">
        <tr>
          <template v-for="col in columns" :key="col.key">
            <th
              v-if="!isMergedColumnHidden(col.key)"
              scope="col"
              @click="toggleSort(col.key)"
              class="sortable font-weight-bold"
            >
              <span
                v-if="col.label.length > 15"
                data-toggle="tooltip"
                :title="col.label"
                class="d-inline-block text-truncate"
                style="max-width: 120px"
              >
                {{ col.label }}
              </span>
              <span v-else>{{ col.label }}</span>
              <!-- Sorting Indicators -->
              <span v-if="sortColumn === col.key">
                <font-awesome-icon :icon="sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'" />
              </span>
            </th>
          </template>
          <template v-for="merged in mergedColumns" :key="merged.label">
            <th>{{ merged.label }}</th>
          </template>
          <th v-if="showActions">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center">
            <div class="text-center">
              <div
                class="spinner-border text-primary"
                role="status"
                style="width: 3rem; height: 3rem"
              >
                <span class="sr-only"></span>
              </div>
            </div>
            <!-- <div class="loader"></div> -->
          </td>
        </tr>
        <tr v-else-if="props.data.data.length === 0">
          <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center">
            No results found
          </td>
        </tr>
        <template v-else>
          <tr v-for="(row, index) in sortedData" :key="index">
            <template v-for="col in columns" :key="col.key">
              <td
                v-if="!isMergedColumnHidden(col.key)"
                class="fs-6 text-black"
                :data-full-text="String(row[col.key])"
              >
                <template v-if="props.columnFormatters[col.key]">
                  <component
                    :is="
                      typeof props.columnFormatters[col.key] === 'function'
                        ? props.columnFormatters[col.key]()
                        : props.columnFormatters[col.key]
                    "
                    :value="String(row[col.key])"
                    :row="row"
                    :data="row"
                  />
                </template>
                <template v-else>
                  <!-- {{ row[col.key] }} -->
                  <span
                    v-if="String(row[col.key]).length > 10"
                    data-toggle="tooltip"
                    :title="row[col.key]"
                    class="d-inline-block text-truncate"
                    style="max-width: 180px"
                  >
                    {{ row[col.key] }}
                  </span>
                  <span v-else>{{ row[col.key] }}</span>
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
                    v-if="typeof action.show === 'function' ? action.show(row) : action.show"
                    :icon="typeof action.icon === 'function' ? action.icon(row) : action.icon"
                    @click="() => action.callback(row)"
                    class="icon"
                    :class="
                      typeof action.colorClass === 'function'
                        ? action.colorClass(row)
                        : action.colorClass
                    "
                    data-bs-toggle="tooltip"
                    :title="typeof action.label === 'function' ? action.label(row) : action.label"
                  />
                </slot>
              </template>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <!-- end Table  -->
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
  <!-- end pagination -->
</template>

<style scoped>
th,
td {
  max-width: 150px; /* Adjust this based on your needs */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  position: relative;
}
.table.table-sm tbody tr {
  height: 30px; /* Adjust this value as needed */
}

.table.table-sm tbody td {
  padding: 4px 8px; /* Reduce cell padding */
  font-size: 14px; /* Adjust font size */
  line-height: 1.2; /* Reduce line height */
  vertical-align: middle; /* Keep content centered */
}

th:hover::after,
td:hover::after {
  content: attr(data-full-text);
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  white-space: normal;
  max-width: 300px;
  z-index: 10;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}

th:hover::after,
td:hover::after {
  opacity: 1;
}

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
/* .table-wrapper {
  overflow-x: auto;
  max-height: 400px;
  white-space: nowrap;
  max-width: 100%;
} */

.sticky-header {
  position: sticky;
  top: 0;
  background-color: #f8f9fa; /* Ensure it's visible over content */
  z-index: 1000;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1); /* Optional: Add a shadow */
}

/* Ensure column headers have a background */
th {
  background-color: #f8f9fa;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
}

/* Loading animation  */
.loader {
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  display: inline-grid;
}
.loader:before,
.loader:after {
  content: 'Loading...';
  grid-area: 1/1;
  -webkit-mask: linear-gradient(90deg, #000 50%, #0000 0) 0 50%/2ch 100%;
  mask: linear-gradient(90deg, #000 50%, #0000 0) 0 50%/2ch 100%;
  animation: l11 1s infinite cubic-bezier(0.5, 220, 0.5, -220);
}
.loader:after {
  -webkit-mask-position: 1ch 50%;
  mask-position: 1ch 50%;
  --s: -1;
}
@keyframes l11 {
  100% {
    transform: translateY(calc(var(--s, 1) * 0.1%));
  }
}
/* end loading anime  */

/* sorting styles */
th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background-color: #f0f0f0;
}
/*  end  */
</style>