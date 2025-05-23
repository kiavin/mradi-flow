<script setup>
import { ref, computed, useSlots, provide } from 'vue'
import GridHeader from './OmniGrid/GridHeader.vue'
import TableBody from './OmniGrid/TableBody.vue'

const emit = defineEmits([
  'action',
  'view',
  'edit',
  'delete',
  'restore',
  'changePage',
  'search',
  'update:perPage',
  'refresh',
])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [], paginationData: {} }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array,
    default: () => [],
  },
  mergedColumns: {
    type: Array,
    default: () => [],
    // Example: [{ keys: ['start_time', 'end_time'], label: 'Time Range', separator: ' - ' }]
  },
  editableColumns: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every((col) => typeof col === 'string' || (col && typeof col.key === 'string'))
    },
  },
  dropDownPerPageOptions: {
    type: Array,
  },
  searchInBackend: { type: Boolean, default: true },
  options: {
    type: Object,
    default: () => ({
      wrapperClass: '',
      tableClass: '',
      headerClass: '',
      rowClass: '',
      cellClass: '',
      paginationClass: '',
      filterClass: '',
      rowSize: '',
    }),
  },
  paginationConfig: {
    type: Object,
    default: () => ({
      variant: 'default', // 'default', 'compact', 'rounded', 'circle'
      position: 'center', // 'left', 'center', 'right'
      bgColor: null, // Background color for active pagination items
      hoverBgColor: null, // Background color on hover
      textColor: null, // Text color
      activeTextColor: null, // Active item text color
      showFirstLast: true, // Show first/last buttons
      showNumbers: true, // Show page numbers
      showTotal: true, // Show "Total: X" text
      showRange: true, // Show "Showing X-Y" text
      enabled: true, // Enable/disable pagination completely
      show: true, // Show/hide pagination
    }),
  },
  layout: {
    type: [Object, String],
    default: () => ({}),
  },
  layoutTheme: {
    type: String,
    default: '', // options: 'bootstrap', 'tailwind', 'primevue', etc.
  },
  toolbar: {
    type: Object,
    default: () => ({
      show: false,
      showCreateButton: false,
      showExportButton: false,
    }),
  },
  showCreateButton: {
    type: Boolean,
  },
  showActions: { type: Boolean, default: true },
  showView: { type: Boolean, default: true },
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  showPagination: { type: Boolean, default: true },
  showFilter: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true },
  actions: {
    type: Array,
    default: () => [],
  },
  actionLayout: {
    type: String,
    default: 'inline', // other: 'panel', 'custom'
  },
  showGridlines: {
    type: Boolean,
    default: false,
  },

  // UI options
  tableClass: { type: String, default: '' },
  headerClass: { type: String, default: '' },
  rowClass: { type: [String, Function], default: '' },
  striped: { type: Boolean, default: false },
  bordered: { type: Boolean, default: true },
  hover: { type: Boolean, default: true },
  responsive: { type: Boolean, default: true },
  stickyHeader: { type: Boolean, default: true },
  rowSize: {
    type: String,
    default: 'sm', // 'sm' | 'md' | 'lg'
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value),
  },

  // row selection options
  multiSelect: { type: Boolean, default: true },
  radioSelect: { type: Boolean, default: true },
  selectedRows: { type: Array, default: () => [] },
  rowCheckboxPosition: { type: String, default: 'start' }, // 'start' or 'end'

  breakExtraColumns: {
    type: Boolean,
    default: false, // false = scroll horizontally, true = row break
  },

  // Pagination options
  perPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100],
  },
  defaultPerPage: { type: Number, default: 20 },
  paginationLayout: { type: String, default: 'default' },

  // sorting options
  sortable: { type: Boolean, default: true },
  defaultSortBy: { type: String, default: '' },
  defaultSortOrder: { type: String, default: 'asc' }, // 'asc' or 'desc'

  filtering: { type: Boolean, default: true },

  // search options
  searchPlaceholder: { type: String, default: 'Search...' },
  searchDebounce: { type: Number, default: 300 },

  // export features
  enableExport: { type: Boolean, default: false },
  exportFormats: {
    type: Array,
    default: () => ['csv', 'xls', 'pdf'],
  },
  exportFileName: { type: String, default: 'omni-grid-data-export' },

  // Advanced features
  enableCustomRowSlot: { type: Boolean, default: false }, // For advanced row rendering
  draggableRows: { type: Boolean, default: false },

  noDataText: { type: String, default: 'No records found.' },
  loadingText: { type: String, default: 'Loading...' },
  columnToggles: { type: Boolean, default: false },

  expandableRows: { type: Boolean, default: false },
  expandedRowSlot: { type: Boolean, default: false },
  columnOverflowToggle: { type: Boolean, default: false },
  defaultVisibleColumns: { type: Array, default: () => [] },
})

// provide pagination config
provide('paginationConfig', props.paginationConfig)

// actions
// const actions = computed(() => {
//   const defaultActions = [
//     {
//       label: 'View',
//       key: 'view',
//       icon: ['fas', 'eye'],
//       callback: (row) => emit('view', row.id),
//       show: (row) => props.showView && row.is_deleted !== 1,
//       colorClass: 'text-primary',
//     },
//     {
//       label: 'Edit',
//       key: 'edit',
//       icon: ['fas', 'pen-to-square'],
//       callback: (row) => emit('edit', row.id),
//       show: (row) => props.showEdit && row.is_deleted !== 1,
//       colorClass: 'text-primary',
//     },
//     {
//       label: (row) => (row?.is_deleted === 1 ? 'Restore' : 'Delete'),
//       key: (row) => (row?.is_deleted === 1 ? 'restore' : 'delete'),
//       icon: (row) => (row?.is_deleted === 1 ? ['fas', 'rotate-left'] : ['fas', 'trash-can']),
//       callback: (row) => emit('delete', row.id, row?.is_deleted),
//       show: props.showDelete,
//       colorClass: (row) => (row?.is_deleted === 1 ? 'text-primary' : 'text-danger'),
//     },
//   ]

//   // Add `show` property to custom actions (if not provided, default to true)
//   const customActions = props.actions.map((action) => ({
//     ...action,
//     show: action.show !== undefined ? action.show : true, // Default to visible
//   }))

//   return [...defaultActions, ...customActions].filter((action) => action.show)
// })

const actions = computed(() => {
  const defaultActions = [
    {
      label: 'View',
      key: 'view',
      icon: ['fas', 'eye'],
      show: (row) => props.showView && row.is_deleted !== 1,
      colorClass: 'text-primary',
    },
    {
      label: 'Edit',
      key: 'edit',
      icon: ['fas', 'pen-to-square'],
      show: (row) => props.showEdit && row.is_deleted !== 1,
      colorClass: 'text-primary',
    },
    {
      label: (row) => (row?.is_deleted === 1 ? 'Restore' : 'Delete'),
      key: (row) => (row?.is_deleted === 1 ? 'restore' : 'delete'),
      icon: (row) => (row?.is_deleted === 1 ? ['fas', 'rotate-left'] : ['fas', 'trash-can']),
      show: props.showDelete,
      colorClass: (row) => (row?.is_deleted === 1 ? 'text-primary' : 'text-danger'),
    },
  ]

  // Add custom actions
  const customActions = props.actions.map((action) => ({
    ...action,
    show: action.show !== undefined ? action.show : true,
  }))

  return [...defaultActions, ...customActions].filter((action) => action.show)
})

// cutosm slot based colum format
const columnSlots = computed(() => {
  const slots = useSlots()
  return Object.keys(slots).filter((name) => name.startsWith('column-'))
})

/* emiting events */

// const onActionTriggered = (payload) => {
//   const { actionKey, row, originalCallback } = payload

//   emit('action', actionKey, row)

//   if (['view', 'edit', 'delete', 'restore'].includes(actionKey)) {
//     emit(actionKey, row)
//   }

//   if (typeof originalCallback === 'function') {
//     originalCallback(row)
//   }
// }
const onActionTriggered = (payload) => {
  const { actionKey, row } = payload

  // Emit the general action event
  emit('action', actionKey, row)

  // Emit the specific event based on actionKey
  if (['view', 'edit', 'delete', 'restore'].includes(actionKey)) {
    emit(actionKey, row)
  }
}

const searchQuery = ref('')

const onSearch = (query) => {
  searchQuery.value = query
  if (props.searchInBackend) {
    emit('search', query)
  }
}
const onPerPageChange = (newPerPage) => emit('update:perPage', newPerPage)
const onChangePage = (page) => emit('changePage', page)

const onRefresh = () => emit('refresh')
const createButton = () => emit('handleCreate')
</script>
<template>
  <!-- <div class="card p-3"> -->
  <div class="omni-grid-view">
    <!-- header -->
    <div>
      <slot name="header">
        <GridHeader
          :data="props.data"
          :toolbar="toolbar"
          :show-create-button="true"
          :show-refresh-button="true"
          :show-show-all-toggle="true"
          :show-export-button="true"
          :dropDownPerPageOptions="dropDownPerPageOptions"
          @search="onSearch"
          @update:perPage="onPerPageChange"
          @changePage="onChangePage"
          @create="createButton"
          @refresh="onRefresh"
        >
          <template #left-buttons>
            <slot name="left-buttons"></slot>
          </template>
        </GridHeader>
      </slot>
    </div>

    <!-- body -->
    <div class="mt-2">
      <slot name="body">
        <TableBody
          :columns="columns"
          :editable-columns="editableColumns"
          :data="props?.data.data"
          :loading="loading"
          :paginationData="props.data?.paginationData"
          :searchInBackend="searchInBackend"
          :searchQuery="searchQuery"
          @search="onSearch"
          @column-search="onSearch"
          @update:perPage="onPerPageChange"
          @changePage="onChangePage"
          :actions="actions"
          :action-layout="actionLayout"
          v-bind="$attrs"
          :filtering="filtering"
          :column-slots="columnSlots"
          :merged-columns="mergedColumns"
          :expandable-rows="expandableRows"
          :multi-select="multiSelect"
          :radio-select="radioSelect"
          :break-extra-columns="breakExtraColumns"
          @action-triggered="onActionTriggered"
          :row-size="rowSize"
          :striped="striped"
          :bordered="bordered"
          :hover="hover"
        >
          <!-- Dynamic column slots -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </TableBody>
      </slot>
    </div>
    <!-- end-body -->

    <!-- Expanded Row -->
    <transition name="slide-fade">
      <div v-if="expandableRows && currentExpandedRow">
        <slot name="expanded" :row="currentExpandedRow"> </slot>
      </div>
    </transition>

    <!-- footer -->
    <div class="mt-2">
      <slot name="footer">
        <div class=""></div>
      </slot>
    </div>
    <!-- end footer -->
  </div>
  <!-- </div> -->
</template>
<style scoped>
.omni-grid-view {
  width: 100%;
  position: relative;
  overflow: visible;
}
</style>
