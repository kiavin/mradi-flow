<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome' // Make sure this is correctly set up

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
        'availableTitle',
        'assignedTitle',
        'keyField',
        'displayField',
        'getAllEndpoint',
        'getAssignedEndpoint',
        'updateEndpoint',
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
  const selectedArray = type === 'available' ? selectedAvailableItems : selectedAssignedItems
  return selectedArray.value.some((i) => i[props.config.keyField] === item[props.config.keyField])
}

const toggleSelection = (item, type) => {
  const selectedArray = type === 'available' ? selectedAvailableItems : selectedAssignedItems
  const index = selectedArray.value.findIndex(
    (i) => i[props.config.keyField] === item[props.config.keyField]
  )

  if (index === -1) {
    selectedArray.value.push(item)
  } else {
    selectedArray.value.splice(index, 1)
  }
}

const assignSelected = () => {
  assignedItems.value = [...assignedItems.value, ...selectedAvailableItems.value]
  selectedAvailableItems.value = []
}

const assignAll = () => {
  assignedItems.value = [...assignedItems.value, ...availableItems.value]
  availableItems.value = []
}

const removeSelected = () => {
  assignedItems.value = assignedItems.value.filter(
    (item) =>
      !selectedAssignedItems.value.some(
        (i) => i[props.config.keyField] === item[props.config.keyField]
      )
  )
  selectedAssignedItems.value = []
}

const removeAll = () => {
  assignedItems.value = []
}

const saveAssignments = async () => {
  try {
    const { request } = useApi(props.config.updateEndpoint, 'POST')
    const payload = {
      [props.config.keyField + 's']: assignedItems.value.map((item) => item[props.config.keyField]),
    }
    await request(payload)

    emit('refresh')
    closeModal()
  } catch (error) {
    console.error('Error saving assignments:', error)
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="container-fluid p-3">
    <div v-if="isMobile" class="d-flex flex-column gap-3">
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
              @click="toggleSelection(item, 'available')"
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

      <div class="d-grid gap-2 d-md-flex justify-content-center">
        <button @click="assignSelected" class="btn btn-primary" :disabled="!hasAvailableSelection">
          <font-awesome-icon :icon="['fas', 'arrow-down']" class="me-1" />
          Assign
        </button>
        <button @click="assignAll" class="btn btn-outline-primary" :disabled="!hasAvailableItems">
          <font-awesome-icon :icon="['fas', 'angles-down']" class="me-1" />
          Assign All
        </button>
      </div>

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
              @click="toggleSelection(item, 'assigned')"
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

      <div class="d-grid gap-2 d-md-flex justify-content-center">
        <button @click="removeSelected" class="btn btn-danger" :disabled="!hasAssignedSelection">
          <font-awesome-icon :icon="['fas', 'arrow-up']" class="me-1" />
          Remove
        </button>
        <button @click="removeAll" class="btn btn-outline-danger" :disabled="!hasAssignedItems">
          <font-awesome-icon :icon="['fas', 'angles-up']" class="me-1" />
          Remove All
        </button>
      </div>

      <div class="d-grid gap-2 d-md-flex justify-content-end mt-2">
        <button @click="closeModal" class="btn btn-outline-secondary">Cancel</button>
        <button @click="saveAssignments" class="btn btn-success">Save Changes</button>
      </div>
    </div>

    <div v-else class="row">
      <div class="ol-lg-5 col-xl-5">
        <div class="card shadow-sm h-100" style="height: 100%">
          <div
            class="card-header bg-light d-flex align-items-center justify-content-center py-3 border-top rounded-top"
          >
            <h5 class="mb-0">Available {{ config.availableTitle }}</h5>
          </div>
          <div class="card-body d-flex flex-column" style="height: calc(100% - 2.5rem)">
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
            <div class="list-group overflow-auto flex-grow-1">
              <div v-if="!hasAvailableItems" class="list-group-item list-group-item-action">
                No {{ config.availableTitle }} available.
              </div>
              <div
                v-for="item in filteredAvailableItems"
                :key="item[config.keyField]"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                :class="{ active: isSelected(item, 'available') }"
                @click="toggleSelection(item, 'available')"
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
      </div>

      <div class="ol-lg-2 col-xl-2 d-flex flex-column justify-content-center px-0">
        <div class="d-grid gap-2 mx-auto" style="width: fit-content">
          <button
            @click="assignSelected"
            class="btn btn-success p-2"
            :disabled="!hasAvailableSelection"
            title="Assign Selected"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right']" class="" size="lg" />
          </button>
          <button
            @click="assignAll"
            class="btn btn-outline-success p-2"
            title="Assign All"
            :disabled="!hasAvailableItems"
          >
            <font-awesome-icon :icon="['fas', 'angles-right']" class="" size="lg" />
          </button>
          <div class="my-2 border-bottom"></div>
          <button
            @click="removeSelected"
            class="btn btn-danger p-2"
            :disabled="!hasAssignedSelection"
            title="Remove Selected"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" class="" size="lg" />
          </button>
          <button
            @click="removeAll"
            class="btn btn-outline-danger p-2"
            title="Remove All"
            :disabled="!hasAssignedItems"
          >
            <font-awesome-icon :icon="['fas', 'angles-left']" class="" size="lg" />
          </button>
        </div>
      </div>

      <div class="col-lg-5 col-xl-5">
        <div class="card shadow-sm h-100" style="height: 100%">
          <div
            class="card-header bg-light d-flex align-items-center justify-content-center py-3 border-top rounded-top"
          >
            <h5 class="mb-0">Assigned {{ config.assignedTitle }}</h5>
          </div>
          <div class="card-body d-flex flex-column" style="height: calc(100% - 2.5rem)">
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
            <div class="list-group overflow-auto flex-grow-1">
              <div v-if="!hasAssignedItems" class="list-group-item list-group-item-action">
                No {{ config.assignedTitle }} assigned.
              </div>
              <div
                v-for="item in filteredAssignedItems"
                :key="item[config.keyField]"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                :class="{ active: isSelected(item, 'assigned') }"
                @click="toggleSelection(item, 'assigned')"
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
      </div>

      <div class="col-12">
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button @click="closeModal" class="btn btn-outline-secondary">Cancel</button>
          <button @click="saveAssignments" class="btn btn-success">Save Changes</button>
        </div>
      </div>
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
</style>
