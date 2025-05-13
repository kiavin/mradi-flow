<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  column: Object,
  columnData: Array,
  menuPosition: Object,
  isActive: Boolean,
})

const emit = defineEmits(['filter', 'close'])

// const showFilter = ref(false)
const searchQuery = ref('')
const selectedValues = ref([])
const selectAll = ref(true)
const filterPanelRef = ref(null)

// Initialize with all values selected
onMounted(() => {
  if (props.isActive) {
    selectedValues.value = [...uniqueValues.value]
    document.addEventListener('click', handleOutsideClick)
  }
})

// Clean up event listener
onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})

// Watch for active state changes
watch(
  () => props.isActive,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        document.addEventListener('click', handleOutsideClick)
      })
    } else {
      document.removeEventListener('click', handleOutsideClick)
    }
  },
)

const uniqueValues = computed(() => {
  const values = new Set()
  props.columnData.forEach((row) => {
    const val = row[props.column.key]
    if (val !== undefined && val !== null) {
      values.add(val)
    }
  })
  return Array.from(values).filter((val) =>
    String(val).toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// Handle clicks outside the filter panel
const handleOutsideClick = (event) => {
  // Check if click was inside the filter panel or on a filter icon
  const clickedInsidePanel = filterPanelRef.value?.contains(event.target)
  const clickedOnFilterIcon = event.target.closest('.filter-icon-wrapper')

  if (!clickedInsidePanel && !clickedOnFilterIcon) {
    emit('close')
  }
}

const toggleSelectAll = () => {
  selectAll.value = !selectAll.value
  selectedValues.value = selectAll.value ? [...uniqueValues.value] : []
  applyFilter()
}

const toggleValue = (value) => {
  const index = selectedValues.value.indexOf(value)
  if (index === -1) {
    selectedValues.value.push(value)
  } else {
    selectedValues.value.splice(index, 1)
  }
  selectAll.value = selectedValues.value.length === uniqueValues.value.length
  applyFilter()
}

const applyFilter = () => {
  emit('filter', {
    columnKey: props.column.key,
    values: selectedValues.value,
  })
}

const clearFilters = () => {
  selectedValues.value = []
  selectAll.value = false
  applyFilter()
}
</script>

<template>
  <div class="filter-container">
    <div
      v-if="isActive"
      ref="filterPanelRef"
      class="filter-panel"
      :style="{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }"
      @click.stop
    >
      <div class="dropdown-arrow"></div>
      <div class="filter-header">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm mb-2"
          placeholder="Search values..."
        />
        <div class="select-all mb-2" @click="toggleSelectAll">
          <input type="checkbox" :checked="selectAll" class="form-check-input me-2" />
          <span>Select All</span>
        </div>
        <button class="btn btn-sm btn-link p-0" @click="clearFilters">Clear</button>
      </div>
      <div class="filter-values">
        <div
          v-for="value in uniqueValues"
          :key="value"
          class="filter-value-item"
          @click="toggleValue(value)"
        >
          <input
            type="checkbox"
            :checked="selectedValues.includes(value)"
            class="form-check-input me-2"
          />
          <span>{{ value }}</span>
        </div>
        <div v-if="uniqueValues.length === 0" class="text-muted small p-2">No matching values</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  position: fixed;
  z-index: 1050;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 12px;
  min-width: 250px;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-arrow {
  position: absolute;
  top: -6px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid white;
  filter: drop-shadow(0 -2px 1px rgba(0, 0, 0, 0.1));
}

.filter-header {
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.filter-values {
  max-height: 200px;
  overflow-y: auto;
}

.filter-value-item {
  padding: 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.filter-value-item:hover {
  background-color: #f8f9fa;
}

.select-all {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 0;
}
</style>
