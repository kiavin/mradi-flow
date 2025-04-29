<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  column: Object,
  value: [String, Number],
  position: Object, // { top, left, width, height }
  row: Object,
})

const emit = defineEmits(['save', 'cancel'])

const editedValue = ref(props.value)
const error = ref(null)
const isLoading = ref(false)

const panelStyle = computed(() => ({
  position: 'fixed',
  top: `${props.position.top + props.position.height}px`, // Position below the cell
  left: `${props.position.left}px`, // Align with cell left edge
  zIndex: 10000,
  marginTop: '5px', // Small gap from the cell
}))

const save = async () => {
  error.value = null
  isLoading.value = true

  try {
    if (props.column.onSave) {
      const result = await props.column.onSave({
        row: props.row,
        value: editedValue.value,
      })

      if (result?.error) {
        error.value = result.error
        return
      }
    }

    // Emit to parent in case they want to handle the save
    emit('save', {
      value: editedValue.value,
      row: props.row,
    })
  } catch (e) {
    error.value = e.message || 'Failed to save'
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  emit('cancel')
}

// Handle keyboard events
const handleKeydown = (e) => {
  if (e.key === 'Enter' && !isLoading.value) {
    save()
  } else if (e.key === 'Escape') {
    cancel()
  }
}

// Focus input on mount
onMounted(() => {
  const input = document.querySelector('.edit-panel input')
  if (input) input.focus()
})
</script>

<template>
  <div class="edit-panel" :style="panelStyle" @keydown="handleKeydown">
    <div class="edit-panel-arrow"></div>
    <div class="edit-panel-header">
      <font-awesome-icon :icon="['fas', 'pen-to-square']" class="me-2" />
      <span>{{ column.label }}</span>
    </div>
    <div class="edit-panel-body">
      <input
        v-model="editedValue"
        type="text"
        class="form-control form-control-sm"
        @keyup.enter="save"
        ref="inputField"
        autofocus
      />
      <div v-if="error" class="text-danger small mt-1">{{ error }}</div>
    </div>
    <div class="edit-panel-footer">
      <div v-if="isLoading" class="me-auto">
        <span class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </span>
        <span class="ms-1 small">Saving...</span>
      </div>
      <button class="btn btn-sm btn-success" @click="save">
        <font-awesome-icon :icon="['fas', 'check']" />
      </button>
      <button class="btn btn-sm btn-outline-secondary ms-2" @click="cancel">
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.edit-panel {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  width: 250px;
  padding: 10px;
}

.edit-panel-arrow {
  position: absolute;
  left: 15px;
  top: -10px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #ddd;
}

.edit-panel-arrow::after {
  content: '';
  position: absolute;
  left: -9px;
  top: 1px;
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-bottom: 9px solid white;
}

.edit-panel-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  font-weight: 500;
}

.edit-panel-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #eee;
}
</style>
