<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useOmnigridStore } from '~/omnicore/stores/omnigridStore'

import EditPanel from './EditPanel.vue'

const emit = defineEmits(['toggle-expand', 'update-all-expanded', 'action-triggered'])

const props = defineProps({
  row: Object,
  columns: Array,
  editableColumns: Array,
  allColumns: Array,
  columnSlots: Array,
  columnFormatters: Object,
  actions: Array,
  actionLayout: {
    type: String,
    default: 'inline',
  },
  multiSelect: {
    type: Boolean,
  },
  radioSelect: {
    type: Boolean,
  },
  title:{type: String},
  showActionColumn: Boolean,
  index: Number,
  mergedColumns: {
    type: Array,
    default: () => [],
  },
  breakExtraColumns: {
    type: Boolean,
    default: false,
  },

  maxVisibleColumns: {
    type: Number,
  },

  extraDynamicColumns: {
    type: Array,
    default: () => [],
  },

  isExpanded: {
    type: Boolean,
    default: false,
  },
  expandableRows: {
    type: Boolean,
  },
  // multi row select
  isSelected: Function,
  toggleRowSelection: Function,

  // radio select
  selectedRadioId: {
    type: [Object, String, Number, null],
    required: true,
  },
  handleRadioSelect: Function,

  mergedFn: Function,
  toggleAllSignal: Boolean,

  // action panel
  openRow: Number,
  toggleActionsPanel: Function,

  // column pining
  columnWidths: {
    type: Object,
    required: true,
  },
})

const store = useOmnigridStore()

const rowKey = computed(() => props.row?.id ?? props.index)

const isExpanded = computed(() => store.isRowExpanded(rowKey.value))

const onRowExpand = () => {
  store.toggleRow(rowKey.value)
}

watch(
  () => props.toggleAllSignal,
  (newVal) => {
    if (typeof newVal === 'boolean') {
      store.setRowExpanded(rowKey.value, newVal)
    }
  }
)

const isMergedColumnHidden = (key) => {
  return props.mergedColumns.some((col) => col.keys?.includes(key))
}

// row  expand animation
const beforeEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
}

const enter = (el) => {
  el.style.transition = 'all 0.4s ease'
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
}

const leave = (el) => {
  el.style.transition = 'all 0.4s ease'
  el.style.height = '0'
  el.style.opacity = '0'
}

// Action helper functions
const getActionKey = (action, row) =>
  typeof action.key === 'function' ? action.key(row) : action.key
const getActionIcon = (action, row) =>
  typeof action.icon === 'function' ? action.icon(row) : action.icon
const getActionLabel = (action, row) =>
  typeof action.label === 'function' ? action.label(row) : action.label
const getColorClass = (action, row) =>
  typeof action.colorClass === 'function' ? action.colorClass(row) : action.colorClass
const shouldShow = (action, row) =>
  typeof action.show === 'function' ? action.show(row) : action.show !== false
const isDisabled = (action, row) =>
  typeof action.disabled === 'function' ? action.disabled(row) : !!action.disabled

// const handleClick = (action, row) => {
//   if (!isDisabled(action, row)) {
//     if (typeof action.callback === 'function') {
//       emit('action-triggered', {
//         actionKey: getActionKey(action, row),
//         row: row,
//         originalCallback: action.callback,
//       })
//     }
//   }
// }
const handleClick = (action, row) => {
  if (!isDisabled(action, row)) {
    emit('action-triggered', {
      actionKey: getActionKey(action, row),
      row: row,
    })

    // Call the callback directly if it exists
    if (typeof action.callback === 'function') {
      action.callback(row)
    }
  }
}

// Computed property for filtered actions
const visibleActions = computed(() => {
  return props.actions.filter((action) => shouldShow(action, props.row))
})

/** cols length calc */
const calculateColspan = computed(() => {
  let count = props.allColumns.length
  // let count = props.columns.length
  if (props.radioSelect) count++
  if (props.expandableRows) count++
  if (props.showActions) count++
  if (props.multiSelect) count++
  if (props.breakExtraColumns) count++ // for the toggle arrow
  return count
})

const showExtra = ref(false)

const toggleExtra = () => {
  showExtra.value = !showExtra.value
}

// get the fisrt column
const isFirstVisibleColumn = (currentIndex) => {
  for (let i = 0; i < props.columns.length; i++) {
    if (!isMergedColumnHidden?.(props.columns[i].key)) {
      return i === currentIndex
    }
  }
  return false
}

/** INLINE EDITING LOGIC */
const editing = ref(false)
const editPosition = ref(null)
const currentEditColumn = ref(null)
const currentEditValue = ref('')

const isEditable = (columnKey) => {
  return props.editableColumns.some((col) =>
    typeof col === 'string' ? col === columnKey : col.key === columnKey
  )
}

const startEditing = async (column, event) => {
  if (!isEditable(column.key)) return

  const cell = event.currentTarget
  const rect = cell.getBoundingClientRect()

  editPosition.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }

  currentEditColumn.value = column
  currentEditValue.value = props.row[column.key]
  editing.value = true

  // Focus the input when editing starts
  await nextTick()
  const inputs = document.querySelectorAll('.edit-panel input')
  if (inputs.length > 0) {
    inputs[0].focus()
  }
}

const saveEdit = async ({ value }) => {
  try {
    const colConfig = props.editableColumns.find((col) =>
      typeof col === 'string'
        ? col === currentEditColumn.value.key
        : col.key === currentEditColumn.value.key
    )

    if (typeof colConfig === 'object' && colConfig.onSave) {
      const result = await colConfig.onSave(value, props.row)

      if (result?.error) {
        return {
          error: result.error,
          isLoading: result.isLoading,
        }
      }

      // Refresh if needed
      if (result?.shouldRefresh) {
        emit('refresh') // Emit refresh event
      }
    }

    editing.value = false
    emit('edit', {
      row: props.row,
      column: currentEditColumn.value,
      value,
    })
  } catch (e) {
    return { error: e.message }
  }
}

const cancelEdit = () => {
  editing.value = false
}
/** END INLINE EDITING LOGIC */

const getPinnedLeftOffset = (colKey) => {
  const pinnedLeft = store.getPinnedColumns('left')
  const index = pinnedLeft.indexOf(colKey)
  if (index === -1) return 'auto'

  let offset = 0
  for (let i = 0; i < index; i++) {
    const prevColKey = pinnedLeft[i]
    const width = props.columnWidths[prevColKey] || '150px' // Consistent default width
    offset += parseInt(width)
  }

  // Add fixed widths for special columns
  if (props.radioSelect) offset += 50
  if (props.expandableRows) offset += 50

  return `${offset}px`
}

const getPinnedRightOffset = (colKey) => {
  const pinnedRight = store.getPinnedColumns('right')
  const index = pinnedRight.indexOf(colKey)
  if (index === -1) return 'auto'

  let offset = 0
  // Calculate widths of columns to the right of this one
  for (let i = index + 1; i < pinnedRight.length; i++) {
    const nextColKey = pinnedRight[i]
    const width = props.columnWidths[nextColKey] || '150px'
    offset += parseInt(width)
  }

  // Add fixed widths for special columns
  if (props.showActions) offset += 100
  if (props.multiSelect) offset += 50

  return `${offset}px`
}
</script>

<template>
  <!-- Main Table Row -->
  <tr class="border-top border-bottom" :class="{ 'selected-row': isSelected?.(row, index) }">
    <td v-if="radioSelect" class="text-center align-middle" style="width: 50px">
      <input
        type="radio"
        name="row-selection"
        class="form-check-input"
        :value="row.id"
        :checked="(row.id ?? index) === selectedRadioId"
        @change="() => handleRadioSelect(row, index)"
        style="cursor: pointer"
      />
    </td>

    <!-- Expand Toggle Cell -->
    <td
      v-if="expandableRows"
      class="text-center align-middle"
      style="width: 50px; left: 0; position: sticky !important; z-index: 10"
    >
      <button
        class="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center"
        style="width: 20px; height: 20px"
        @click="onRowExpand"
      >
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          style="color: black; font-size: 1rem; transform: scale(1.2)"
        />
      </button>
    </td>

    <!-- Regular Columns -->

    <!-- Normal visible columns -->
    <template v-for="(col, index) in columns" :key="col.key">
      <td
        v-if="!isMergedColumnHidden?.(col.key)"
        :style="{
          left:
            store.getColumnPinPosition(col.key) === 'left' ? getPinnedLeftOffset(col.key) : 'auto',
          right:
            store.getColumnPinPosition(col.key) === 'right'
              ? getPinnedRightOffset(col.key)
              : 'auto',
          position: store.getColumnPinPosition(col.key) ? 'sticky' : 'relative',
          zIndex: store.getColumnPinPosition(col.key)
            ? 10 + store.getPinnedColumnIndex(col.key)
            : 'auto',
          // width: columnWidths[col.key] || '250px', // Ensure fixed width
          // minWidth: columnWidths[col.key] || '250px', // Prevent collapsing
          // maxWidth: columnWidths[col.key] || '250px', // Prevent expanding
          // willChange: 'transform',
        }"
        :class="{
          'sticky-col-left': store.getColumnPinPosition(col.key) === 'left',
          'sticky-col-right': store.getColumnPinPosition(col.key) === 'right',
          'fs-6 text-black': true,
        }"
        @click="(e) => startEditing(col, e)"
        :data-full-text="String(row[col.key])"
      >
        <font-awesome-icon
          :icon="['fas', showExtra ? 'chevron-down' : 'fa-chevron-right']"
          v-if="breakExtraColumns && isFirstVisibleColumn(index) && extraDynamicColumns?.length > 0"
          class="me-2"
          title="View Extra Columns"
          style="cursor: pointer"
          @click="toggleExtra"
        />
        <!-- Custom slot rendering or fallback -->
        <slot
          v-if="$slots[`column-${col.key}`]"
          :name="`column-${col.key}`"
          :row="row"
          :value="row[col.key]"
        />
        <span v-else :class="{ 'is-editable': isEditable(col.key) }">{{ row[col.key] }}</span>
      </td>

      <teleport to="body">
        <EditPanel
          v-if="editing"
          :row="row"
          :column="currentEditColumn"
          :value="currentEditValue"
          :position="editPosition"
          @save="saveEdit"
          @cancel="cancelEdit"
        />
      </teleport>
    </template>

    <!-- Merged Columns -->
    <template v-if="mergedColumns">
      <template v-for="merged in mergedColumns" :key="merged.label">
        <td :class="{ 'selected-row': isSelected?.(row, index) }" class="text-black">
          {{ mergedFn?.(row, merged) }}
        </td>
      </template>
    </template>

    <!-- Actions -->
    <td
      v-if="showActionColumn"
      class="actions text-body text-center sticky-col"
      :class="{ 'selected-row': isSelected?.(row, index) }"
      :style="{
        width: '100px',
        right: multiSelect ? '50px' : '0',
      }"
    >
      <!-- CUSTOM SLOT -->
      <slot v-if="actionLayout === 'custom'" name="custom-actions" :row="row" :actions="actions" />

      <!-- INLINE ACTIONS (default) -->
      <template v-else-if="actionLayout === 'inline'">
        <template v-for="action in actions" :key="getActionKey(action, row)">
          <slot :name="`${getActionKey(action, row)}-icon`" :row="row">
            <font-awesome-icon
              v-if="shouldShow(action, row)"
              :icon="getActionIcon(action, row)"
              @click="() => handleClick(action, row)"
              class="icon me-1 cursor-pointer"
              style="font-size: 1.2rem"
              :class="getColorClass(action, row)"
              v-tooltip:bottom="getActionLabel(action, row) + ' ' + title"
            />
          </slot>
        </template>
      </template>

      <!-- PANEL ACTIONS -->
      <template v-else-if="actionLayout === 'panel'">
        <div class="position-relative" style="z-index: 1">
          <font-awesome-icon
            icon="ellipsis-v"
            class="cursor-pointer"
            @click.stop="toggleActionsPanel(row, index)"
          />

          <!-- Floating Actions Panel -->
          <div
            v-if="openRow === (row.id ?? index)"
            class="floating-actions border rounded bg-white p-1 position-absolute"
            style="z-index: 9999; min-width: 150px; top: 100%; right: 100%"
            @click.stop
          >
            <div
              v-for="action in visibleActions"
              :key="getActionKey(action, row)"
              class="d-flex align-items-center gap-2 mb-2 cursor-pointer px-2 py-1 rounded hover-bg"
              @click="() => handleClick(action, row)"
            >
              <font-awesome-icon
                v-if="getActionIcon(action, row)"
                :icon="getActionIcon(action, row)"
                :class="getColorClass(action, row)"
              />
              <span>{{ getActionLabel(action, row) }}</span>
            </div>
          </div>
        </div>
      </template>
    </td>

    <td
      v-if="multiSelect"
      class="text-center align-middle sticky-col"
      style="width: 50px; right: 0"
    >
      <input
        type="checkbox"
        class="form-check-input"
        style="cursor: pointer"
        :checked="isSelected(row, index)"
        @change="() => toggleRowSelection(row, index)"
      />
    </td>
  </tr>

  <!-- extra columns wen breakextra coulm  is true -->
  <tr
    v-if="breakExtraColumns && showExtra"
    class="bg-light text-black"
    :class="{ 'selected-row': isSelected?.(row, index) }"
  >
    <td :colspan="calculateColspan">
      <div class="d-flex flex-wrap gap-2 p-1">
        <div
          v-for="col in extraDynamicColumns"
          :key="'extra-' + col.key"
          class="border1 rounded1 px-1 py-0"
          style="min-width: 100px"
        >
          <strong>{{ col.label }}: </strong>
          <span v-if="$slots[`column-${col.key}`]">
            <slot :name="`column-${col.key}`" :row="row" :value="row[col.key]" />
          </span>
          <span v-else>
            {{ row[col.key] }}
          </span>
        </div>
      </div>
    </td>
  </tr>
  <!-- end extra columns  -->

  <!-- Expanded Row -->
  <tr v-if="isExpanded" class="border-bottom text-body no-hover">
    <td :colspan="calculateColspan" style="background: cyan">
      <transition name="slide-expand" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div v-show="isExpanded" class="expanded-wrapper">
          <slot name="expanded" :row="row" />
        </div>
      </transition>
    </td>
  </tr>
</template>

<style scoped>
.expanded-wrapper {
  overflow: hidden;
  width: 100%;
}
.no-hover:hover {
  background-color: transparent !important;
  cursor: default;
}

.no-hover td {
  pointer-events: none;
}

/* ellipsis action layout */

.floating-actions {
  top: 100%;
  right: 0;
}
.hover-bg:hover {
  background-color: #f8f9fa; /* light grey on hover */
}
.cursor-pointer {
  cursor: pointer;
}
/* panle anime */
.floating-actions {
  transition: all 0.2s ease;
  transform-origin: top;
  animation: fadeInUp 0.2s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ellipsis action layout */

.selected-row,
.selected-row td,
.selected-row .sticky-col {
  /* background-color: #e5c7ca !important; */
  z-index: 10;
}

/* sticky columns */
.sticky-col {
  position: sticky !important;
  right: 0;
  /* background-color: white; */
  /* z-index: 10; */
}

.sticky-col:nth-child(1) {
  right: 0;
}
.sticky-col:nth-child(2) {
  right: 50px;
}

/* end sticky colums */

/* INLINE EDITING CSS */
.editable-cell {
  position: relative;
  cursor: pointer;
}

.editable-cell:hover {
  background-color: #f8f9fa; /* Light gray background on hover */
}

.is-editable {
  cursor: pointer;
  color: #0d6efd !important; /* Blue text color */
  border-bottom: 1px dashed #0d6efd !important; /* Blue dashed underline */
  transition: all 0.2s ease;
  display: inline-block; /* To make border-bottom work inline */
  padding-bottom: 1px; /* Adjust padding as needed */
}

.editable-cell.text-primary .is-editable {
  border-bottom-style: solid !important; /* Solid underline when editing */
  font-weight: 500;
}

.editable-cell.text-primary {
  background-color: #e7f1ff; /* Light blue background when editing */
}

/* Make sure the edit panel appears above everything */
.edit-panel {
  z-index: 10000;
}
/* END INLINE EDITING CSS */

.sticky-pinned {
  position: sticky !important;
  background-color: grey;

  top: 0;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
