
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
  <section class="login-content">
    <div class="row m-0 align-items-center bg-white vh-100">
      <div class="col-md-6 d-md-block d-none bg-primary p-0 vh-100 overflow-hidden">
        <img
          src="/cinematic44.jpg"
          class="img-fluid gradient-main animated-scaleX"
          alt="images"
          loading="lazy"
        />
        <!-- storage/cinematic44.jpg -->
        <!-- src="/ill22.jpg" -->
        <!-- storage/main_preview.jpg -->
        <!-- storage/stock_view.jpg -->
        <!-- storage/stock2.jpg -->
        <!-- storage/stock3.jpg -->
      </div>
      <div class="col-md-6 p-0">
        <div class="card card-transparent auth-card shadow-none d-flex justify-content-center mb-0">
          <div class="card-body">
            <div class="d-flex flex-row align-items-center mb-4 py-3">
              <!-- Arrow on far left -->
              <div class="me-auto">
                <!-- "me-auto" pushes everything else to the right -->
                <router-link
                  :to="{ name: 'iam/auth/login' }"
                  class="navbar-brand d-flex align-items-center mb-3"
                >
                  <font-awesome-icon
                    :icon="['fas', 'arrow-left']"
                    class="text-dark fw-bold fs-4"
                    v-tooltip:bottom="'Go back to login'"
                  />
                </router-link>
              </div>

              <!-- Centered Logo -->
              <div class="position-absolute start-50 translate-middle-x">
                <!-- Center horizontally -->
                <router-link
                  :to="{ name: 'iam/auth/login' }"
                  class="navbar-brand d-flex align-items-center mb-3"
                >
                  <Logo />
                </router-link>
              </div>

              <!-- Empty div to balance the flex layout -->
              <div class="ms-auto" style="visibility: hidden">
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
              </div>
            </div>

            <h2 class="mb-3">Reset Password</h2>
            <p class="mb-4">
              Enter your email address and we'll send you an email with instructions to reset your
              password.
            </p>
            <form @submit.prevent="onSubmit" class="row g-3">
              <div class="mb-4 form-group">
                <Label :labelFor="'username'"> Username or Email Address </Label>
                <Input
                  :id="'username'"
                  :type="'text'"
                  v-model="formData.username"
                  :disabled="readonly"
                />
                <p v-if="error?.username" class="text-danger">{{ error.username }}</p>
              </div>

              <div v-if="!hideSubmit" class="text-center mt-3">
                <Button
                  type="submit"
                  customClass="btn btn-primary d-inline-block"
                  :disabled="isLoading"
                >
                  <template v-if="isLoading">
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </template>
                  <template v-else>Send password reset link </template>
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div class="sign-bg sign-bg-right">
          <svg
            width="280"
            height="230"
            viewBox="0 0 431 398"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.05">
              <rect
                x="-157.085"
                y="193.773"
                width="543"
                height="77.5714"
                rx="38.7857"
                transform="rotate(-45 -157.085 193.773)"
                fill="#3B8AFF"
              />
              <rect
                x="7.46875"
                y="358.327"
                width="543"
                height="77.5714"
                rx="38.7857"
                transform="rotate(-45 7.46875 358.327)"
                fill="#3B8AFF"
              />
              <rect
                x="61.9355"
                y="138.545"
                width="310.286"
                height="77.5714"
                rx="38.7857"
                transform="rotate(45 61.9355 138.545)"
                fill="#3B8AFF"
              />
              <rect
                x="62.3154"
                y="-190.173"
                width="543"
                height="77.5714"
                rx="38.7857"
                transform="rotate(45 62.3154 -190.173)"
                fill="#3B8AFF"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
    