
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

const emit = defineEmits(['submit'])

const onSubmit = () => {
  emit('submit', props.formData) // Emit the form data to the parent
}
</script>
<template>
  <section class="login-content">
    <b-row class="m-0 align-items-center justify-content-center bg-white-200 min-vh-100">
      <b-col cols="12" md="6" lg="4" style="width: 25vw">
        <b-card class="shadow-sm p-4 text-center mt-3" body-class="p-0">
          <!-- Brand logo -->
          <router-link
            :to="{ name: 'playground' }"
            class="navbar-brand d-flex align-items-center justify-content-center mb-3"
          >
            <!-- app-logo -->
            <Logo />
          </router-link>

          <!-- Title & subtitle -->
          <p class="mb-4">Passord Reset</p>

          <!-- Login form -->
          <form @submit.prevent="onSubmit" class="text-start">
            <div class="mb-3">
              <Label class="form-label" :labelFor="'password'">Password</Label>
              <Input
                :id="'password'"
                :type="'password'"
                v-model="formData.password"
                :disabled="readonly"
                class="form-control"
              />
              <p v-if="error?.username" class="text-danger mt-1">{{ error.passowrd }}</p>
            </div>

            <div class="mb-3">
              <Label class="form-label" :labelFor="'confirmPassword'">Confirm Password</Label>
              <Input
                :id="'confirmPassword'"
                :type="'password'"
                v-model="formData.confirmPassword"
                :disabled="readonly"
                class="form-control"
              />
              <p v-if="error?.password" class="text-danger mt-1">{{ error.confirmPassword }}</p>
            </div>
            <div class="text-center mb-3">
              <Button type="submit" customClass="btn btn-success w-100" :disabled="isLoading">
                {{ isLoading ? 'Submitting...' : 'Reset Password' }}
              </Button>
            </div>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>
    