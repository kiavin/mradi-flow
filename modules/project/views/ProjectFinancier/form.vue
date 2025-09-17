<script setup>
import { ref } from 'vue'
import Input from '~/themes/hopeui/components/atoms/input/BaseInput.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Label from '~/themes/hopeui/components/atoms/labels/BaseLabel.vue'
import SelectComponent from '@/project/components/atoms/SelectComponent.vue'

const props = defineProps({
  formData: Object,
  error: Object,
  projectId: String,
  financierOptions: Array,
  isLoading: Boolean,
  context: String,
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

const projectId = ref(props.projectId || '')
const financierOptions = ref(props.financierOptions || [])

const isReadOnly = computed(() => {
  return props.context || props.readonly
})

const onSubmit = () => {
  props.formData.project_id = projectId.value
  emit('submit', props.formData) // Emit the form data to the parent
}
</script>
<template>
  <form @submit.prevent="onSubmit" class="row g-3">
    <!-- Financier Dropdown -->
    <div class="mb-2 form-group">
      <Label :labelFor="'financier_id'"> Financier </Label>
      <select-component
        id="financier_id"
        v-model="formData.financier_id"
        :options="financierOptions"
        placeholder="Select Financier"
        mode="single"
        class="form-control"
        :disabled="readonly"
      />
      <p v-if="error?.financier_id" class="text-danger">{{ error.financier_id }}</p>
    </div>

    <!-- Submit Button -->
    <div v-if="!hideSubmit" class="text-center mt-3">
      <Button type="submit" customClass="btn btn-success d-inline-block" :disabled="isLoading">
        {{ isLoading ? 'Submitting...' : 'Save' }}
      </Button>
    </div>
  </form>
</template>
