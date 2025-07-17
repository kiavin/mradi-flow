
<script setup>
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
      <Label :labelFor="'first_name'"> First name </Label>
      <Input :id="'first_name'" :type="'text'" v-model="formData.first_name" :disabled="readonly" />
      <p v-if="error?.first_name" class="text-danger">{{ error.first_name }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'middle_name'"> Middle name </Label>
      <Input
        :id="'middle_name'"
        :type="'text'"
        v-model="formData.middle_name"
        :disabled="readonly"
      />
      <p v-if="error?.middle_name" class="text-danger">{{ error.middle_name }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'last_name'"> Last name </Label>
      <Input :id="'last_name'" :type="'text'" v-model="formData.last_name" :disabled="readonly" />
      <p v-if="error?.last_name" class="text-danger">{{ error.last_name }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'email_address'"> Email address </Label>
      <Input
        :id="'email_address'"
        :type="'text'"
        v-model="formData.email_address"
        :disabled="readonly"
      />
      <p v-if="error?.email_address" class="text-danger">{{ error.email_address }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'phone_number'"> Phone number </Label>
      <Input
        :id="'phone_number'"
        :type="'text'"
        v-model="formData.phone_number"
        :disabled="readonly"
      />
      <p v-if="error?.phone_number" class="text-danger">{{ error.phone_number }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'profile_picture'"> Profile picture </Label>
      <Input
        :id="'profile_picture'"
        :type="'text'"
        v-model="formData.profile_picture"
        :disabled="readonly"
      />
      <p v-if="error?.profile_picture" class="text-danger">{{ error.profile_picture }}</p>
    </div>

    <div v-if="!hideSubmit" class="text-center mt-3">
      <Button type="submit" customClass="btn btn-success d-inline-block" :disabled="isLoading">
        {{ isLoading ? 'Submitting...' : 'Save' }}
      </Button>
    </div>
  </form>
</template>
    