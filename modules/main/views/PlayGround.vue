<script setup>
import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useApi } from '../../../app/omnicore/helpers/useApi'
import DataTable from '../../../app/themes/hopeui/components/organisms/DataTable.vue'
const { proxy } = getCurrentInstance()
import Demo from './StatusFormater.vue'
const username = ref('')
const password = ref('')

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

watch(data, () => {
  updateResponseData()
})

const updateResponseData = () => {
  if (data.value?.dataPayload) {
    tableData.value.data = /*[...data.value.dataPayload.data] */ Array.isArray(
      data.value.dataPayload.data,
    )
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
  }
}
// const paginationData = computed(() => tableData.value.paginationData)
// const paginationData = reactive(tableData.value.paginationData)

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
  });

  if (result.isConfirmed) {
    // Perform the delete action here
    console.log('Deleting record with ID:', id);
    
    // Show success alert
    await proxy.$showAlert({
      title: 'Deleted!',
      text: 'Record deleted successfully',
      icon: 'success',
      showCancelButton: false,
    });

    // Refresh data or update UI if needed
  } else {
    console.log('Deletion cancelled');
  }
};


const handleSearch = (query) => {
  request(null, {
    page: tableData.value.paginationData.currentPage,
    'per-page': tableData.value.paginationData.perPage,
    _search: query,
  })
}

const changePage = async (page) => {
  await request(null, { page, 'per-page': tableData.value.paginationData.perPage }).then(() => {
    updateResponseData()
  })
  console.log('Page changed to: ', data.value)
}

const updatePerPage = async (perPage) => {
  tableData.value.paginationData.perPage = perPage
  await request(null, { page: tableData.value.paginationData.currentPage, 'per-page': perPage })
  if (data?.dataPayload?.data) tableData.value = [...data.dataPayload.data]
}

onMounted(() => {
  request().then(() => {
    updateResponseData()
  })
})
</script>

<template>
  <div class="container mt-4">
    <!-- <div v-if="isLoading">Loading...</div> -->
    <!-- <div v-if="error">Error: {{ error }}</div> -->
    <!-- <div class="bg-primary rounded" v-else> -->
    <!-- <pre>{{ data }}</pre> -->
    <!-- </div> -->
    <button
      @click="
        () => {
          proxy.$showToast()
        }
      "
    >
      Refresh Data
    </button>
    <button @click="handleEdit(23)">Refresh Data</button>

    <!-- <Label labelFor="email" customClass="form-label">Email</Label>
    <Input class="form-control" placeholder="demo input" />
    <Button customClass="btn btn-primary">Submit</Button> -->

    <form @submit.prevent="submitForm">
      <input v-model="username" placeholder="Username" /><br />
      <div v-if="error" style="color: red">{{ error.username }}</div>
      <input v-model="password" type="password" placeholder="Password" /><br />
      <div v-if="error" style="color: red">{{ error.password }}</div>

      <button type="submit" :disabled="isLoading">Login</button>
    </form>

    <!-- <div v-if="isLoading">Logging in...</div> -->

    <!-- <pre v-else-if="data">Login successful: {{ data }}</pre> -->
    <div>
      <h2>Bootstrap Table</h2>
      <DataTable
        :data="tableData"
        :columns="tableColumns"
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
      />
    </div>
  </div>
</template>
