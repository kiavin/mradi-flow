<script setup>
import { ref } from 'vue'
import Input from '~/themes/hopeui/components/atoms/input/BaseInput.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Label from '~/themes/hopeui/components/atoms/labels/BaseLabel.vue'
import SelectComponent from '@/project/components/atoms/SelectComponent.vue'
const props = defineProps({
  formData: Object,
  error: Object,
  financierOptions: Array,
  expenseOptions: Array,
  projectOptions: Array,
  isLoading: Boolean,
  readonly: {
    type: Boolean,
    default: false,
  },
  hideSubmit: {
    type: Boolean,
    default: false,
  },
  onSubmit: Function,
})

const expenseOptions = ref(props.expenseOptions)

const financierOptions = ref(props.financierOptions)

const projectOptions = ref(props.projectOptions)

const emit = defineEmits(['submit', 'update'])

const onSubmit = () => {
  emit('submit', props.formData) // Emit the form data to the parent
}
</script>
<template>
  <b-card-body>
    <b-form @submit.prevent="onSubmit">
      <!-- Project ID (Single Select) -->
      <b-form-group class="mt-3">
        <label for="project_id" class="form-label">Project</label>
        <select-component
          id="project_id"
          v-model="formData.project_id"
          :options="projectOptions"
          mode="single"
          :close-on-select="true"
          placeholder="Select Project"
          class="form-control"
          :disabled="readonly"
        />
        <p v-if="error?.project_id" class="text-danger">{{ error.project_id }}</p>
      </b-form-group>

      <!-- Expense ID (Single Select) -->
      <b-form-group class="mt-3">
        <label for="expense_id" class="form-label">Expense</label>
        <select-component
          id="expense_id"
          v-model="formData.expense_id"
          :options="expenseOptions"
          mode="single"
          :close-on-select="true"
          placeholder="Select Expense"
          class="form-control"
          :disabled="readonly"
        />
        <p v-if="error?.expense_id" class="text-danger">{{ error.expense_id }}</p>
      </b-form-group>

      <!-- Financier ID (Single Select) -->
      <b-form-group class="mt-3">
        <label for="financier_id" class="form-label">Financier</label>
        <select-component
          id="financier_id"
          v-model="formData.financier_id"
          :options="financierOptions"
          mode="single"
          :close-on-select="true"
          placeholder="Select Financier"
          class="form-control"
          :disabled="readonly"
        />
        <p v-if="error?.financier_id" class="text-danger">{{ error.financier_id }}</p>
      </b-form-group>
      <!-- Amount -->
      <b-form-group class="mt-3">
        <label for="amount" class="form-label">Amount (KES)</label>
        <b-form-input
          id="amount"
          v-model="formData.amount"
          type="number"
          placeholder="e.g. 100000"
          :disabled="readonly"
          required
        />
        <p v-if="error?.amount" class="text-danger">{{ error.amount }}</p>
      </b-form-group>

      <!-- Submit Button -->
      <div v-if="!hideSubmit" class="d-flex flex-wrap justify-content-center mt-4">
        <b-button type="submit" variant="success" class="me-2" :disabled="isLoading">
          {{ isLoading ? 'Submitting...' : 'Save' }}
        </b-button>
      </div>
    </b-form>
  </b-card-body>
</template>
