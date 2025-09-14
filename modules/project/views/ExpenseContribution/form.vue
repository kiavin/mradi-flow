<script setup>
import { ref } from 'vue'
import Input from '~/themes/hopeui/components/atoms/input/BaseInput.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Label from '~/themes/hopeui/components/atoms/labels/BaseLabel.vue'

const props = defineProps({
  formData: Object,
  error: Object,
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

const expenseOptions = [
  { value: 1, text: 'Licensing Fees' },
  { value: 2, text: 'Architect Fees' },
  { value: 3, text: 'Site Preparation' },
]

const financierOptions = [
  { value: 1, text: 'Equity Bank' },
  { value: 2, text: 'KCB Group' },
  { value: 3, text: 'NCBA Bank' },
]

const projectOptions = [
  { value: 1, text: 'Wote' },
  { value: 2, text: 'Kibwezi' },
  { value: 3, text: 'Juba' },
]

const emit = defineEmits(['submit', 'update'])

const onSubmit = () => {
  emit('submit', props.formData) // Emit the form data to the parent
}
</script>

<template>
    <b-card-body>
      <b-form @submit.prevent="onSubmit">
        <!-- Project ID (Drpdown)-->
          <b-form-group>
          <label for="project_id" class="form-label">Project</label>
          <b-form-select
            id="project_id"
            v-model="formData.project_id"
            :options="projectOptions"
            :disabled="readonly"
            required
          />
          <p v-if="error?.expense_id" class="text-danger">{{ error.project_id }}</p>
        </b-form-group>
        <!-- Expense ID (Dropdown) -->
        <b-form-group>
          <label for="expense_id" class="form-label">Expense</label>
          <b-form-select
            id="expense_id"
            v-model="formData.expense_id"
            :options="expenseOptions"
            :disabled="readonly"
            required
          />
          <p v-if="error?.expense_id" class="text-danger">{{ error.expense_id }}</p>
        </b-form-group>

        <!-- Financier ID (Dropdown) -->
        <b-form-group class="mt-3">
          <label for="financier_id" class="form-label">Financier</label>
          <b-form-select
            id="financier_id"
            v-model="formData.financier_id"
            :options="financierOptions"
            :disabled="readonly"
            required
          />
          <p v-if="error?.financier_id" class="text-danger">{{ error.financier_id }}</p>
        </b-form-group>

        <!-- Amount (Text Input) -->
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
