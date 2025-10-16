
<script setup>
import { ref } from 'vue';
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
    onSubmit: Function
});

const emit = defineEmits(['submit', 'update']);

const onSubmit = () => {
    emit('submit', props.formData); // Emit the form data to the parent
};
</script>

<template>


    <b-card-body>
      <b-form @submit.prevent="onSubmit">
        <!-- Financier Name -->
        <b-form-group>
          <label for="name" class="form-label">Name</label>
          <b-form-input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="e.g. Equity Bank"
            :disabled="readonly"
            required
          />
          <p v-if="error?.name" class="text-danger">{{ error.name }}</p>
        </b-form-group>

        <!-- Contact Number -->
        <b-form-group class="mt-3">
          <label for="contact" class="form-label">Contact</label>
          <b-form-input
            id="contact"
            v-model="formData.contact"
            type="tel"
            placeholder="e.g. +254712345678"
            :disabled="readonly"
          />
          <p v-if="error?.contact" class="text-danger">{{ error.contact }}</p>
        </b-form-group>

        <!-- Submit Actions -->
        <div v-if="!hideSubmit" class="d-flex flex-wrap justify-content-center mt-4">
          <b-button
            type="submit"
            variant="success"
            class="me-2"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Submitting...' : 'Save' }}
          </b-button>
        </div>
      </b-form>
    </b-card-body>
</template>

