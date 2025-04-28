<script setup>
import { ref } from 'vue'

const props = defineProps({
  menuPosition: {
    type: Object,
    required: true,
  },
  activeColumnKey: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['action', 'close'])

const showPinSubmenu = ref(false)

// const handleAction = (action) => {
//   if (action.startsWith('pin-')) {
//     showPinSubmenu.value = false
//   }
//   emit('action', action)
//   emit('close')
// }

const handleAction = (action) => {
  if (action.startsWith('pin-')) {
    showPinSubmenu.value = false;
  }
  emit('action', {
    type: action,
    columnKey: props.activeColumnKey // Include the column key
  });
  emit('close');
};

</script>
<template>
  <div
    v-if="activeColumnKey"
    class="column-dropdown"
    :style="{
      top: `${menuPosition.top}px`,
      left: `${menuPosition.left}px`,
      maxHeight: 'calc(100vh - ' + menuPosition.top + 'px)',
    }"
    @click.stop
  >
    <div class="dropdown-arrow"></div>

    <!-- Sort Asc -->
    <div class="column-dropdown-item" @click="handleAction('sort-asc')">
      Sort Ascending
      <font-awesome-icon icon="arrow-up" />
    </div>

    <!-- Sort Desc -->
    <div class="column-dropdown-item" @click="handleAction('sort-desc')">
      Sort Descending
      <font-awesome-icon icon="arrow-down" />
    </div>

    <!-- Pin Column -->
    <div
      class="column-dropdown-item has-submenu"
      @mouseenter="showPinSubmenu = true"
      @mouseleave="showPinSubmenu = false"
    >
      <div class="submenu-trigger">
        <font-awesome-icon icon="thumbtack" class="me-2" />
        Pin Column
        <font-awesome-icon
          :icon="['fas', showPinSubmenu ? 'chevron-down' : 'chevron-right']"
          class="ms-2"
        />
      </div>

      <!-- Submenu -->
      <div
        v-show="showPinSubmenu"
        class="submenu"
        @mouseenter="showPinSubmenu = true"
        @mouseleave="showPinSubmenu = false"
      >
        <div class="column-dropdown-item" @click="handleAction('pin-none')">No Pin</div>
        <div class="column-dropdown-item" @click="handleAction('pin-left')">Pin Left</div>
        <div class="column-dropdown-item" @click="handleAction('pin-right')">Pin Right</div>
      </div>
    </div>

    <hr class="my-1" />

    <!-- Auto Size -->
    <div class="column-dropdown-item" @click="handleAction('auto-size-this')">
      Auto-size This Column
    </div>
    <div class="column-dropdown-item" @click="handleAction('auto-size-all')">
      Auto-size All Columns
    </div>

    <hr class="my-1" />

    <!-- Reset -->
    <div class="column-dropdown-item" @click="handleAction('reset')">Reset Columns</div>
  </div>
</template>
<style scoped>
.column-dropdown {
  position: fixed;
  z-index: 1050;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  padding: 0.5rem 0;
  border-radius: 4px;
  font-size: 14px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  /* margin-top: 4px; */
}
.column-dropdown-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}

.column-dropdown-item:hover {
  background-color: #f5f5f5;
}

.submenu {
  position: absolute;
  top: 0;
  left: 100%;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  border-radius: 4px;
  z-index: 1051;
  margin-left: 2px;
  max-height: 300px;
  overflow-y: auto;
}

.column-dropdown {
  overflow: visible !important;
}

.has-submenu {
  position: relative;
}

.ellipsis-wrapper {
  position: relative;
  z-index: 1;
}

.dropdown-arrow {
  position: absolute;
  top: -6px;
  left: var(--arrow-left, 20px);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid white;
  filter: drop-shadow(0 -2px 1px rgba(0, 0, 0, 0.1));
  z-index: 1051;
}
</style>
