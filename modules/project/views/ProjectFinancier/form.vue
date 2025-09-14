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
  <form @submit.prevent="onSubmit" class="row g-3">
    <div class="mb-2 form-group">
      <Label :labelFor="'project_id'"> Project id </Label>
      <Input
        :id="'project_id'"
        :type="'number'"
        v-model="formData.project_id"
        :disabled="readonly"
      />
      <p v-if="error?.project_id" class="text-danger">{{ error.project_id }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'financier_id'"> Financier id </Label>
      <Input
        :id="'financier_id'"
        :type="'number'"
        v-model="formData.financier_id"
        :disabled="readonly"
      />
      <p v-if="error?.financier_id" class="text-danger">{{ error.financier_id }}</p>
    </div>

    <div v-if="!hideSubmit" class="text-center mt-3">
      <Button type="submit" customClass="btn btn-success d-inline-block" :disabled="isLoading">
        {{ isLoading ? 'Submitting...' : 'Save' }}
      </Button>
    </div>
  </form>
</template>
