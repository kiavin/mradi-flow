
<script setup>
import { ref } from 'vue'
import Input from '~/themes/hopeui/components/atoms/input/BaseInput.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Label from '~/themes/hopeui/components/atoms/labels/BaseLabel.vue'
import Particles from '@/iam/components/molecules/Particles.vue'
// import Spiner from '~/components/atoms/Spiner.vue'

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
  <Particles v-once />
  <section class="login-content">
    <b-row class="m-0 align-items-center justify-content-center bg-white-200 min-vh-100">
      <b-col cols="12" md="8" lg="6" xl="4" class="px-3" style="width: 450px">
        <b-card class="shadow-sm p-4 text-center mt-3" body-class="p-0">
          <!-- Brand logo -->
          <router-link
            :to="{ name: 'iam/auth/login' }"
            class="navbar-brand d-flex align-items-center justify-content-center mb-3"
          >
            <!-- app-logo -->
            <Logo v-once />
          </router-link>

          <!-- Title & subtitle -->
          <p class="mb-4">Login to stay connected.</p>

          <!-- Login form -->
          <form @submit.prevent="onSubmit" class="text-start">
            <div class="mb-3">
              <Label class="form-label" :labelFor="'username'">Username</Label>
              <Input
                :id="'username'"
                :type="'text'"
                v-model="formData.username"
                :disabled="readonly"
                class="form-control"
              />
              <p v-if="error?.username" class="text-danger mt-1">{{ error.username }}</p>
            </div>

            <div class="mb-3">
              <Label class="form-label" :labelFor="'password'">Password</Label>
              <Input
                :id="'password'"
                :type="'password'"
                v-model="formData.password"
                :disabled="readonly"
                class="form-control"
              />
              <p v-if="error?.password" class="text-danger mt-1">{{ error.password }}</p>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="customCheck1" />
                <label class="form-check-label" for="customCheck1">Remember Me</label>
              </div>
              <router-link :to="{ name: 'iam/resetpasswordrequest/index' }"
                >Forgot Password?</router-link
              >
            </div>

            <div class="text-center mb-3">
              <Button type="submit" customClass="btn btn-primary w-100" :disabled="isLoading">
                <template v-if="isLoading">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </template>
                <template v-else> LOGIN </template>
              </Button>
            </div>

            <!-- <p class="text-center my-3">or sign in with other accounts</p>
            <div class="d-flex justify-content-center mb-3">
              <ul class="list-group list-group-horizontal list-group-flush">
                <li class="list-group-item border-0 pb-0">
                  <a href="#">
                    <img
                      src="../../../../app/themes/hopeui/assets/images/brands/fb.svg"
                      alt="fb"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li class="list-group-item border-0 pb-0">
                  <a href="#">
                    <img
                      src="../../../../app/themes/hopeui/assets/images/brands/gm.svg"
                      alt="gm"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li class="list-group-item border-0 pb-0">
                  <a href="#">
                    <img
                      src="../../../../app/themes/hopeui/assets/images/brands/im.svg"
                      alt="im"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li class="list-group-item border-0 pb-0">
                  <a href="#">
                    <img
                      src="../../../../app/themes/hopeui/assets/images/brands/li.svg"
                      alt="li"
                      loading="lazy"
                    />
                  </a>
                </li>
              </ul>
            </div>

            <p class="text-center">
              Don’t have an account?
              <router-link :to="{ name: 'playground' }">Click here to sign up.</router-link>
            </p> -->
          </form>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>
    