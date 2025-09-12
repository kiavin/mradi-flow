<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Form from './form.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()

const apiBaseUrl = `/v1/iam/auth/request-password-reset`
const { data, request, isLoading, error } = useApi(apiBaseUrl, { method: 'POST' })

const formData = ref({})

const handleSubmit = async (data) => {
  await request(data)

  if (error.value) {
    return
  }

  proxy.$showAlert({
    title: 'Success',
    icon: 'success',
    text:
      data.value.alertifyPayload.message ??
      'Your Password reset request was successfully, check your email to set a new password',
    showConfirmButton: false,
    showCancelButton: false,
    draggable: true,
    timer: 2000,
    timerProgressBar: true,
  })
  setTimeout(() => {
    router.push({ name: 'iam/reset-password-request' })
  }, 2000)
}
</script>

<template>
  <Form :formData="formData" :error="error" :isLoading="isLoading" @submit="handleSubmit" />
</template>

<style scoped></style>