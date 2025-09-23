
<script setup>
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
        <!-- Expense Name -->
        <b-form-group>
          <label for="name" class="form-label">Name</label>
          <b-form-input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="e.g. Materials, Labour"
            :disabled="readonly"
            required
          />
          <p v-if="error?.name" class="text-danger">{{ error.name }}</p>
        </b-form-group>

        <!-- Expense Description -->
        <b-form-group class="mt-3">
          <label for="description" class="form-label">Description</label>
          <b-form-input
            id="description"
            v-model="formData.description"
            type="text"
            placeholder="Optional description"
            :disabled="readonly"
          />
          <p v-if="error?.description" class="text-danger">{{ error.description }}</p>
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

