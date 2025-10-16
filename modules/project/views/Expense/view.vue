<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Form from './form.vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const apiBaseUrl = `/v1/project/expense/${id}`;

const { data, request, isLoading, error } = useApi(apiBaseUrl, {method: 'GET', options: {}, autoFetch: true});
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
  <div class="card p-3">

    <div class="row d-flex justify-content-between align-items-center">
      <div class="col-auto">
        <h1 class="h1 mt-2">View Expense</h1>
      </div>
      <div class="col-auto">
        <Button type="submit" customClass="btn btn-primary" @click="() => {router.push({ name: 'project/expense/update', params: { id } });}"> Edit </Button>
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

<style scoped></style>