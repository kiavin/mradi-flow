export function createPageTemplate(resource) {
    return `<script setup>
import { ref } from 'vue';
import { useApi } from '~/omnicore/helpers/useApi';
import Form from './form.vue';

const apiBaseUrl = \`/v1/${resource}\`;
const { data, request, isLoading, error } = useApi(apiBaseUrl, 'POST');

const formData = ref({});

const handleSubmit = async (data) => {
await request(data);
};
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


export function updatePageTemplate(resource) {
    return `<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/omnicore/helpers/useApi';
import Form from './form.vue';

const route = useRoute();
const id = route.params.id;
const apiBaseUrl = \`/v1/${resource}/\${id}\`;

const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, true);
const formData = ref({});

//   onMounted(async () => {
//     const response = await request();
//     formData.value = response || {};
//   });

const handleSubmit = async (updatedData) => {
    // Create a new API call for PUT request
    const { request: updateData } = useApi(apiBaseUrl, 'PUT', {}, false);
    await updateData(updatedData);
};
</script>

<template>
<div class="container">
    <h1 class="h1 mt-2">Update ${resource}</h1>
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


export function viewPageTemplate(resource) {
    return `<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from '~/omnicore/helpers/useApi';
import Form from './form.vue';

const route = useRoute();
const id = route.params.id;
const apiBaseUrl = \`/v1/${resource}/\${id}\`;

const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, true);
const formData = ref({});

onMounted(async () => {
await request();
formData.value = data.value || {};
});

watch(data, () => {
  formData.value = data.value || {};
});

</script>

<template>
<div class="container">
    <h1 class="h1 mt-2">View ${resource}</h1>
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

export function indexPageTemplate(resource, tableColumns, routeName) {
    return `<script setup>
import { onMounted, ref, watch, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import { useApi } from '~/omnicore/helpers/useApi';

import DataTable from '~/themes/hopeui/components/organisms/DataTable.vue'

const { proxy } = getCurrentInstance()
const router = useRouter();
const apiBaseUrl = \`/v1/${resource}\`;
  
const { data, request, isLoading, error } = useApi(apiBaseUrl, 'GET', {}, false);


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


const handleView = (id) => {
  router.push({ name: '${routeName}/view', params: { id } });
};

const handleEdit = (id) => {
    router.push({ name: '${routeName}/update', params: { id } });
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
  <h1 class="h1 mt-2">List of ${resource}</h1>
  <DataTable
        :data="tableData"
        :columns="tableColumns"
        @edit="handleEdit"
        @search="handleSearch"
        @delete="handleDelete"
        @view="handleView"
        @changePage="changePage"
        @update:perPage="updatePerPage"
      />
</div>
</template>
  
<style scoped></style>`;
}


