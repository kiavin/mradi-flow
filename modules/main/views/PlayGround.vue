<script setup>
import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useApi } from '../../../app/omnicore/helpers/useApi'
import DataTable from '../../../app/themes/hopeui/components/organisms/DataTable.vue'
import TableSkeleton from '../../../app/themes/hopeui/components/molecules/TableSkeleton.vue'
import DemoForm from '../../../app/themes/hopeui/components/organisms/DemoForm.vue'
import { useModalStore } from '~/omnicore/stores/modalStore.js'
const { proxy } = getCurrentInstance()
import Demo from '../components/StatusFormater.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import OmniGridView from '../../../app/themes/hopeui/components/organisms/OmniGridView.vue'
import { BFormRow } from 'bootstrap-vue-next'

const username = ref('')
const password = ref('')

const modalStore = useModalStore()

const showModal = () => {
  modalStore.openModal(null, { message: 'Hello from Modal!' }, 'Demo Modal', 'sm', false, {
    centered: false,
    scrollable: false,
  })
}

const showModalCenter = () => {
  modalStore.openModal(null, { message: 'Hello from Modal!' }, 'Demo Modal', 'xl', false, {
    centered: true,
    scrollable: true,
    fullscreen: true,
  })
}

// const { data, request, isLoading, error } = useApi('/v1/auth/login', 'POST')
const { data, request, isLoading, error } = useApi('/v1/scheduler/appointments', 'GET', {}, false)

// const submitForm = async () => {
//   await request({ username: username.value, password: password.value })
// }
// onMounted(() => {
//   request()
// })
const tableData = ref({
  data: [],
  paginationData: {
    countOnPage: 0,
    currentPage: 1,
    perPage: 20,
    totalCount: 0,
    totalPages: 0,
    paginationLinks: {},
  },
})

const tableColumns = ref([
  { key: 'userName', label: 'Chair Person' },
  { key: 'subject', label: 'Subject' },
  { key: 'email_address', label: 'Email' },
  { key: 'contact_name', label: 'Contact Name' },
  { key: 'appointment_date', label: 'Date' },
  { key: 'mobile_number', label: 'Phone' },
  { key: 'start_time', label: 'Start Time' },
  { key: 'end_time', label: 'End Time' },
  { key: 'status', label: 'Status' },
  { key: 'relative_time', label: 'Booked since' },
])

const tableColumns2 = ref([
  { key: 'userName', label: 'Chair Person' },
  { key: 'subject', label: 'Subject' },
  { key: 'email_address', label: 'Email' },
  { key: 'contact_name', label: 'Contact Name' },
  { key: 'appointment_date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'mobile_number', label: 'Phone' },
  { key: 'department', label: 'Department' }, // New column 1
  { key: 'location', label: 'Location' }, // New column 2
  { key: 'duration', label: 'Duration (hours)' }, // New column 3
])

const data2 = ref({
  data: [
    {
      userName: 'Prof. John Doe',
      subject: 'Meeting on AI Research',
      email_address: 'john.doe@university.edu',
      contact_name: 'Jane Smith',
      appointment_date: '2025-04-20',
      mobile_number: '+1234567890',
      status: 1,
      department: 'Computer Science', // New data for column 1
      location: 'Building A, Room 101', // New data for column 2
      duration: 2, // New data for column 3
    },
    {
      userName: 'Dr. Alice Walker',
      subject: 'Review New Curriculum',
      email_address: 'alice.walker@university.edu',
      contact_name: 'Tom Hanks',
      appointment_date: '2025-04-22',
      mobile_number: '+1987654321',
      status: 2,
      department: 'Education', // New data for column 1
      location: 'Administration Building', // New data for column 2
      duration: 1.5, // New data for column 3
    },
    {
      userName: 'Mr. Sam Carter',
      subject: 'Infrastructure Proposal',
      email_address: 'sam.carter@university.edu',
      contact_name: 'Lucy Hale',
      appointment_date: '2025-04-23',
      mobile_number: '+1123456789',
      status: 1,
      department: 'Facilities Management', // New data for column 1
      location: 'Main Conference Room', // New data for column 2
      duration: 3, // New data for column 3
    },
    {
      userName: 'Dr. Emily Chen',
      subject: 'Research Funding Discussion',
      email_address: 'emily.chen@university.edu',
      contact_name: 'Robert Johnson',
      appointment_date: '2025-04-25',
      mobile_number: '+1555123456',
      status: 2,
      department: 'Biochemistry', // New data for column 1
      location: 'Science Building, Room 205', // New data for column 2
      duration: 1, // New data for column 3
    },
  ],
  paginationData: {
    countOnPage: 0,
    currentPage: 1,
    perPage: 20,
    totalCount: 0,
    totalPages: 0,
    paginationLinks: {},
  },
})
watch(data, () => {
  updateResponseData()
})
const updateResponseData = () => {
  if (data.value?.dataPayload) {
    tableData.value.data = Array.isArray(data.value.dataPayload.data)
      ? data.value.dataPayload.data
      : []
    tableData.value.paginationData = {
      countOnPage: data.value.dataPayload.countOnPage,
      currentPage: data.value.dataPayload.currentPage,
      perPage: data.value.dataPayload.perPage,
      totalCount: data.value.dataPayload.totalCount,
      totalPages: data.value.dataPayload.totalPages,
      paginationLinks: data.value.dataPayload.paginationLinks,
    }
    console.log('Updated tableData:', tableData.value)
  }
}

// Handle Actions
const handleView = (id) => {
  // alert(`Viewing record with ID: ${id}`)
  proxy.$showAlert({
    message: 'View Mode',
    type: 'info',
    showConfirmButton: true,
    confirmButtonText: 'Yes, view it!',
    cancelButtonText: 'No, stay here',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonTextColor: '#3085d6',
    cancelButtonTextColor: '#3085d6',
    reverseButtons: true,
  })
}

const handleView2 = (row) => {
  // if (!row || typeof row !== 'object') {
  //   console.warn('handleView2 called with invalid row:', row)
  //   return
  // }
  console.trace('handleView2 triggered with row:', row)
  console.log(row.subject)
  proxy.$showAlert({
    showConfirmButton: true,
    confirmButtonText: 'Yes, view it!',
    cancelButtonText: 'No, stay here',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true,
  })
}

const handleEdit = (id) => {
  // alert(`Editing record with ID: ${id}`)
  proxy.$showAlert({
    message: 'Edit Mode',
    title: 'warning',
    showConfirmButton: true,
    confirmButtonText: 'Yes, edit it!',
    cancelButtonText: 'No, stay here',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonTextColor: '#3085d6',
    cancelButtonTextColor: '#3085d6',
    reverseButtons: true,
  })
}

const handleDelete = async (id) => {
  const result = await proxy.$showAlert({
    title: 'Are you sure?',
    text: 'You won’t be able to revert this!',
    icon: 'warning',
    showConfirmButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    // Perform the delete action here
    console.log('Deleting record with ID:', id)

    // Show success alert
    await proxy.$showAlert({
      title: 'Deleted!',
      text: 'Record deleted successfully',
      icon: 'success',
      showCancelButton: false,
    })

    // Refresh data or update UI if needed
  } else {
    console.log('Deletion cancelled')
  }
}

const handleSearch = (query) => {
  request(null, {
    page: tableData.value.paginationData.currentPage,
    'per-page': tableData.value.paginationData.perPage,
    _search: query,
  })
}

const handleSearch2 = (query) => {
  request(null, {
    page: tableData.value.paginationData.currentPage,
    'per-page': tableData.value.paginationData.perPage,
    _search: query,
  })
}

const changePage = async (page) => {
  await request(null, { page, 'per-page': tableData.value.paginationData.perPage })

  updateResponseData()

  console.log('Page changed to: ', data.value)
}

const updatePerPage = async (perPage) => {
  tableData.value.paginationData.perPage = perPage
  await request(null, {
    page: tableData.value.paginationData.currentPage,
    'per-page': perPage,
  })
  updateResponseData()
}

onMounted(() => {
  request().then(() => {
    updateResponseData()
  })
})

// testing inline edting
const editableColumns = [
  // 'subject',
  {
    key: 'subject',
    onSave: async ({ row, value }) => {
      alert('Saving')
      // console.log("INLINED EDIT ROW", row)
       // write the saving logic here 
    }
  },
  {
    key: 'email_address',
    onSave: async ({ row, value }) => {
      alert('Saving')
       // write the savng logic here 
    }
  }
]

</script>

<template>
  <!-- <button class="btn btn-primary" @click="showModal">Open Modal</button><br /> -->
  <Button
    variant="primary"
    size="md"
    rounded
    pill
    type="button"
    customClass="btn btn-primary"
    @click="showModal"
  >
    <template #icon>
      <font-awesome-icon :icon="['fas', 'thumbs-up']" />

      <i class="bi bi-plus"></i>
    </template>
    modal
  </Button>
  <Button
    variant="success"
    size="md"
    rounded
    pill
    type="button"
    customClass="btn btn-primary"
    @click="showModalCenter"
  >
    <template #icon>
      <font-awesome-icon :icon="['fas', 'thumbs-up']" />
    </template>
    centered modal
  </Button>
  <!-- <div v-if="isLoading">Loading...</div> -->
  <!-- <div v-if="error">Error: {{ error }}</div> -->
  <!-- <div class="bg-primary rounded" v-else> -->
  <!-- <pre>{{ data }}</pre> -->
  <!-- </div> -->
  <!-- <button
      @click="
        () => {
          proxy.$showToast()
        }
      "
    >
      Refresh Data
    </button>
    <button @click="handleEdit(23)">Refresh Data</button> -->

  <!-- <Label labelFor="email" customClass="form-label">Email</Label>
    <Input class="form-control" placeholder="demo input" />
    <Button customClass="btn btn-primary">Submit</Button> -->

  <!-- <form @submit.prevent="submitForm">
      <input v-model="username" placeholder="Username" /><br />
      <div v-if="error" style="color: red">{{ error.username }}</div>
      <input v-model="password" type="password" placeholder="Password" /><br />
      <div v-if="error" style="color: red">{{ error.password }}</div>

      <button type="submit" :disabled="isLoading">Login</button>
    </form> -->

  <!-- <div v-if="isLoading">Logging in...</div> -->

  <!-- <pre v-else-if="data">Login successful: {{ data }}</pre> -->
  <div class="card p-1">
    <!-- <h2 class="h2">Bootstrap Table</h2> -->
    <!-- <Suspense>
      <template #default>
        <DataTable
          :data="tableData"
          :columns="tableColumns"
          :loading="isLoading"
          @edit="handleEdit"
          @search="handleSearch"
          @delete="handleDelete"
          @view="handleView"
          @changePage="changePage"
          @update:perPage="updatePerPage"
          :columnFormatters="{
            status: Demo,
          }"
          :mergedColumns="[{ keys: ['start_time', 'end_time'], label: 'Time', separator: ' - ' }]"
          :layouts="{ stickyHeader: true }"
        />
      </template>
      <template #fallback>
        <TableSkeleton />
      </template>
    </Suspense> -->
  </div>
  <div class="card p-3">
    <OmniGridView
      :columns="tableColumns"
      :editable-columns="editableColumns"
      :data="tableData"
      :loading="isLoading"
      action-layout="inline"
      :mergedColumns1="[{ keys: ['contact_name', 'mobile_number'], label: 'Test', separator: ' ' }]"
      :pagination-config="{
        variant: 'circle',
        position: 'right',
        bgColor: '#4f46e5',
        hoverBgColor: '#6366f1',
        textColor: '#374151',
        activeTextColor: '#ffffff',
        showFirstLast: true,
        showNumbers: true,
        showTotal: true,
        showRange: true,
      }"
      :toolbar="{
        show: true,
        showCreateButton: true,
      }"
      :expandable-rows="true"
      :filtering="true"
      :multi-select="false"
      :radio-select="false"
      :break-extra-columns="true"
      :search-in-backend="true"
      @view="handleView2"
      @edit="handleEdit"
      @delete="handleDelete"
      @search="handleSearch2"
      @changePage="changePage"
      @update:perPage="updatePerPage"
      @refresh="updateResponseData"
    >
      // demo slot component
      <template #left-buttons>
        <BaseButton class="btn btn-success btn-sm" @click="showModal" style="font-size: 1.2rem">
          <template #icon>
            <font-awesome-icon :icon="['fas', 'plus']" />
          </template>
          Custom Left
        </BaseButton>
      </template>
      <template #column-status="{ value }">
        <span
          :style="{ background: value === 1 ? 'green' : 'red' }"
          :class="{
            'badge-success': value === 1,
            'badge-danger': value === 2,
          }"
          class="badge"
        >
          {{ value === 1 ? 'Active' : 'Inactive' }}
        </span>
      </template>
    </OmniGridView>
  </div>
</template>
