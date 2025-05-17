<script setup>
import { onMounted, ref, watch, getCurrentInstance, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import { useModalStore } from '~/omnicore/stores/modalStore.js'
import Form from './form.vue'
import AssignmentManager from '@/iam/components/organisms/AssignmentManager.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()

const modalStore = useModalStore()

const apiBaseUrl = `/v1/iam/rbac/groups`

const { data, request, refresh, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, false)

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

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'ruleName', label: 'RuleName' },
]

watch(data, () => {
  updateResponseData()
})
const updateResponseData = () => {
  // console.log("NEW DATA ON PAGINATION", data.value)
  if (data.value?.dataPayload) {
    // Transform the object data into an array if needed
    const responseData = data.value.dataPayload.data
    let formattedData = []

    if (typeof responseData === 'object' && !Array.isArray(responseData)) {
      formattedData = Object.values(responseData)
    } else if (Array.isArray(responseData)) {
      formattedData = responseData
    }

    tableData.value = {
      data: formattedData,
      paginationData: {
        countOnPage: data.value.dataPayload.countOnPage || 0,
        currentPage: data.value.dataPayload.currentPage || 1,
        perPage: data.value.dataPayload.perPage || tableData.value.paginationData.perPage,
        totalCount: data.value.dataPayload.totalCount || 0,
        totalPages: data.value.dataPayload.totalPages || 0,
        paginationLinks: data.value.dataPayload.paginationLinks || {},
      },
    }
    // console.log('Updated tableData:', JSON.parse(JSON.stringify(tableData.value)))
  }
}

const handleView = async (row) => {
  const id = row.name
  modalStore.toggleModalUsage(true) // if you want to navigate to route set to false

  await nextTick() // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: 'iam/groups/view', params: { id } })
    return
  }

  const apiBaseUrl = `/v1/iam/rbac/group/${id}`

  const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, true)

  await request()

  modalStore.openModal(
    Form,
    {
      formData: data.value?.dataPayload?.data || {},
      error,
      isLoading,
      readonly: true,
      hideSubmit: true,
    },
    'View Groups'
  )
}

//const handleEdit = (id) => {
//   router.push({ name: 'iam/groups/update', params: { id } });
//}

const errors = ref({})

const handleEdit = async (row) => {
  const id = row.name
  errors.value = {}

  modalStore.toggleModalUsage(true) // if you want to navigate to route set to false

  await nextTick() // ensure store state is updated

  if (!modalStore.useModal) {
    // Navigate to the update page
    router.push({ name: 'iam/groups/update', params: { id } })
    return
  }

  // Fetch appointment data before opening the modal
  const apiBaseUrl = `/v1/iam/rbac/group/${id}`

  const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, true)

  await request() // Fetch data before opening modal

  // Function to handle form submission (Update API Call)
  const handleSubmit = async (updatedData) => {
    const { request: updateData, error } = useApi(apiBaseUrl, 'PUT')
    await updateData(updatedData)
    if (error.value) {
      console.log('Error', error.value)
      errors.value = error.value // Assign the error object to errors
      return // Stop execution if error occurs
    }

    // Close modal on success
    modalStore.closeModal()

    // Show success message
    proxy.$showAlert({
      title: 'Success',
      icon: 'success',
      text: 'Group Updated successfully',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })

    refresh()
  }

  // Open modal with Form component
  modalStore.openModal(
    Form,
    {
      formData: data.value?.dataPayload?.data || {},
      error: errors,
      isLoading,
      readonly: false, // Allow editing
      hideSubmit: false,
      onSubmit: handleSubmit, // Pass the submission function
    },
    'Edit Groups'
  )
}

const handleCreate = async () => {
  errors.value = {}
  modalStore.toggleModalUsage(true)

  await nextTick() // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: 'iam/groups/create' })
    return
  }

  // Define form submission handler
  const handleSubmit = async (newData) => {
    const apiBaseUrl = `/v1/iam/rbac/group`

    const { request: createData, error } = useApi(apiBaseUrl, 'POST')

    await createData(newData)

    if (error.value) {
      console.log('Error', error.value)
      errors.value = error.value // Assign errors to be passed to the form
      return
    }

    // Close modal and show success message
    modalStore.closeModal()

    proxy.$showAlert({
      title: 'Success',
      icon: 'success',
      text: 'Groups Created successfully',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })

    refresh()
  }

  // Open modal with Form component
  modalStore.openModal(
    Form,
    {
      formData: {}, // Empty form for creation
      error: errors, // Empty error object
      isLoading: false,
      readonly: false, // Allow input
      hideSubmit: false,
      onSubmit: handleSubmit, // Pass submission function
    },
    'Create Groups'
  )
}

const handleDelete = async (row) => {
  const id = row.name
  const is_deleted = row.is_deleted
  const action = is_deleted ? 'Restore' : 'Delete'

  const confirmationText = is_deleted
    ? 'You are about to restore this record. Do you want to proceed?'
    : 'You are about to delete this record. Do you want to proceed?'

  const result = await proxy.$showAlert({
    title: 'Are you sure?',
    text: confirmationText,
    icon: 'warning',
    showConfirmButton: true,
    confirmButtonText: `Yes, ${action} it!`,
    cancelButtonText: 'No, cancel!',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    reverseButtons: true,
  })

  if (result.isConfirmed) {
    try {
      // console.log('Deleting record with ID:', id)

      // autoFetch.value = false
      const { data, request, isLoading } = useApi(`/v1/iam/rbac/group/${id}`, 'DELETE')

      await request()

      if (data.value) {
        await proxy.$showAlert({
          title: `${action}d!`,
          text: data.value?.toastPayload?.toastMessage || 'Record deleted successfully',
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
        })
      }
    } catch (err) {
      console.error('Error deleting record:', error)
      await proxy.$showAlert({
        title: 'Error!',
        text: `Error deleting record: ${error.value}`,
        icon: 'error',
        showCancelButton: false,
      })
    } finally {
      await refresh()
    }
  } else {
    console.log('Deletion cancelled')
  }
  // await refresh()
}

const handleSearch = (query) => {
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

const manageRolePermissions = (group) => {
  modalStore.openModal(
    AssignmentManager,
    {
      entity: group,
      config: {
        availableTitle: 'Roles',
        assignedTitle: 'Roles',
        keyField: 'name',
        displayField: 'name',
        getAllEndpoint: '/v1/iam/rbac/roles',
        getAssignedEndpoint: `/v1/iam/rbac/group/assign/${group.name}`,
        updateEndpoint: `/v1/iam/rbac/group/assign/${group.name}`,
      },
    },
    `Manage Roles for ${group.name}`,
    'xl',
    false,
    {
      centered: false,
      scrollable: true,
    }
  )
}
// cutsom actions
const customActions = [
  {
    key: 'manage-group',
    label: 'Manage Group',
    icon: ['fas', 'user-group'],
    callback: (row) => manageRolePermissions(row),
    show: true,
    colorClass: 'text-secondary ',
  },
]

// Assignment Manager
</script>
<template>
  <div class="card p-3">
    <div class="row d-flex justify-content-between align-items-center mb-3">
      <div class="col-auto">
        <h1 class="h4 mt-2">List of Groups</h1>
      </div>
      <div class="col-auto mb-4">
        <Button type="submit" customClass="btn btn-primary" @click="handleCreate">
          New Group
        </Button>
      </div>

      <OmniGridView
        :columns="tableColumns"
        :data="tableData"
        :loading="isLoading"
        :dropDownPerPageOptions="[10, 25, 50]"
        :actions="customActions"
        action-layout="inline"
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
        :expandable-rows="false"
        :filtering="true"
        :multi-select="false"
        :radio-select="false"
        :break-extra-columns="true"
        :search-in-backend="true"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @search="handleSearch"
        @changePage="changePage"
        @update:perPage="updatePerPage"
        @refresh="request"
      >
        <template #left-buttons>
          <Button class="btn btn-success btn-sm" @click="handleCreate" style="font-size: 1.2rem">
            <template #icon>
              <font-awesome-icon :icon="['fas', 'plus']" />
            </template>
            New Group
          </Button>
        </template>
      </OmniGridView>
    </div>
  </div>
</template>
  
<style scoped></style>