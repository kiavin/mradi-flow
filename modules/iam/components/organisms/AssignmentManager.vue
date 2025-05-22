<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAlertStore } from '~/omnicore/stores/alert'
import { useModalStore } from '~/omnicore/stores/modalStore'

const alertStore = useAlertStore()
const modalStore = useModalStore()

const props = defineProps({
  entity: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
    validator: (config) => {
      return [
        'title',
        'availableTitle',
        'assignedTitle',
        'keyField',
        'displayField',
        'getAllEndpoint',
        'getAssignedEndpoint',
        'assignEndpoint',
        'removeEndpoint',
      ].every((key) => key in config)
    },
  },
  isLoading: Boolean,
  error: Object,
})

const emit = defineEmits(['close', 'refresh'])

// Reactive state
const allItems = ref([])
const assignedItems = ref([])
const selectedAvailableItems = ref([])
const selectedAssignedItems = ref([])
const availableItemsSearch = ref('')
const assignedItemsSearch = ref('')
const isMobile = ref(window.innerWidth < 768)

// Update mobile view on resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  fetchData()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Computed properties
const availableItems = computed(() => {
  return allItems.value.filter(
    (item) =>
      !assignedItems.value.some(
        (assigned) => assigned[props.config.keyField] === item[props.config.keyField]
      )
  )
})

const filteredAvailableItems = computed(() => {
  const searchTerm = availableItemsSearch.value.toLowerCase()
  return availableItems.value.filter(
    (item) =>
      item[props.config.displayField].toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
  )
})

const filteredAssignedItems = computed(() => {
  const searchTerm = assignedItemsSearch.value.toLowerCase()
  return assignedItems.value.filter(
    (item) =>
      item[props.config.displayField].toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
  )
})

const hasAvailableSelection = computed(() => selectedAvailableItems.value.length > 0)
const hasAssignedSelection = computed(() => selectedAssignedItems.value.length > 0)
const hasAvailableItems = computed(() => availableItems.value.length > 0)
const hasAssignedItems = computed(() => assignedItems.value.length > 0)

// Methods
const fetchData = async () => {
  try {
    // Fetch all available items
    const { data: allItemsData, request: fetchAllItems } = useApi(
      props.config.getAllEndpoint,
      'GET'
    )
    await fetchAllItems()
    allItems.value = allItemsData.value?.dataPayload?.data || []

    // Fetch currently assigned items
    const endpoint =
      typeof props.config.getAssignedEndpoint === 'function'
        ? props.config.getAssignedEndpoint(props.entity)
        : props.config.getAssignedEndpoint

    const { data: assignedItemsData, request: fetchAssignedItems } = useApi(endpoint, 'GET')
    await fetchAssignedItems()
    assignedItems.value = assignedItemsData.value?.dataPayload?.data || []
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const isSelected = (item, type) => {
  const selectedArray =
    type === 'available' ? selectedAvailableItems.value : selectedAssignedItems.value
  return selectedArray.some((i) => i[props.config.keyField] === item[props.config.keyField])
}

const toggleSelection = (item, type, event = null) => {
  event?.stopPropagation()
  event?.preventDefault()

  const selectedArray = type === 'available' ? selectedAvailableItems : selectedAssignedItems
  const keyField = props.config.keyField
  console.log('KEYS', props.config.keyField)

  const index = selectedArray.value.findIndex((i) => i[keyField] === item[keyField])

  if (index === -1) {
    selectedArray.value.push({
      ...item,
      [keyField]: item[keyField],
    })
  } else {
    selectedArray.value.splice(index, 1)
  }
}

const isProcessing = ref(false)

const updateBackend = async (url, payload) => {
  isProcessing.value = true
  try {
    const { data, request } = useApi(url, 'POST')
    await request(payload)
    alertStore.show(data?.value)
    emit('refresh')
  } catch (error) {
    console.error('Error updating assignments:', error)
  } finally {
    isProcessing.value = false
  }
}

const dataPayload = props.config.title

const assignSelected = async () => {
  if (selectedAvailableItems.value.length === 0) return

  // Validate items have the key field
  const validItems = selectedAvailableItems.value.filter((item) => props.config.keyField in item)

  if (validItems.length !== selectedAvailableItems.value.length) {
    console.error(
      'Some items are missing the key field:',
      selectedAvailableItems.value.filter((item) => !(props.config.keyField in item))
    )
  }

  const payload = {
    [dataPayload]: validItems.map((item) => item[props.config.keyField]),
  }

  assignedItems.value = [...assignedItems.value, ...validItems]
  selectedAvailableItems.value = []
  await updateBackend(props.config.assignEndpoint, payload)
}

const assignAll = async () => {
  const payload = {
    [dataPayload]: availableItems.value.map((item) => item[props.config.keyField]),
  }
  assignedItems.value = [...assignedItems.value, ...availableItems.value]
  await updateBackend(props.config.assignEndpoint, payload)
}

const removeSelected = async () => {
  if (selectedAssignedItems.value.length === 0) return

  const payload = {
    [dataPayload]: selectedAssignedItems.value.map((item) => item[props.config.keyField]),
  }
  assignedItems.value = assignedItems.value.filter(
    (item) =>
      !selectedAssignedItems.value.some(
        (i) => i[props.config.keyField] === item[props.config.keyField]
      )
  )
  selectedAssignedItems.value = []
  await updateBackend(props.config.removeEndpoint, payload)
}

const removeAll = async () => {
  const payload = {
    dataPayload: assignedItems.value.map((item) => item[props.config.keyField]),
  }
  assignedItems.value = []
  await updateBackend(props.config.removeEndpoint, payload)
}

const closeModal = () => {
  modalStore.closeModal
}
</script>

<template>
  <div class="container-fluid p-3">
    <!-- Mobile View -->
    <div v-if="isMobile" class="d-flex flex-column gap-3">
      <!-- Available Items Card -->
      <div class="card shadow-sm">
        <div class="card-header bg-light">
          <h5 class="mb-0">Available {{ config.availableTitle }}</h5>
        </div>
        <div class="card-body p-2">
          <div class="input-group mb-3">
            <span class="input-group-text">
              <font-awesome-icon :icon="['fas', 'search']" />
            </span>
            <input
              v-model="availableItemsSearch"
              type="text"
              class="form-control"
              :placeholder="`Search ${config.availableTitle.toLowerCase()}...`"
            />
          </div>
          <div class="list-group overflow-auto" style="max-height: 40vh">
            <div v-if="!hasAvailableItems" class="list-group-item list-group-item-action">
              No {{ config.availableTitle }} available.
            </div>
            <div
              v-for="item in filteredAvailableItems"
              :key="item[config.keyField]"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
              :class="{ active: isSelected(item, 'available') }"
              @click="(event) => toggleSelection(item, 'available', event)"
            >
              <div>
                <div class="fw-bold">{{ item[config.displayField] }}</div>
                <small v-if="item.description" class="text-muted">{{ item.description }}</small>
              </div>
              <span v-if="isSelected(item, 'available')" class="badge bg-primary rounded-pill">
                <font-awesome-icon :icon="['fas', 'check']" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-grid gap-2 d-md-flex justify-content-center">
        <button @click="assignSelected" class="btn btn-primary" :disabled="!hasAvailableSelection">
          <font-awesome-icon :icon="['fas', 'arrow-down']" class="me-1" />
          Assign Selected
        </button>
        <button @click="assignAll" class="btn btn-outline-primary" :disabled="!hasAvailableItems">
          <font-awesome-icon :icon="['fas', 'angles-down']" class="me-1" />
          Assign All
        </button>
      </div>

      <!-- Assigned Items Card -->
      <div class="card shadow-sm">
        <div class="card-header bg-light">
          <h5 class="mb-0">Assigned {{ config.assignedTitle }}</h5>
        </div>
        <div class="card-body p-2">
          <div class="input-group mb-3">
            <span class="input-group-text">
              <font-awesome-icon :icon="['fas', 'search']" />
            </span>
            <input
              v-model="assignedItemsSearch"
              type="text"
              class="form-control"
              :placeholder="`Search assigned ${config.assignedTitle.toLowerCase()}...`"
            />
          </div>
          <div class="list-group overflow-auto" style="max-height: 40vh">
            <div v-if="!hasAssignedItems" class="list-group-item list-group-item-action">
              No {{ config.assignedTitle }} assigned.
            </div>
            <div
              v-for="item in filteredAssignedItems"
              :key="item[config.keyField]"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
              :class="{ active: isSelected(item, 'assigned') }"
              @click="(event) => toggleSelection(item, 'assigned', event)"
            >
              <div>
                <div class="fw-bold">{{ item[config.displayField] }}</div>
                <small v-if="item.description" class="text-muted">{{ item.description }}</small>
              </div>
              <span v-if="isSelected(item, 'assigned')" class="badge bg-primary rounded-pill">
                <font-awesome-icon :icon="['fas', 'check']" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-grid gap-2 d-md-flex justify-content-center">
        <button @click="removeSelected" class="btn btn-danger" :disabled="!hasAssignedSelection">
          <font-awesome-icon :icon="['fas', 'arrow-up']" class="me-1" />
          Remove Selected
        </button>
        <button @click="removeAll" class="btn btn-outline-danger" :disabled="!hasAssignedItems">
          <font-awesome-icon :icon="['fas', 'angles-up']" class="me-1" />
          Remove All
        </button>
      </div>

      <!-- Footer -->
      <div class="d-grid gap-2 d-md-flex justify-content-end mt-2">
        <button @click="closeModal" class="btn btn-outline-secondary">Cancel</button>
      </div>
    </div>

    <!-- Desktop View -->
    <div v-else class="row">
      <!-- Available Items -->
      <div class="col-lg-5 col-xl-5">
        <div class="card shadow-sm h-100">
          <div
            class="card-header bg-light d-flex align-items-center justify-content-center py-3 border-top rounded-top"
          >
            <h5 class="mb-0">Available {{ config.availableTitle }}</h5>
          </div>
          <div class="card-body d-flex flex-column p-0">
            <div class="input-group mb-3 px-3 pt-3">
              <span class="input-group-text">
                <font-awesome-icon :icon="['fas', 'search']" />
              </span>
              <input
                v-model="availableItemsSearch"
                type="text"
                class="form-control"
                :placeholder="`Search ${config.availableTitle.toLowerCase()}...`"
              />
            </div>
            <div class="list-group overflow-auto" style="max-height: 60vh; min-height: 200px">
              <div v-if="!hasAvailableItems" class="list-group-item list-group-item-action">
                No {{ config.availableTitle }} available.
              </div>
              <div
                v-for="item in filteredAvailableItems"
                :key="item[config.keyField]"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                :class="{ active: isSelected(item, 'available') }"
                @click="toggleSelection(item, 'available', $event)"
              >
                <div>
                  <!-- <div class="fw-bold">{{ item[config.displayField] }}</div> -->
                  <small v-if="item.description" class="fw-bold">{{ item.description }}</small>
                </div>
                <span v-if="isSelected(item, 'available')" class="badge bg-primary rounded-pill">
                  <font-awesome-icon :icon="['fas', 'check']" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="col-lg-2 col-xl-2 d-flex flex-column justify-content-center px-0">
        <div class="d-grid gap-2 mx-auto" style="width: fit-content">
          <button
            @click="assignSelected"
            class="btn btn-success p-2"
            :disabled="!hasAvailableSelection"
            title="Assign Selected"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" />
          </button>
          <button
            @click="assignAll"
            class="btn btn-outline-success p-2"
            title="Assign All"
            :disabled="!hasAvailableItems"
          >
            <font-awesome-icon :icon="['fas', 'angles-right']" size="lg" />
          </button>
          <div class="my-2 border-bottom"></div>
          <button
            @click="removeSelected"
            class="btn btn-danger p-2"
            :disabled="!hasAssignedSelection"
            title="Remove Selected"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" size="lg" />
          </button>
          <button
            @click="removeAll"
            class="btn btn-outline-danger p-2"
            title="Remove All"
            :disabled="!hasAssignedItems"
          >
            <font-awesome-icon :icon="['fas', 'angles-left']" size="lg" />
          </button>
        </div>
      </div>

      <!-- Assigned Items -->
      <div class="col-lg-5 col-xl-5">
        <div class="card shadow-sm h-100">
          <div
            class="card-header bg-light d-flex align-items-center justify-content-center py-3 border-top rounded-top"
          >
            <h5 class="mb-0">Assigned {{ config.assignedTitle }}</h5>
          </div>
          <div class="card-body d-flex flex-column p-0">
            <div class="input-group mb-3 px-3 pt-3">
              <span class="input-group-text">
                <font-awesome-icon :icon="['fas', 'search']" />
              </span>
              <input
                v-model="assignedItemsSearch"
                type="text"
                class="form-control"
                :placeholder="`Search assigned ${config.assignedTitle.toLowerCase()}...`"
              />
            </div>
            <div class="list-group overflow-auto" style="max-height: 60vh; min-height: 200px">
              <div v-if="!hasAssignedItems" class="list-group-item list-group-item-action">
                No {{ config.assignedTitle }} assigned.
              </div>
              <div
                v-for="item in filteredAssignedItems"
                :key="item[config.keyField]"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                :class="{ active: isSelected(item, 'assigned') }"
                @click="(event) => toggleSelection(item, 'assigned', event)"
              >
                <div>
                  <!-- <div class="fw-bold">{{ item[config.displayField] }}</div> -->
                  <small v-if="item.description" class="fw-bold">{{ item.description }}</small>
                </div>
                <span v-if="isSelected(item, 'assigned')" class="badge bg-primary rounded-pill">
                  <font-awesome-icon :icon="['fas', 'check']" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer - Full width and right-aligned -->
      <!-- <div class="col-12">
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button @click="modalStore.closeModal" class="btn btn-outline-secondary">Cancel</button>
        </div>
      </div> -->
    </div>
  </div>

  <!-- Loading Overlay -->
  <div v-if="isProcessing" class="loading-overlay d-flex align-items-center justify-content-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
/* Custom enhancements */
.list-group-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.list-group-item:hover:not(.active) {
  background-color: #f8f9fa;
}

.list-group-item.active {
  background-color: #e3f2fd;
  border-color: #bbdefb;
  color: #0d6efd;
}

.card {
  border-radius: 0.5rem;
}

.btn {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .card-body {
    padding: 0.5rem;
  }
}

/* Desktop Enhancements */
@media (min-width: 768px) {
  .col-md-5 {
    width: 38%; /* Slightly wider */
  }

  .col-md-2 {
    width: 24%; /* Width for action buttons */
  }

  .card {
    display: flex; /* Use flexbox for equal height */
    flex-direction: column;
  }

  .card-body {
    flex-grow: 1; /* Allow body to take up available space */
    display: flex;
    flex-direction: column;
  }

  .list-group {
    height: 100%;
  }

  .d-flex > .btn {
    width: 100%;
  }
}
.list-group-item > * {
  pointer-events: none;
}

/* Custom scrollbar styling */
.list-group {
  scrollbar-width: thin;
  scrollbar-color: #adb5bd #f8f9fa;
}

.list-group::-webkit-scrollbar {
  width: 8px;
}

.list-group::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.list-group::-webkit-scrollbar-thumb {
  background-color: #adb5bd;
  border-radius: 10px;
  border: 2px solid #f8f9fa;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1050;
  backdrop-filter: blur(1px);
}

.loading-overlay .spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>