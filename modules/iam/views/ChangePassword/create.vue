<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Form from './form.vue'
import { useAlertStore } from '~/omnicore/stores/alert.js'
import { useAuthStore } from '~/omnicore/stores/authStore'

// const { proxy } = getCurrentInstance()
const router = useRouter()
const alertStore = useAlertStore()
const authStore = useAuthStore()

const apiBaseUrl = `/v1/iam/auth/change-password`
const { data, request, isLoading, error } = useApi(apiBaseUrl, 'PUT')

const formData = ref({})

const handleSubmit = async (payloadData) => {
  const redirectRoute = ref('')
  await request(payloadData)

  if (error.value) {
    return
  }

  redirectRoute.value = data.value?.alertifyPayload?.type?.route

  // send logou reques to backed
  authStore.removeToken()

  //show alert
  alertStore.show({
    message: data.value?.alertifyPayload.type.message,
    theme: 'success',
  })

  // proxy.$showAlert({
  //   title: 'Success',
  //   icon: 'success',
  //   text: 'Passowrd Updated Succefully',
  //   showConfirmButton: false,
  //   showCancelButton: false,
  //   draggable: true,
  //   timer: 2000,
  //   timerProgressBar: true,
  // })
  setTimeout(() => {
    router.push({ name: redirectRoute.value })
  }, 2000)
}
</script>

<template>
  <div class="card p-3">
    <h1 class="h4 mt-2">Update Password</h1>
    <Form :formData="formData" :error="error" :isLoading="isLoading" @submit="handleSubmit" />
  </div>
</template>

<style scoped></style>