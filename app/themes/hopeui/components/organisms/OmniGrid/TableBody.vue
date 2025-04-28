<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue'
import { useOmnigridStore } from '../../../../../omnicore/stores/omnigridStore'
import Row from './Row.vue'
import ColumnOptions from './ColumnOptions.vue'
import FilteringOptions from './FilteringOptions.vue'
import TableHeader from './TableHeader.vue'
import Pagination from './Pagination.vue'

const emit = defineEmits([
  'action-triggered',
  'search',
  'update:perPage',
  'changePage',
  'column-search',
])

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  columnSlots: Array,
  mergedColumns: {
    type: Array,
    default: () => [],
    // Example: [{ keys: ['start_time', 'end_time'], label: 'Time Range', separator: ' - ' }]
  },
  breakExtraColumns: {
    type: Boolean,
    default: false,
  },

  data: {
    type: Array,
    default: () => [],
  },
  loading: { type: Boolean },
  searchInBackend: { type: Boolean, default: true },
  paginationData: { type: Object, default: () => ({}) },
  paginationConfig: {
    type: Object,
    default: () => ({}),
  },
  searchQuery: {
    type: String,
    default: '',
  },
  actions: {
    type: Array,
    default: () => [],
  },
  showActions: {
    type: Boolean,
    default: true,
  },
  actionLayout: {
    type: String,
    default: 'inline', // other: 'panel', 'custom'
  },
  layouts: {
    type: Object,
    default: () => ({
      center_text: 'text-center',
      stickyHeader: true,
      scrollY: true,
    }),
  },
  multiSelect: {
    type: Boolean,
  },
  radioSelect: {
    type: Boolean,
  },
  expandableRows: {
    type: Boolean,
  },
  filtering: {
    type: Boolean,
  },
  animations: {
    type: Object,
    default: () => ({
      enabled: true,
      search: {
        duration: 300,
        easing: 'ease-in-out',
      },
      sort: {
        duration: 400,
        easing: 'ease-out',
      },
      pagination: {
        duration: 300,
        easing: 'ease-in',
      },
      rowHeight: 50,
    }),
  },
})

const store = useOmnigridStore()

/**colum handling end */
const allExpanded = ref(false)

const toggleAll = () => {
  store.setAllExpanded(sortedData, !store.allExpanded)
  allExpanded.value = !allExpanded.value
}

watch(
  () => props.toggleAllSignal,
  (newVal) => {
    emit('toggle-expand', { row: props.row, expanded: newVal })
  },
)

// emiting events
const onActionTriggered = (payload) => {
  emit('action-triggered', payload)
}

/** data serching and pagination */

// Watch for data changes
watch(
  () => props.data,
  (newData) => {
    console.log('DataTable received new data:', newData)
  },
  { deep: true },
)

const filteredData = computed(() => {
  if (props.searchInBackend) {
    return props.data
  } else {
    if (!props.searchQuery) return props.data

    return props.data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(props.searchQuery.toLowerCase()),
      ),
    )
  }
})

/** data sorting logic  */
const sortColumn = ref(null)
const sortOrder = ref(null) // 'asc' | 'desc' | null

const sortedData = computed(() => {
  const dataToSort = filteredData.value

  if (!sortColumn.value || !sortOrder.value) return dataToSort

  return [...dataToSort].sort((a, b) => {
    const valA = a[sortColumn.value]
    const valB = b[sortColumn.value]

    if (valA === null || valA === undefined) return 1
    if (valB === null || valB === undefined) return -1
    if (valA === valB) return 0

    const isString = typeof valA === 'string' && typeof valB === 'string'
    if (sortOrder.value === 'asc') {
      return isString ? valA.localeCompare(valB) : valA > valB ? 1 : -1
    } else {
      return isString ? valB.localeCompare(valA) : valA < valB ? 1 : -1
    }
  })
})
 

const toggleSort = (key, explicitDirection = null) => {
  if (explicitDirection) {
    // If direction is explicitly provided (from dropdown)
    sortColumn.value = key
    sortOrder.value = explicitDirection
    return
  }

  // Original toggle logic for header clicks
  if (sortColumn.value === key) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else if (sortOrder.value === 'desc') {
      sortColumn.value = null
      sortOrder.value = null
    } else {
      sortOrder.value = 'asc'
    }
  } else {
    sortColumn.value = key
    sortOrder.value = 'asc'
  }
}

const paginatedData = computed(() => {
  if (props.searchInBackend) {
    // Backend handles pagination - just return sorted data
    return sortedData.value
  }

  // Client-side pagination
  const { currentPage = 1, perPage = 20 } = props.paginationData
  const start = (currentPage - 1) * perPage
  const end = start + perPage
  return sortedData.value.slice(start, end)
})

// Handle per page changes
const handlePageChange = (page) => {
  if (props.searchInBackend) {
    emit('changePage', page)
  } else {
    // For client-side pagination, just update the current page
    props.paginationData.currentPage = page
  }
}

const handlePerPageChange = (newPerPage) => {
  const perPage = parseInt(newPerPage, 10)
  if (props.searchInBackend) {
    emit('update:perPage', perPage)
    emit('changePage', 1) // Reset to first page when changing page size
  } else {
    props.paginationData.perPage = perPage
    props.paginationData.currentPage = 1 // Reset to first page
  }
}
// const handleColumnSearch = () => emit('columnSearch')
const onColumnSearch = (searchQuery) => {
  emit('column-search', searchQuery.value)
}
/**end data search and pagination */

const columnWidths = ref({})
let isResizing = false
let startX = 0
let startWidth = 0
let currentColIndex = null

function startResizing(e, colKey) {
  isResizing = true
  startX = e.clientX
  currentColIndex = colKey
  const th = e.target.closest('th')
  startWidth = th.offsetWidth

  document.addEventListener('mousemove', handleResizing)
  document.addEventListener('mouseup', stopResizing)
  e.preventDefault() // Prevent text selection during resize
}

function handleResizing(e) {
  if (!isResizing || !currentColIndex) return

  const deltaX = e.clientX - startX
  const newWidth = Math.max(startWidth + deltaX, 50)

  columnWidths.value[currentColIndex] = `${newWidth}px`
}

function stopResizing() {
  isResizing = false
  currentColIndex = null
  document.removeEventListener('mousemove', handleResizing)
  document.removeEventListener('mouseup', stopResizing)
}

// action button panle close and open logic
const openRow = ref(null)

function toggleActionsPanel(row, index) {
  const rowKey = row.id ?? index
  openRow.value = openRow.value === rowKey ? null : rowKey
}
function closePanelOnClickOutside(event) {
  const panels = document.querySelectorAll('.floating-actions')
  let clickedInside = false
  panels.forEach((panel) => {
    if (panel.contains(event.target)) {
      clickedInside = true
    }
  })
  if (!clickedInside) {
    openRow.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closePanelOnClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closePanelOnClickOutside)
})

// MERGING COLUMNS
const isMergedColumnHidden = (columnKey) => {
  return props.mergedColumns.some((merged) => merged.keys.includes(columnKey))
}

const getMergedValue = (row, merged) => {
  return merged.keys.map((key) => row[key] || '').join(merged.separator || ' ')
}

// multi select
const selectedRowIds = ref([])

function getRowKey(row, index) {
  return row.id ?? index
}

// Computed to check if all rows are selected
const areAllRowsSelected = computed(() => {
  return (
    sortedData.value.length > 0 &&
    sortedData.value.every((row, index) => selectedRowIds.value.includes(getRowKey(row, index)))
  )
})

// Function to toggle select all
function toggleSelectAllRows() {
  if (areAllRowsSelected.value) {
    selectedRowIds.value = []
  } else {
    selectedRowIds.value = sortedData.value.map((row, index) => getRowKey(row, index))
  }
}

function toggleRowSelection(row, index) {
  const key = getRowKey(row, index)
  const idx = selectedRowIds.value.indexOf(key)

  if (idx === -1) {
    selectedRowIds.value.push(key)
  } else {
    selectedRowIds.value.splice(idx, 1)
  }
}

// Function to check if one row is selected
function isSelected(row, index) {
  return selectedRowIds.value.includes(getRowKey(row, index))
}

// radio select
const selectedRadioId = ref(null)

const handleRadioSelect = (row, index) => {
  selectedRadioId.value = row.id ?? index
}
const clearRadioSelection = () => {
  console.log('clicked')
  selectedRadioId.value = null
}

// auto detect visible columns logic here
const screenWidth = ref(window.innerWidth)

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
}

// const maxVisibleColumns = computed(() => {
//   console.log('Calculating maxVisibleColumns for width:', screenWidth.value)
//   if (screenWidth.value < 576) {
//     return 1
//   } else if (screenWidth.value < 768) {
//     return 2
//   } else if (screenWidth.value < 992) {
//     return 2
//   } else if (screenWidth.value < 1200) {
//     return 4
//   } else {
//     return 7
//   }
// })
const maxVisibleColumns = computed(() => {
  console.log('Calculating maxVisibleColumns for width:', screenWidth.value)
  
  // Count how many special columns are active
  const specialColumnsCount = [
    props.multiSelect,
    props.radioSelect,
    props.expandableRows,
    props.showActions
  ].filter(Boolean).length
  
  // Base visible columns based on screen size
  let baseColumns
  if (screenWidth.value < 576) { // Mobile
    baseColumns = 1
  } else if (screenWidth.value < 768) { // Small tablet
    baseColumns = 2
  } else if (screenWidth.value < 992) { // Tablet
    baseColumns = 3
  } else if (screenWidth.value < 1200) { // Small desktop
    baseColumns = 4
  } else { // Large desktop
    baseColumns = 7
  }
  
  // Adjust for special columns
  // On mobile, we want to prioritize showing at least 1 data column
  if (screenWidth.value < 576) {
    return Math.max(1, baseColumns - specialColumnsCount)
  }
  // On larger screens, we can be more generous
  return Math.max(1, baseColumns - Math.min(specialColumnsCount, 2))
})

const dynamicColumns = computed(() => {
  const staticKeys = new Set(['actions', 'multiSelect', 'radioSelect', 'expandableRows'])
  return props.columns.filter((col) => !staticKeys.has(col.key))
})

const visibleColumns = computed(() => {
  if (!props.breakExtraColumns) return props.columns

  const staticCols = props.columns.filter((col) =>
    ['actions', 'multiSelect', 'radioSelect', 'expandableRows'].includes(col.key),
  )

  return [...staticCols, ...dynamicColumns.value.slice(0, maxVisibleColumns.value)]
})

const extraDynamicColumns = computed(() =>
  props.breakExtraColumns ? dynamicColumns.value.slice(maxVisibleColumns.value) : [],
)

onMounted(() => {
  updateScreenWidth()
  window.addEventListener('resize', updateScreenWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth)
})

// column options logic
const activeColumnKey = ref(null)
const menuPosition = ref({ top: 0, left: 0 })

const onEllipsisClick = (columnKey, event) => {
  event.stopPropagation()

  if (activeColumnKey.value === columnKey) {
    activeColumnKey.value = null
    return
  }

  activeColumnKey.value = columnKey

  // Get the parent th element's position
  const th = event.currentTarget.closest('th')
  const thRect = th.getBoundingClientRect()

  menuPosition.value = {
    top: thRect.bottom + window.scrollY,
    left: thRect.left + window.scrollX,
  }

  nextTick(() => {
    document.addEventListener('click', handleOutsideClick)
  })
}

const handleOutsideClick = (event) => {
  const dropdown = document.querySelector('.column-dropdown')
  const ellipsisIcons = document.querySelectorAll('.ellipsis-icon')

  // Check if click was outside dropdown and not on any ellipsis icon
  if (dropdown && !dropdown.contains(event.target)) {
    let clickedOnEllipsis = false
    ellipsisIcons.forEach((icon) => {
      if (icon.contains(event.target)) clickedOnEllipsis = true
    })

    if (!clickedOnEllipsis) {
      activeColumnKey.value = null
      document.removeEventListener('click', handleOutsideClick)
    }
  }
}

 
const handleColumnAction = ({ type, columnKey }) => {
  if (type.startsWith('sort-')) {
    const direction = type === 'sort-asc' ? 'asc' : 'desc'

    // Call your existing toggleSort function with the column key and direction
    toggleSort(columnKey, direction)
  }
  // Handle other actions (pin, etc.)
  activeColumnKey.value = null
}

// Close dropdown when component unmounts
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// column filtering logic
const activeFilterColumn = ref(null)
const filterMenuPosition = ref({ top: 0, left: 0 })

const onFilterClick = (colKey, event) => {
  event.stopPropagation()
  if (activeFilterColumn.value === colKey) {
    activeFilterColumn.value = null
    return
  }

  activeFilterColumn.value = colKey
  const th = event.currentTarget.closest('th')
  const thRect = th.getBoundingClientRect()

  filterMenuPosition.value = {
    top: thRect.bottom + window.scrollY,
    left: thRect.left + window.scrollX,
  }
}

const handleColumnFilter = ({ columnKey, values }) => {
  if (values.length === 0) {
    sortedData.value = [...props.data]
  } else {
    sortedData.value = props.data.filter((row) => {
      const cellValue = row[columnKey]
      return cellValue !== undefined && cellValue !== null && values.includes(cellValue)
    })
  }
}

/**pagination data and config */

/*Loading Animations */
const loading = ref(false)

const paginationConfig = inject('paginationConfig', {})
</script>
<template>
  <div :class="{ 'table-responsive table-wrapper': !breakExtraColumns }" style="position: relative">
    <table class="table table-sm table-hover w-100">
      <TableHeader
        :columns="columns"
        :visible-columns="visibleColumns"
        :merged-columns="mergedColumns"
        :column-widths="columnWidths"
        :is-merged-column-hidden="isMergedColumnHidden"
        :radio-select="radioSelect"
        :expandable-rows="expandableRows"
        :show-actions="showActions"
        :multi-select="multiSelect"
        :filtering="filtering"
        :sort-column="sortColumn"
        :sort-order="sortOrder"
        :are-all-rows-selected="areAllRowsSelected"
        :layouts="layouts"
        :all-expanded="allExpanded"
        @clear-radio-selection="clearRadioSelection"
        @toggle-all="toggleAll"
        @toggle-sort="toggleSort"
        @ellipsis-click="(colKey, event) => onEllipsisClick(colKey, event)"
        @filter-click="(colKey, event) => onFilterClick(colKey, event)"
        @toggle-select-all="toggleSelectAllRows"
        @start-resizing="startResizing"
        @column-search="onColumnSearch"
      />

      <tbody>
        <Row
          v-for="(row, index) in paginatedData"
          :key="row.id ?? index"
          :row="row"
          :index="index"
          :columns="visibleColumns"
          :all-columns="columns"
          :break-extra-columns="breakExtraColumns"
          :expandable-rows="expandableRows"
          :column-formatters="{}"
          :actions="actions"
          :show-actions="showActions"
          :merged-columns="mergedColumns"
          :merged-fn="getMergedValue"
          :action-layout="actionLayout"
          :multi-select="multiSelect"
          :radio-select="radioSelect"
          :open-row="openRow"
          :is-selected="isSelected"
          :toggle-actions-panel="toggleActionsPanel"
          :selected-radio-id="selectedRadioId"
          :toggle-row-selection="toggleRowSelection"
          :handle-radio-select="handleRadioSelect"
          :max-visible-columns="maxVisibleColumns"
          :extra-dynamic-columns="extraDynamicColumns"
          @action-triggered="onActionTriggered"
        >
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
          <template #expanded> </template>
        </Row>
      </tbody>
    </table>

    <!-- Column Options Dropdown -->
    <ColumnOptions
      :menu-position="menuPosition"
      :active-column-key="activeColumnKey"
      :sort-column="sortColumn"
      :sort-order="sortOrder"
      @action="handleColumnAction"
      @close="activeColumnKey = null"
    />
    <!-- Column Options Dropdown -->

    <!-- filtering component here -->
    <FilteringOptions
      v-if="filtering && activeFilterColumn"
      :column="columns.find((c) => c.key === activeFilterColumn)"
      :column-data="data"
      :menu-position="filterMenuPosition"
      :is-active="!!activeFilterColumn"
      @filter="handleColumnFilter"
      @close="activeFilterColumn = null"
    />
    <!-- filtering component here -->
  </div>

  <!-- pagination component  -->
  <Pagination
    v-if="paginationConfig.show !== false"
    :data="props.paginationData"
    :position="paginationConfig.position || 'center'"
    :variant="paginationConfig.variant || 'default'"
    :show-first-last="paginationConfig.showFirstLast !== false"
    :show-numbers="paginationConfig.showNumbers !== false"
    :show-total="paginationConfig.showTotal !== false"
    :show-range="paginationConfig.showRange !== false"
    :bg-color="paginationConfig.bgColor"
    :hover-bg-color="paginationConfig.hoverBgColor"
    :text-color="paginationConfig.textColor"
    :active-text-color="paginationConfig.activeTextColor"
    @changePage="handlePageChange"
    @update:perPage="handlePerPageChange"
  />
</template>
<style scoped>
.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
}

/* sticky columns */
.sticky-col {
  position: sticky;
  right: 0;
  background-color: inherit;
  z-index: 10;
}

.selected-row,
.selected-row td,
.selected-row .sticky-col {
  background-color: #e5c7ca !important;
  z-index: 5;
}

.table {
  padding: 0;
  margin: 0;
  max-width: 100% !important;
}

/* filtering panel css  */
.filter-icon-wrapper {
  position: relative;
  z-index: 1;
}

/* In your main component's style */
.table-wrapper {
  position: relative;
  overflow-x: auto !important; /* Enable horizontal scroll */
  overflow-y: hidden;
  z-index: auto;
}

.column-dropdown,
.filter-panel {
  z-index: 1050 !important;
  position: fixed !important;
}

/* Loading Animations Css */
</style>
