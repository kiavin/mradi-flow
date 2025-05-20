<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import Form from './form.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()

const token = '4i2bGDpzC3tl9imVc-4GT-EZVqO_Qhxe_1742739158'

const apiBaseUrl = `/v1/iam/auth/reset-password?token=${token}`
const { data, request, isLoading, error } = useApi(apiBaseUrl, 'PUT')

const formData = ref({})

const handleSubmit = async (data) => {
  await request(data)

  if (error.value) {
    return
  }

  proxy.$showAlert({
    title: 'Success',
    icon: 'success',
    text: 'Password Updated successfully, You can now login with your new credentials',
    showConfirmButton: false,
    showCancelButton: false,
    draggable: true,
    timer: 2000,
    timerProgressBar: true,
  })
  setTimeout(() => {
    router.push({ name: 'iam/auth/login' })
  }, 2000)
}
</script>

<template>
  <Form :formData="formData" :error="error" :isLoading="isLoading" @submit="handleSubmit" />
</template>

<style scoped></style>