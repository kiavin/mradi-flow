<script setup>
import { useRoute } from 'vue-router'
import { useApi } from '../../../app/omnicore/helpers/useApi'
const route = useRoute()

const { data, request, isLoading, error } = useApi(`/v1/scheduler/appointments/${route.params.id}`, 'GET', {}, true)
</script>

<template>
  <div class="container">
    <div v-if="isLoading"> Loading...</div>
    <pre>
        {{ data }}
    </pre>
  </div>
</template>

<style scooped></style>
