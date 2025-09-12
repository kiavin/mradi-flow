<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Form from './form.vue'
import { useAlertStore } from '~/omnicore/stores/alert.js'
import { useAuthStore } from '~/omnicore/stores/authStore'

const router = useRouter()
const alertStore = useAlertStore()
const authStore = useAuthStore()

const apiBaseUrl = `/v1/iam/auth/login`
const { data, request, isLoading, error } = useApi(apiBaseUrl, { method: 'POST' })

const formData = ref({
  username: '',
  password: '',
})

const handleSubmit = async (dataPayload) => {
  await request(dataPayload)

  if (error.value) {
    return
  }

  const { access_token, userData } = data.value.dataPayload.data

  if (access_token) {
    authStore.setToken(access_token, dataPayload?.username)
  }

  if (userData) {
    authStore.setUserData(userData)
  }

  // console.log('DATA', data.value?.dataPayload)

  alertStore.show(data.value)

  setTimeout(() => {
    router.push({ name: 'dashboard' })
  }, 2000)
}
</script>

<template>
  <Form :formData="formData" :error="error" :isLoading="isLoading" @submit="handleSubmit" />
</template>

<style scoped>
</style>
