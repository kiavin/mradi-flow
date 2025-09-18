<script setup>
import { ref } from "vue";
import Input from "~/themes/hopeui/components/atoms/input/BaseInput.vue";
import Button from "~/themes/hopeui/components/atoms/button/BaseButton.vue";
import Label from "~/themes/hopeui/components/atoms/labels/BaseLabel.vue";
import SelectComponent from "@/project/components/atoms/SelectComponent.vue";
const props = defineProps({
  formData: Object,
  error: Object,
  Financiers: {
    type: Array,
    default: () => [],
  },
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
});

const financierOptions = ref(props.Financiers);

const emit = defineEmits(["submit", "update"]);

const onSubmit = () => {
  const transformedPayload = {
    ...props.formData,
    financiers: Array.isArray(props.formData.financiers)
      ? props.formData.financiers.map((id) => ({ financier_id: id }))
      : [],
  };

  emit("submit", transformedPayload); // Emit the transformed payload to the parent
};
</script>

<template>
  <b-card-body>
    <b-form @submit.prevent="onSubmit">
      <!-- Project Name -->
      <b-form-group>
        <label for="project-name" class="form-label">Name</label>
        <b-form-input
          id="project-name"
          v-model="formData.name"
          type="text"
          :disabled="readonly"
          placeholder="e.g. Nairobi Phase 2 Housing"
          required
        />
        <p v-if="error?.name" class="text-danger">{{ error.name }}</p>
      </b-form-group>
      <!-- Tender Amount -->
      <b-form-group class="mt-3">
        <label for="tender-amount" class="form-label">Bid Amount (KES)</label>
        <b-form-input
          id="tender-amount"
          v-model.number="formData.bid_amount"
          type="number"
          :disabled="readonly"
          min="0"
          placeholder="e.g. 100000000"
          required
        />
        <p v-if="error?.tender_amount" class="text-danger">
          {{ error.tender_amount }}
        </p>
      </b-form-group>

      <!-- Financiers Multi-Select -->
      <b-form-group class="mt-3">
        <label for="financiers" class="form-label">Select Financiers</label>
        <select-component
          id="financiers"
          v-model="formData.financiers"
          mode="tags"
          :options="financierOptions"
          :close-on-select="false"
          placeholder="Choose one or more financiers"
          class="form-control"
          :disabled="readonly"
        />
        <p v-if="error?.financiers" class="text-danger">
          {{ error.financiers }}
        </p>
      </b-form-group>

      <!-- Submit Buttons -->
      <div
        v-if="!hideSubmit"
        class="d-flex flex-wrap mt-4 justify-content-center"
      >
        <b-button
          type="submit"
          variant="success"
          class="me-2"
          :disabled="isLoading"
        >
          {{ isLoading ? "Submitting..." : "Save" }}
        </b-button>
      </div>
    </b-form>
  </b-card-body>
</template>
