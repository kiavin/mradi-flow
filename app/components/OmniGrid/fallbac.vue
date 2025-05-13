<script setup>
import { ref } from 'vue'
import { useOmnigridStore } from '../../../../../omnicore/stores/omnigridStore'

const props = defineProps({
  columns: Array,
  visibleColumns: Array,
  mergedColumns: Array,
  columnWidths: Object,
  isMergedColumnHidden: Function,
  radioSelect: Boolean,
  expandableRows: Boolean,
  showActions: Boolean,
  multiSelect: Boolean,
  filtering: Boolean,
  sortColumn: String,
  sortOrder: String,
  areAllRowsSelected: Boolean,
  layouts: Object,
  allExpanded: Boolean,

  // selected values form fltering compnent
  selectedValues: {
    type: Object,
    default: () => ({}),
  },
  uniqueValues: {
    type: Object,
    default: () => ({}),
  },
  // column pining
  columnWidths: {
    type: Object,
    required: true,
  },
  scrollLeft: {
    type: Number,
    default: 0
  },
})

const emit = defineEmits([
  'clear-radio-selection',
  'toggle-all',
  'toggle-sort',
  'ellipsis-click',
  'filter-click',
  'toggle-select-all',
  'start-resizing',
  'column-search',
])

const store = useOmnigridStore()

const searchQueries = ref({})

const toggleSort = (key) => {
  emit('toggle-sort', key)
}

const onEllipsisClick = (colKey, event) => {
  emit('ellipsis-click', colKey, event)
}

const onFilterClick = (colKey, event) => {
  emit('filter-click', colKey, event)
}

const toggleSelectAllRows = (event) => {
  emit('toggle-select-all', event)
}

const startResizing = (event, colKey) => {
  emit('start-resizing', event, colKey)
}

const handleSearchInput = (colKey, value) => {
  searchQueries.value[colKey] = value
  emit('column-search', {
    column: colKey,
    value: value,
  })
}




// Add these to your script section in TableHeader.vue
// const getPinnedLeftOffset = (colKey) => {
//   const pinnedLeft = store.getPinnedColumns('left');
//   const index = pinnedLeft.indexOf(colKey);
//   if (index === -1) return 'auto';
  
//   let offset = 0;
//   for (let i = 0; i < index; i++) {
//     const prevColKey = pinnedLeft[i];
//     const width = props.columnWidths[prevColKey] || '100px';
//     offset += parseInt(width);
//   }
//   // offset = 100;

//   return `${offset}px`;
// };

// const getPinnedRightOffset = (colKey) => {
//   const pinnedRight = store.getPinnedColumns('right');
//   const index = pinnedRight.indexOf(colKey);
//   if (index === -1) return 'auto';
  
//   let offset = 0;
//   for (let i = 0; i < index; i++) {
//     const prevColKey = pinnedRight[i];
//     const width = props.columnWidths[prevColKey] || '100px';
//     offset += parseInt(width);
//   }
//   offset = 100;

//   return `${offset}px`;
// };


// Update the getPinnedLeftOffset function
// const getPinnedLeftOffset = (colKey) => {
//   const pinnedLeft = store.getPinnedColumns('left');
//   const index = pinnedLeft.indexOf(colKey);
//   if (index === -1) return 'auto';
  
//   let offset = 0;
//   for (let i = 0; i < index; i++) {
//     const prevColKey = pinnedLeft[i];
//     const width = props.columnWidths[prevColKey] || 100; // default to 100px if not set
//     offset += parseInt(width);
//   }
  
//   // Add fixed widths for radio/expand columns if they exist
//   if (props.radioSelect) offset += 50;
//   if (props.expandableRows) offset += 50;
  
//   return `${offset}px`;
// };

// // Update the getPinnedRightOffset function
// const getPinnedRightOffset = (colKey) => {
//   const pinnedRight = store.getPinnedColumns('right');
//   const index = pinnedRight.indexOf(colKey);
//   if (index === -1) return 'auto';
  
//   let offset = 0;
//   for (let i = index + 1; i < pinnedRight.length; i++) {
//     const nextColKey = pinnedRight[i];
//     const width = props.columnWidths[nextColKey] || 100; // default to 100px if not set
//     offset += parseInt(width);
//   }
  
//   // Add fixed widths for actions/multi-select if they exist
//   if (props.showActions) offset += 100;
//   if (props.multiSelect) offset += 50;
  
//   return `${offset}px`;
// };

const getPinnedLeftOffset = (colKey) => {
  const pinnedLeft = store.getPinnedColumns('left');
  const index = pinnedLeft.indexOf(colKey);
  if (index === -1) return 'auto';
  
  let offset = 0;
  for (let i = 0; i < index; i++) {
    const prevColKey = pinnedLeft[i];
    const width = props.columnWidths[prevColKey] || 100; // default to 100px
    offset += parseInt(width);
  }
  
  // Add fixed widths for special columns
  if (props.radioSelect) offset += 50;
  if (props.expandableRows) offset += 50;
  
  return `${offset}px`;
};

const getPinnedRightOffset = (colKey) => {
  const pinnedRight = store.getPinnedColumns('right');
  const index = pinnedRight.indexOf(colKey);
  if (index === -1) return 'auto';
  
  let offset = 0;
  // Calculate widths of columns to the right of this one
  for (let i = index + 1; i < pinnedRight.length; i++) {
    const nextColKey = pinnedRight[i];
    const width = props.columnWidths[nextColKey] || 100;
    offset += parseInt(width);
  }
  
  // Add fixed widths for special columns
  if (props.showActions) offset += 100;
  if (props.multiSelect) offset += 50;
  
  return `${offset}px`;
};
 
</script>

<template>
  <thead class="table-secondary" :class="{ 'sticky-header': layouts.stickyHeader }">
    <!-- Header Row -->
    <tr>
      <!-- Radio Select Header -->
      <th v-if="radioSelect" class="text-center align-middle sticky-col" style="width: 50px; left: 0">
        <font-awesome-icon
          :icon="['fas', 'circle-xmark']"
          style="cursor: pointer; font-size: 1.2rem; color: #1a1a34"
          title="Clear Selection"
          @click="$emit('clear-radio-selection')"
        />
      </th>

      <!-- Expand/Collapse All Column as a button -->
      <th v-if="expandableRows" class="text-center align-middle sticky-col" style="width: 50px; left: 0; z-index: 15px;">
        <button
          class="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center"
          style="width: 20px; height: 20px;"
          title="Expand Rows"
          @click="$emit('toggle-all')"
        >
          <font-awesome-icon
            :icon="allExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
            style="color: black; font-size: 1rem; transform: scale(1.2)"
          />
        </button>
      </th>

      <!-- Regular Columns -->
      <template v-for="(col, index) in visibleColumns" :key="col.key">
         
        <!-- <th
  v-if="!isMergedColumnHidden(col.key)"
  :style="{ 
    left: store.getColumnPinPosition(col.key) === 'left' ? getPinnedLeftOffset(col.key) : 'auto',
    right: store.getColumnPinPosition(col.key) === 'right' ? getPinnedRightOffset(col.key) : 'auto',
    position: store.getColumnPinPosition(col.key) ? 'sticky' : 'relative',
    zIndex: store.getColumnPinPosition(col.key) ? 10 : 'auto',
  }"
  :class="[
    'position-relative text-nowrap align-middle',
    {
      'sticky-col-left': store.getColumnPinPosition(col.key) === 'left',
      'sticky-col-right': store.getColumnPinPosition(col.key) === 'right',
      'border-end custom-header-divider': index < columns.length - 1,
    },
  ]"
> -->
<th
  v-if="!isMergedColumnHidden(col.key)"
  :style="{ 
    left: store.getColumnPinPosition(col.key) === 'left' ? getPinnedLeftOffset(col.key) : 'auto',
    right: store.getColumnPinPosition(col.key) === 'right' ? getPinnedRightOffset(col.key) : 'auto',
    position: store.getColumnPinPosition(col.key) ? 'sticky' : 'relative',
    zIndex: store.getColumnPinPosition(col.key) ? 10 + store.getPinnedColumnIndex(col.key) : 'auto',
  }"
  :class="[
    'text-nowrap align-middle',
    {
      'sticky-pinned': store.getColumnPinPosition(col.key),
      'border-end custom-header-divider': index < columns.length - 1,
    },
  ]"
>
          <!-- <div class="d-flex justify-content-center align-items-center text-center w-100">
             -->
          <div class="d-flex justify-content-between align-items-center w-100">
            <!-- Column Label with Click to Toggle Sort -->
            <span
              class="flex-grow-1"
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
            @click.stop="(e) => onEllipsisClick(col.key, e)"
          >
            <!-- <span
      v-if="col.key !== 'actions' && col.key !== 'id'"
      class="ms-2 ellipsis-wrapper"
      style="cursor: pointer; flex-shrink: 0"
      @click.stop="(e) => onEllipsisClick(col.key, e)"
    > -->
            <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
          </span>

          <div class="resize-handle" @mousedown="startResizing($event, col.key)"></div>
        </th>
      </template>

      <!-- Merged Columns -->
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
      <th v-if="radioSelect" style="visibility: hidden; left:0"  class="sticky-col bg-white text-center align-middle"></th>

      <!-- Empty Cell for Expand/Collapse Column -->
      <th v-if="expandableRows" style="background: #fff; left:0"  class="sticky-col bg-white text-center align-middle"></th>

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
              :value="searchQueries[col.key]"
              @input="handleSearchInput(col.key, $event.target.value)"
            />
            <span
              class="ms-2 text-secondary filter-icon-wrapper"
              style="flex-shrink: 0; cursor: pointer"
              :class="{
                'filter-icon-active':
                  selectedValues[col.key]?.length > 0 &&
                  selectedValues[col.key]?.length < uniqueValues[col.key]?.length,
              }"
              @click.stop="onFilterClick(col.key, $event)"
            >
              <font-awesome-icon :icon="['fas', 'filter']" />
              <span
                v-if="
                  selectedValues[col.key]?.length > 0 &&
                  selectedValues[col.key]?.length < uniqueValues[col.key]?.length
                "
                class="filter-badge"
              >
                {{ selectedValues[col.key]?.length }}
              </span>
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
        style="background: #fff"
      ></th>
    </tr>
  </thead>
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

.sticky-col {
  position: sticky;
  right: 0;
  background-color: inherit;
  z-index: 10;
}

.filter-icon-wrapper {
  position: relative;
  z-index: 1;
}

/* filtering */

.filter-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--bs-primary);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* colun pinning */

.sticky-col-left {
  position: sticky !important;
  left: 0;
  background-color: #d3d3d3;
  z-index: 10;
}

.sticky-col-right {
  position: sticky !important;
  right: 0;
  background-color: #d3d3d3;
  z-index: 10;
}

.sticky-pinned {
  position: sticky !important;
  background-color: lightgrey;
}

.resize-handle {
  z-index: 20; /* Ensure resize handles stay above pinned columns */
}

/* Add shadow to indicate pinned columns */
.sticky-pinned[style*="left"]:not(:last-of-type) {
  box-shadow: 4px 0 4px -2px rgba(0, 0, 0, 0.1);
}

.sticky-pinned[style*="right"]:not(:last-of-type) {
  box-shadow: -4px 0 4px -2px rgba(0, 0, 0, 0.1);
}

</style>
