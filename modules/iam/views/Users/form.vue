<script setup>
import { ref } from "vue";
import Input from "~/themes/hopeui/components/atoms/input/BaseInput.vue";
import Button from "~/themes/hopeui/components/atoms/button/BaseButton.vue";
import Label from "~/themes/hopeui/components/atoms/labels/BaseLabel.vue";

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
  context: {
    type: String,
    default: 'general'
  }
});

const emit = defineEmits(["submit", "update"]);

const onSubmit = () => {
  emit("submit", props.formData);
};
</script>
<template>
  <form @submit.prevent="onSubmit" class="row g-3">
    <!-- Row 1: First Name, Middle Name, Last Name -->
    <div class="col-md-4">
      <Label :labelFor="'first_name'"> First Name </Label>
      <Input
        :id="'first_name'"
        :type="'text'"
        v-model="formData.first_name"
        :disabled="readonly"
      />
      <p v-if="error?.first_name" class="text-danger">{{ error.first_name }}</p>
    </div>

    <div class="col-md-4">
      <Label :labelFor="'middle_name'"> Middle Name </Label>
      <Input
        :id="'middle_name'"
        :type="'text'"
        v-model="formData.middle_name"
        :disabled="readonly"
      />
      <p v-if="error?.middle_name" class="text-danger">
        {{ error.middle_name }}
      </p>
    </div>

    <div class="col-md-4">
      <Label :labelFor="'last_name'"> Last Name </Label>
      <Input
        :id="'last_name'"
        :type="'text'"
        v-model="formData.last_name"
        :disabled="readonly"
      />
      <p v-if="error?.last_name" class="text-danger">{{ error.last_name }}</p>
    </div>

    <!-- Row 2: Email, Phone, Username -->
    <div class="col-md-4">
      <Label :labelFor="'email_address'"> Email Address </Label>
      <Input
        :id="'email_address'"
        :type="'email'"
        v-model="formData.email_address"
        :disabled="readonly"
      />
      <p v-if="error?.email_address" class="text-danger">
        {{ error.email_address }}
      </p>
    </div>

    <div class="col-md-4">
      <Label :labelFor="'phone_number'"> Phone Number </Label>
      <Input
        :id="'phone_number'"
        :type="'text'"
        v-model="formData.phone_number"
        :disabled="readonly"
      />
      <p v-if="error?.phone_number" class="text-danger">
        {{ error.phone_number }}
      </p>
    </div>

    <div class="col-md-4" v-if="context !== 'edit'">
      <Label :labelFor="'username'"> Username </Label>
      <Input
        :id="'username'"
        :type="'text'"
        v-model="formData.username"
        :disabled="readonly"
      />
      <p v-if="error?.username" class="text-danger">
        {{ error.username || "Username is required" }}
      </p>
    </div>

    <!-- Row 3: Password, Confirm Password -->
    <div class="col-md-6" v-if="context !== 'edit'">
      <Label :labelFor="'password'"> Password </Label>
      <Input :id="'password'" :type="'password'" v-model="formData.password" />
      <p v-if="error?.password" class="text-danger">
        {{ error.password || "Please choose a password you can remember" }}
      </p>
    </div>

    <div class="col-md-6" v-if="context !== 'edit'">
      <Label :labelFor="'confirm_password'"> Confirm Password </Label>
      <Input
        :id="'confirm_password'"
        :type="'password'"
        v-model="formData.confirm_password"
      />
      <p v-if="error?.confirm_password" class="text-danger">
        {{ error.confirm_password || "This field can not be blank" }}
      </p>
    </div>

    <!-- Row 4: Record Status (full width) -->
    <div class="col-12" v-if="formData.recordStatus">
      <Label :labelFor="'status'"> Status </Label>
      <div
        class="badge"
        :class="`bg-${formData.recordStatus.theme}`"
        id="status"
      >
        {{ formData.recordStatus.label }}
      </div>
    </div>

    <!-- Row 5: Submit Button -->
    <div v-if="!hideSubmit" class="col-12 text-center mt-3">
      <Button
        type="submit"
        customClass="btn btn-success d-inline-block"
        :disabled="isLoading"
      >
        {{ isLoading ? "Submitting..." : "Save" }}
      </Button>
    </div>
  </form>
</template>
