<script setup>
import { ref, computed, watch, watchEffect, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useOmnigridStore } from '../../../../../omnicore/stores/omnigridStore'
import Row from './Row.vue'
import ColumnOptions from './ColumnOptions.vue'
import FilteringOptions from './FilteringOptions.vue'

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

const activeDropdown = ref(null)

function handleEllipsisClick(colKey, event) {
  activeDropdown.value = activeDropdown.value === colKey ? null : colKey
}

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

const sortColumn = ref(null)
const sortOrder = ref(null) // 'asc' | 'desc' | null

const sortedData = computed(() => {
  if (!sortColumn.value || !sortOrder.value) return props.data

  return [...props.data].sort((a, b) => {
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

const toggleSort = (key) => {
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

const maxVisibleColumns = computed(() => {
  console.log('Calculating maxVisibleColumns for width:', screenWidth.value)
  if (screenWidth.value < 576) {
    return 1
  } else if (screenWidth.value < 768) {
    return 2
  } else if (screenWidth.value < 992) {
    return 2
  } else if (screenWidth.value < 1200) {
    return 4
  } else {
    return 7
  }
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
const showPinSubmenu = ref(false)

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

const handleColumnAction = (action) => {
  console.log(`Action ${action} on column ${activeColumnKey.value}`)
  // Handle the actual action logic here
  activeColumnKey.value = null
  document.removeEventListener('click', handleOutsideClick)
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
</script>
<template>
  <div :class="{ 'table-responsive table-wrapper': !breakExtraColumns }" style="position: relative">
    <table class="table table-sm table-hover w-100">
      <thead class="table-secondary" :class="{ 'sticky-header': layouts.stickyHeader }">
        <!-- Header Row -->
        <tr>
          <!-- Radio Select Header -->
          <th v-if="radioSelect" class="text-center align-middle" style="width: 50px">
            <font-awesome-icon
              :icon="['fas', 'circle-xmark']"
              style="cursor: pointer; font-size: 1.2rem; color: #1a1a34"
              title="Clear Selection"
              @click="clearRadioSelection"
            />
          </th>

          <!-- Expand/Collapse All Column as a button -->
          <th v-if="expandableRows" class="text-center align-middle" style="width: 50px">
            <button
              class="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center"
              style="width: 20px; height: 20px"
              title="Expand Rows"
              @click="toggleAll"
            >
              <font-awesome-icon
                :icon="allExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
                style="color: black; font-size: 1rem; transform: scale(1.2)"
              />
            </button>
          </th>

          <!-- Regular Columns -->
          <template v-for="(col, index) in visibleColumns" :key="col.key">
            <th
              v-if="!isMergedColumnHidden(col.key)"
              :style="{ width: columnWidths[col.key] || 'auto' }"
              :class="[
                'position-relative text-nowrap align-middle',
                index < columns.length - 1 ? 'border-end custom-header-divider' : '',
              ]"
            >
              <div class="d-flex justify-content-center align-items-center text-center w-100">
                <!-- Column Label with Click to Toggle Sort -->
                <span
                  :style="col.key !== 'actions' && col.key !== 'id' ? 'cursor: pointer' : ''"
                  @click="col.key !== 'actions' && col.key !== 'id' && toggleSort(col.key)"
                >
                  {{ col.label }}
                </span>
                <span class="ms-2 d-inline-block" style="width: 1.2em">
                  <font-awesome-icon
                    v-if="sortColumn === col.key && sortOrder"
                    :icon="[
                      'fas',
                      sortOrder === 'asc' ? 'arrow-up-short-wide' : 'arrow-down-wide-short',
                    ]"
                    class="text-dark"
                  />
                </span>
              </div>

              <span
                v-if="col.key !== 'actions' && col.key !== 'id'"
                class="position-absolute end-0 top-50 translate-middle-y me-2 ellipsis-wrapper"
                style="cursor: pointer"
                @click.stop="onEllipsisClick(col.key, $event)"
              >
                <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
              </span>

              <div class="resize-handle" @mousedown="startResizing($event, col.key)"></div>
            </th>
          </template>
          <!-- Merged Columns (Appended or Inserted Anywhere You Need) -->
          <template v-for="merged in mergedColumns" :key="merged.label">
            <th :colspan="merged.colspan || 1" class="text-center">
              {{ merged.label }}
            </th>
          </template>

          <th
            v-if="showActions"
            class="sticky-col text-center align-middle"
            :style="{
              width: '100px',
              right: multiSelect ? '50px' : '0',
            }"
          >
            Actions
          </th>

          <th
            v-if="multiSelect"
            class="sticky-col text-center align-middle"
            title="Multi Select"
            style="width: 50px; right: 0"
          >
            <input
              type="checkbox"
              class="form-check-input"
              style="cursor: pointer"
              :checked="areAllRowsSelected"
              @change="toggleSelectAllRows"
            />
          </th>
        </tr>

        <!-- Filter Row -->
        <tr v-if="filtering">
          <!-- Empty Cell for radio Column -->
          <th v-if="radioSelect" style="visibility: hidden"></th>

          <!-- Empty Cell for Expand/Collapse Column -->
          <th v-if="expandableRows" style="background: #fff" class=""></th>

          <!-- Filter Inputs for Regular Columns -->
          <template v-for="(col, index) in visibleColumns" :key="col.key + '-filter'">
            <th
              v-if="!isMergedColumnHidden(col.key)"
              :class="[
                'bg-white position-relative',
                index < columns.length - 1 ? 'border-end custom-header-divider' : '',
              ]"
            >
              <div
                v-if="col.key !== 'actions' && col.key !== 'id'"
                class="d-flex align-items-center justify-content-between"
              >
                <input
                  type="text"
                  class="form-control form-control-sm rounded"
                  :placeholder="`Search ${col.label}`"
                  style="width: 100%; max-width: 90%"
                />
                <span
                  class="ms-2 text-secondary filter-icon-wrapper"
                  style="flex-shrink: 0; cursor: pointer"
                  @click.stop="onFilterClick(col.key, $event)"
                >
                  <font-awesome-icon :icon="['fas', 'filter']" />
                </span>
              </div>
              <div v-else class="d-flex justify-content-end align-items-center" />
            </th>
          </template>

          <!-- Filler Cells for Merged Columns -->
          <template v-for="merged in mergedColumns" :key="merged.label + '-filter'">
            <th style="visibility: hidden"></th>
          </template>

          <!-- Sticky Filter for Actions -->
          <th
            v-if="showActions"
            class="sticky-col bg-white text-center align-middle"
            :style="{
              width: '100px',
              right: multiSelect ? '50px' : '0',
            }"
          ></th>

          <!-- Sticky Filter for Multi-select -->
          <th
            v-if="multiSelect"
            :class="['text-center align-middle', { 'sticky-col': multiSelect }]"
            style="width: 50px; right: 0; background: #fff"
          ></th>
        </tr>
      </thead>
      <tbody>
        <Row
          v-for="(row, index) in sortedData"
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
</style>


<nav class="mt-3">
  <ul class="pagination justify-content-end">
    <li class="page-item">
      <a
        class="page-link on-hover"
        @click="changePage(props.paginationData.currentPage - 1)"
        :class="{ disabled: props.paginationData.currentPage === 1 }"
        >Previous</a
      >
    </li>
    <li class="page-item" v-for="count in props.paginationData.totalPages" :key="count">
      <a class="page-link" style="cursor: pointer" @click="changePage(count)">{{ count }}</a>
    </li>
    <li class="page-item">
      <a
        class="page-link on-hover"
        @click="changePage(props.paginationData.currentPage + 1)"
        :class="{
          disabled:
            props.paginationData.currentPage === props.paginationData.totalPages,
        }"
        >Next</a
      >
    </li>
  </ul>
</nav>


<nav :class="`pagination-container justify-content-${position}`">
  <ul :class="['pagination', `pagination-${variant}`]">
    <!-- First Page -->
    <li v-if="showFirstLast" class="page-item" :class="{ disabled: currentPage === 1 }">
      <a class="page-link" @click="changePage(1)" title="First Page">
        <font-awesome-icon :icon="['fas', 'angles-left']" />
      </a>
    </li>

    <!-- Previous -->
    <li class="page-item" :class="{ disabled: currentPage === 1 }">
      <a class="page-link" @click="changePage(currentPage - 1)" title="Previous">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </a>
    </li>

    <!-- Numbered Pagination -->
    <template v-if="showNumbers">
      <li
        class="page-item"
        v-for="count in totalPages"
        :key="count"
        :class="{ active: count === currentPage }"
      >
        <a class="page-link" @click="changePage(count)">{{ count }}</a>
      </li>
    </template>

    <!-- Next -->
    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
      <a class="page-link" @click="changePage(currentPage + 1)" title="Next">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </a>
    </li>

    <!-- Last Page -->
    <li v-if="showFirstLast" class="page-item" :class="{ disabled: currentPage === totalPages }">
      <a class="page-link" @click="changePage(totalPages)" title="Last Page">
        <font-awesome-icon :icon="['fas', 'angles-right']" />
      </a>
    </li>
  </ul>
</nav>