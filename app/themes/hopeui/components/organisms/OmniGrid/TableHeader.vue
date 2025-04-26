<script setup>
import { computed } from 'vue'

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
  allExpanded: Boolean
})

const emit = defineEmits([
  'clear-radio-selection',
  'toggle-all',
  'toggle-sort',
  'ellipsis-click',
  'filter-click',
  'toggle-select-all',
  'start-resizing'
])

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
</script>

<template>
  <thead class="table-secondary" :class="{ 'sticky-header': layouts.stickyHeader }">
    <!-- Header Row -->
    <tr>
      <!-- Radio Select Header -->
      <th v-if="radioSelect" class="text-center align-middle" style="width: 50px">
        <font-awesome-icon
          :icon="['fas', 'circle-xmark']"
          style="cursor: pointer; font-size: 1.2rem; color: #1a1a34"
          title="Clear Selection"
          @click="$emit('clear-radio-selection')"
        />
      </th>

      <!-- Expand/Collapse All Column as a button -->
      <th v-if="expandableRows" class="text-center align-middle" style="width: 50px">
        <button
          class="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center"
          style="width: 20px; height: 20px"
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
</style>