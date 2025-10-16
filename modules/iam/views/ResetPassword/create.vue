<script setup>
import { ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router'
import Form from './form.vue';

const { proxy } = getCurrentInstance()
const router = useRouter()

const apiBaseUrl = `/v1/iam/reset-password`;
const { data, request, isLoading, error } = useApi(apiBaseUrl, { method: 'POST', autoAlert: true });

const formData = ref({});

const handleSubmit = async (data) => {
  await request(data)

  if (error.value) {
    return
  }
//  uncomment if auto alert is disabled

//   proxy.$showAlert({
//     title: 'Success',
//     icon: 'success',
//     text: data.value?.alertifyPayload?.message ?? 'ResetPassword created successfully',
//     showConfirmButton: false,
//     showCancelButton: false,
//     draggable: true,
//     timer: 2000,
//     timerProgressBar: true,
// })
  setTimeout(() => {
    router.push({ name: 'iam/reset-password' })
  }, 2000)
}
</script>

<template>
  <div class="card p-3">

    <h1 class="h4 mt-2">Create ResetPassword</h1>
    <Form
    :formData="formData"
    :error="error"
    :isLoading="isLoading"
    @submit="handleSubmit"
    />
    </div>
</template>

<style scoped></style>