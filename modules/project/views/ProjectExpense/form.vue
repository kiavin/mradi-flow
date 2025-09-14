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

const emit = defineEmits(['submit', 'update'])

const onSubmit = () => {
  emit('submit', props.formData) // Emit the form data to the parent
}
</script>
<template>


    <b-card-body>
      <b-form @submit.prevent="onSubmit">
        <!-- Project ID -->
        <b-form-group>
          <label for="project-id" class="form-label">Project ID</label>
          <b-form-input
            id="project-id"
            v-model="formData.project_id"
            type="number"
            :disabled="readonly"
            placeholder="e.g. 1"
            required
          />
          <p v-if="error?.project_id" class="text-danger">{{ error.project_id }}</p>
        </b-form-group>

        <!-- Expense ID -->
        <b-form-group class="mt-3">
          <label for="expense-id" class="form-label">Expense ID</label>
          <b-form-input
            id="expense-id"
            v-model="formData.expense_id"
            type="number"
            :disabled="readonly"
            placeholder="e.g. 4"
            required
          />
          <p v-if="error?.expense_id" class="text-danger">{{ error.expense_id }}</p>
        </b-form-group>

        <!-- Total Amount -->
        <b-form-group class="mt-3">
          <label for="total-amount" class="form-label">Total Amount (KES)</label>
          <b-form-input
            id="total-amount"
            v-model="formData.total_amount"
            type="number"
            min="0"
            :disabled="readonly"
            placeholder="e.g. 1000000"
            required
          />
          <p v-if="error?.total_amount" class="text-danger">{{ error.total_amount }}</p>
        </b-form-group>

        <!-- Actions -->
        <div v-if="!hideSubmit" class="d-flex flex-wrap mt-4 justify-content-center">
          <b-button type="submit" variant="success" class="me-2 " :disabled="isLoading">
            {{ isLoading ? 'Submitting...' : 'Save' }}
          </b-button>
        </div>
      </b-form>
    </b-card-body>
</template>
