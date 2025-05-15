 
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goBack = () => {
  router.back()
}
const code = parseInt(route.query.code || 500)

const fallbackTitles = {
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Page Not Found',
  500: 'Server Error',
}

const fallbackDescriptions = {
  401: 'You are not authorized to view this page.',
  403: 'You don’t have permission to access this page.',
  404: 'The page you are looking for could not be found.',
  500: 'Something went wrong on the server.',
}

const title = route.query.title || fallbackTitles[code] || 'Error'
const description =
  route.query.description || fallbackDescriptions[code] || 'An unknown error occurred.'
</script>
 
<template>
  <div
    class="container vh-100 d-flex flex-column justify-content-center align-items-center text-center"
  >
    <div class="display-1 fw-bold text-secondary">{{ code }}</div>
    <h1 class="display-4 text-danger mt-3">{{ title }}</h1>
    <p class="lead mt-3 text-muted">{{ description }}</p>

    <button class="btn btn-primary mt-4" @click="goBack">Go Back</button>
  </div>
</template>

