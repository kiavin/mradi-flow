<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faInfoCircle,
  faEdit,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons'

// Define props
const props = defineProps({
  title: {
    type: String,
    default: 'Detail View',
  },
  subtitle: {
    type: String,
    default: '',
  },
  sections: {
    type: Array,
    default: () => [],
  },
  actions: {
    type: Array,
    default: () => [],
  },
  theme: {
    type: String,
    default: 'light', // 'light' or 'dark'
  },
})

// State for collapsible sections
const openSections = ref([])

// Toggle section visibility
const toggleSection = (index) => {
  if (openSections.value.includes(index)) {
    openSections.value = openSections.value.filter((i) => i !== index)
  } else {
    openSections.value.push(index)
  }
}

// Check if a section is open
const isSectionOpen = (index) => openSections.value.includes(index)

// Get icon for a field
const getFieldIcon = (field) => {
  const icons = {
    Name: faUser,
    Email: faEnvelope,
    Phone: faPhone,
    Address: faMapMarkerAlt,
    Status: faInfoCircle,
  }
  return icons[field] || faInfoCircle
}
</script>
<template>
  <div :class="['detail-view', theme]">
    <!-- Header Section -->
    <div class="detail-header">
      <h3 class="detail-title">{{ title }}</h3>
      <p v-if="subtitle" class="detail-subtitle">{{ subtitle }}</p>
    </div>

    <!-- Collapsible Sections -->
    <div v-for="(section, index) in sections" :key="index" class="detail-section">
      <div class="section-header" @click="toggleSection(index)">
        <span class="section-title">{{ section.title }}</span>
        <font-awesome-icon
          :icon="isSectionOpen(index) ? 'chevron-up' : 'chevron-down'"
          class="section-icon"
        />
      </div>
      <div v-if="isSectionOpen(index)" class="section-content">
        <div v-for="(value, key) in section.fields" :key="key" class="detail-item">
          <font-awesome-icon :icon="getFieldIcon(key)" class="field-icon" />
          <span class="field-label">{{ key }}:</span>
          <span class="field-value">{{ value }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="actions.length" class="detail-actions">
      <button
        v-for="(action, i) in actions"
        :key="i"
        :class="['btn', `btn-${action.type}`]"
        @click="action.handler"
      >
        <font-awesome-icon :icon="action.icon" class="action-icon" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.detail-view {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.detail-view.dark {
  background-color: #333;
  color: #fff;
  border-color: #444;
}

.detail-header {
  margin-bottom: 20px;
}

.detail-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0;
}

.detail-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.detail-section {
  margin-bottom: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  cursor: pointer;
}

.section-header:hover {
  background-color: #f1f1f1;
}

.section-title {
  font-weight: bold;
}

.section-icon {
  transition: transform 0.2s;
}

.section-content {
  padding: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.field-icon {
  width: 16px;
  color: #666;
}

.field-label {
  font-weight: bold;
  color: #333;
}

.field-value {
  color: #555;
}

.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn:hover {
  opacity: 0.9;
}

.action-icon {
  width: 16px;
}
</style>
