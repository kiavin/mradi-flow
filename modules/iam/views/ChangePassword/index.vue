<script setup>
import { onMounted, ref, watch, getCurrentInstance, nextTick } from 'vue'
import { useRouter } from 'vue-router';
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import { useModalStore } from '~/omnicore/stores/modalStore.js'
import Form from './form.vue'

const { proxy } = getCurrentInstance()
const router = useRouter();

const modalStore = useModalStore()


const apiBaseUrl = `/v1/iam/change-password`;

const { data, request, refresh, isLoading, error } = useApi(apiBaseUrl, {method: 'GET', options: {}, autoFetch: false});


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

const tableColumns = [{"key":"currentPassword","label":"CurrentPassword"},{"key":"newPassword","label":"NewPassword"},{"key":"confirmNewPassword","label":"ConfirmNewPassword"}]

watch(data, () => {
  updateResponseData()
})
// const updateResponseData = () => {
//   if (data.value?.dataPayload) {
//     tableData.value.data = Array.isArray(data.value.dataPayload.data)
//       ? data.value.dataPayload.data
//       : []
//     tableData.value.paginationData = {
//       countOnPage: data.value.dataPayload.countOnPage,
//       currentPage: data.value.dataPayload.currentPage,
//       perPage: data.value.dataPayload.perPage,
//       totalCount: data.value.dataPayload.totalCount,
//       totalPages: data.value.dataPayload.totalPages,
//       paginationLinks: data.value.dataPayload.paginationLinks,
//     }
//     // console.log('Updated tableData:', tableData.value)
//   }
// }
const updateResponseData = () => {
  // console.log("NEW DATA ON PAGINATION", data.value)
  if (data.value?.dataPayload) {
    // Transform the object data into an array if needed
    const responseData = data.value.dataPayload.data
    let formattedData = []

    if (typeof responseData === 'object' && !Array.isArray(responseData)) {
      // Convert object to array if API returns object
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
      }
    }
    // console.log('Updated tableData:', JSON.parse(JSON.stringify(tableData.value)))
  }
}


//const handleView = (id = row.id) => {
// router.push({ name: 'iam/changepassword/view', params: { id } });
//};

const handleView = async (row) => {
  const id = row.id;
  modalStore.toggleModalUsage(true) // if you want to navigate to route set to false

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: 'iam/changepassword/view', params: { id } });
    return
  }

  const apiBaseUrl = `/v1/iam/change-password/${id}`;

  const { data, request, isLoading, error } = useApi(apiBaseUrl, { method: 'GET', options: {}, autoFetch: true })

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
    'View ChangePassword',
  )
}

//const handleEdit = (id) => {
//   router.push({ name: 'iam/changepassword/update', params: { id } });
//}


const errors = ref({})

const handleEdit = async (row) => {
  const id = row.id
  errors.value = {}

  modalStore.toggleModalUsage(true) // if you want to navigate to route set to false

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    // Navigate to the update page
    router.push({ name: 'iam/changepassword/update', params: { id } });
    return
  }

  // Fetch appointment data before opening the modal
  const apiBaseUrl = `/v1/iam/change-password/${id}`;
  const { data, request, isLoading, error } = useApi(apiBaseUrl,{ method: 'GET', options: {}, autoFetch: true, autoAlert: true  })

  await request() // Fetch data before opening modal

  // Function to handle form submission (Update API Call)
  const handleSubmit = async (updatedData) => {
    const { request: updateData, error } = useApi(apiBaseUrl, {method: 'PUT'})
    await updateData(updatedData)
    if (error.value) {
      console.log('Error', error.value)
      errors.value = error.value // Assign the error object to errors
      return // Stop execution if error occurs
    }

    // Close modal on success
    modalStore.closeModal()

    // Show success message

    // if you are not using auto alert uncomment this block in order to see alerts

    // now auto alert is activated as autoAlert = true if set to false uncomment the block

    // proxy.$showAlert({
    //   title: 'Success',
    //   icon: 'success',
    //   text: data.value?.alertifyPayload?.message} ?? 'ChangePassword Updated successfully',
    //   showConfirmButton: false,
    //   timer: 2000,
    //   timerProgressBar: true,
    // })

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
    'Edit ChangePassword',
  )
}


const handleCreate = async() => {
  errors.value = {}
  modalStore.toggleModalUsage(true)

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: 'iam/changepassword/create' })
    return
  }

  // Define form submission handler
  const handleSubmit = async (newData) => {
    const apiBaseUrl = `/v1/iam/change-password`;

    const { request: createData, error } = useApi(apiBaseUrl,{method: 'POST', autoAlert: true })

    await createData(newData)

    if (error.value) {
      console.log('Error', error.value)
      errors.value = error.value // Assign errors to be passed to the form
      return
    }

    // Close modal and show success message
    modalStore.closeModal()

    // uncomment if not using auto alert,, now its enabled in the use api ie autoAlert = true

    // proxy.$showAlert({
    //   title: 'Success',
    //   icon: 'success',
    //   text: data.value?.alertifyPayload?.message} ?? 'ChangePassword Created successfully',
    //   showConfirmButton: false,
    //   timer: 2000,
    //   timerProgressBar: true,
    // })

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
    'Create ChangePassword',
  )
}


const handleDelete = async (row) => {
  const id = row.id;
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
      const { data, request, isLoading } = useApi(
        `/v1/iam/change-password/${id}`,
        { method: 'DELETE' },
      )

      await request()

     if (data.value) {
        await proxy.$showAlert({
          title: `${action}d!`,
          text: data.value?.alertifyPayload?.message || 'Record deleted successfully',
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
    q: query,
  })
}

const changePage = async (page) => {
  await request(null, { page, 'per-page': tableData.value.paginationData.perPage })

  updateResponseData()

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
</script>
<template>
  <div class="card p-3">
   <div class="row d-flex justify-content-between align-items-center mb-3">
      <div class="col-auto">
        <h1 class="h4 mt-2">List of ChangePassword</h1>
      </div>
      <div class="col-auto mb-4">
        <Button type="submit" customClass="btn btn-primary" @click="handleCreate"> New ChangePassword </Button>
      </div>

      <OmniGridView
      :columns="tableColumns"
      :data="tableData"
      :loading="isLoading"
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
        showCreateButton: false,
      }"
      :expandable-rows="false"      :filtering="false"
      rowSize="sm"
      :striped="false"
      :multi-select="false"
      :radio-select="false"
      :break-extra-columns="false"      :search-in-backend="true"
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
         New ChangePassword
        </Button>
      </template>
    </OmniGridView>
  </div>
</div>
</template>
<style scoped></style>