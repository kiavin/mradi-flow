<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Form from './form.vue';

const { proxy } = getCurrentInstance()
const router = useRouter()

const route = useRoute();
const id = route.params.id;
const apiBaseUrl = `/v1/project/project-financier/${id}`;

const { data, request, isLoading, error } = useApi(apiBaseUrl, { method: 'GET' });
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
  const { request: updateData, error } = useApi(apiBaseUrl,{ method: 'PUT', autoAlert: true })
  await updateData(updatedData)
  if (error.value) {
    console.log('Error', error.value)
    errors.value = error.value
  }
  if (error.value) {
    return
  }

  // uncomment if auto alert set to false

  // proxy.$showAlert({
  //   title: 'Success',
  //   icon: 'success',
  //   text: data.value?.alertifyPayload?.message ?? 'ProjectFinancier Updated successfully',
  //   showConfirmButton: false,
  //   showCancelButton: false,
  //   draggable: true,
  //   timer: 2000,
  //   timerProgressBar: true,
  // })
  setTimeout(() => {
    router.push({ name: 'project/project-financier' })
  }, 2000)
}
</script>

<template>
  <div class="card p-3">

    <h1 class="h4 mt-2">Update ProjectFinancier</h1>
    <Form 
    :formData="formData" 
    :error="errors" 
    :isLoading="isLoading" 
    @submit="handleSubmit" 
    />
    </div>
</template>

<style scoped></style>