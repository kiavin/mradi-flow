export function createPageTemplate(resource, moduleName) {
  return `<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useApi } from '~/omnicore/helpers/useApi';
import { useRouter } from 'vue-router'
import Form from './form.vue';

const { proxy } = getCurrentInstance()
const router = useRouter()

const apiBaseUrl = \`/v1/${moduleName}/${resource.toLowerCase()}\`;
const { data, request, isLoading, error } = useApi(apiBaseUrl, 'POST');

const formData = ref({});

const handleSubmit = async (data) => {
  await request(data)

  if (error.value) {
    return 
  }

  proxy.$showAlert({ 
    title: 'Success',
    icon: 'success', 
    text: '${resource} created successfully',
    showConfirmButton: false,
    showCancelButton: false,
    draggable: true,
    timer: 2000, 
    timerProgressBar: true,
})
  setTimeout(() => {
    router.push({ name: '${resource}' })
  }, 2000)
}
</script>

<template>
<div class="container">
    <h1 class="h1 mt-2">Create ${resource}</h1>
    <Form 
    :formData="formData" 
    :error="error" 
    :isLoading="isLoading" 
    @submit="handleSubmit" 
    />
</div>
</template>

<style scoped></style>`;
}


export function updatePageTemplate(resource, moduleName) {
  return `<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '~/omnicore/helpers/useApi';
import Form from './form.vue';

const { proxy } = getCurrentInstance()
const router = useRouter()

const route = useRoute();
const id = route.params.id;
const apiBaseUrl = \`/v1/${moduleName}/${resource.toLowerCase()}/\${id}\`;

const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET');
const formData = ref({});
const errors = ref({});


watch(data, () => {
  if (data.value) {
    formData.value = data.value.dataPayload.data || {}
  }
})

//   onMounted(async () => {
//     await request();
//     formData.value = data.value || {};
//   });

const handleSubmit = async (updatedData) => {
  // Create a new API call for PUT request
  const { request: updateData, error } = useApi(apiBaseUrl, 'PUT')
  await updateData(updatedData)
  if (error.value) {
    console.log('Error', error.value)
    errors.value = error.value
  }
  if (error.value) {
    return
  }

  proxy.$showAlert({
    title: 'Success',
    icon: 'success',
    text: '${resource} Updated successfully',
    showConfirmButton: false,
    showCancelButton: false,
    draggable: true,
    timer: 2000,
    timerProgressBar: true,
  })
  setTimeout(() => {
    router.push({ name: '${resource}' })
  }, 2000)
}
</script>

<template>
<div class="container">
    <h1 class="h1 mt-2">Update ${resource}</h1>
    <Form 
    :formData="formData" 
    :error="errors" 
    :isLoading="isLoading" 
    @submit="handleSubmit" 
    />
</div>
</template>

<style scoped></style>`;
}


export function viewPageTemplate(resource, moduleName) {
  return `<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '~/omnicore/helpers/useApi';
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Form from './form.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const apiBaseUrl = \`/v1/${moduleName}/${resource.toLowerCase()}/\${id}\`;

const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, true);
const formData = ref({});

// onMounted(async () => {
// await request();
// formData.value = data.value || {};
// });

watch(data, () => {
  if (data.value) {
    formData.value = data.value.dataPayload.data || {};
  }
});

</script>

<template>
<div class="container">
    <div class="row d-flex justify-content-between align-items-center">
      <div class="col-auto">
        <h1 class="h1 mt-2">View ${resource}</h1>
      </div>
      <div class="col-auto">
        <Button type="submit" customClass="btn btn-success" @click="() => {router.push({ name: '${resource}-update', params: { id } });}"> Edit </Button>
      </div>
    </div>

    <Form 
    :formData="formData" 
    :error="error" 
    :isLoading="isLoading" 
    :readonly="true"
    hide-submit
    />
</div>
</template>

<style scoped></style>`;
}

export function indexPageTemplate(resource, tableColumns, moduleName) {
  return `<script setup>
import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import { useApi } from '~/omnicore/helpers/useApi';
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'

import DataTable from '~/themes/hopeui/components/organisms/DataTable.vue'

const { proxy } = getCurrentInstance()
const router = useRouter();
const apiBaseUrl = \`/v1/${moduleName}/${resource.toLowerCase()}\`;
  
const { data, request, refresh, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, false);


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

const tableColumns = ${JSON.stringify(tableColumns)}

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
    // console.log('Updated tableData:', tableData.value)
  }
}


const handleView = (id) => {
  router.push({ name: '${resource}-view', params: { id } });
};

const handleEdit = (id) => {
    router.push({ name: '${resource}-update', params: { id } });
}

const handleDelete = async (id, is_deleted) => {
   const action = is_deleted ? 'Restore' : 'Delete'

  const confirmationText = is_deleted
    ? 'You are about to restore this record. Do you want to proceed?'
    : 'You are about to delete this record. Do you want to proceed?'

  const result = await proxy.$showAlert({
    title: 'Are you sure?',
    text: confirmationText,
    icon: 'warning',
    showConfirmButton: true,
    confirmButtonText: \`Yes, \${action} it!\`,
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
        \`/v1/${moduleName}/${resource.toLowerCase()}/\${id}\`,
        'DELETE',
      )

      await request()

     if (data.value) {
        await proxy.$showAlert({
          title: \`\${action}d!\`,
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
        text: \`Error deleting record: \${error.value}\`,
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
</script>
<template>
<div class="container mt-4">
  
   <div class="row d-flex justify-content-between align-items-center mb-3">
      <div class="col-auto">
        <h1 class="h1 mt-2">List of ${resource}</h1>
      </div>
      <div class="col-auto">
        <Button type="submit" customClass="btn btn-success" @click="() => {router.push({ name: '${resource}-create' });}"> New ${resource} </Button>
      </div>
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
      />
</div>
</div>

</template>
  
<style scoped></style>`;
}


