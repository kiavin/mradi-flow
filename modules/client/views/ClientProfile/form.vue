
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
      <Label :labelFor="'client_name'"> Client Name </Label>
      <Input
        :id="'client_name'"
        :type="'text'"
        v-model="formData.client_name"
        :disabled="readonly"
      />
      <p v-if="error?.client_name" class="text-danger">{{ error.client_name }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'mobile_number'"> Mobile Number </Label>
      <Input
        :id="'mobile_number'"
        :type="'text'"
        v-model="formData.mobile_number"
        :disabled="readonly"
      />
      <p v-if="error?.mobile_number" class="text-danger">{{ error.mobile_number }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'email_address'"> Email Address </Label>
      <Input
        :id="'email_address'"
        :type="'text'"
        v-model="formData.email_address"
        :disabled="readonly"
      />
      <p v-if="error?.email_address" class="text-danger">{{ error.email_address }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'physical_location'"> Physical Location </Label>
      <Input
        :id="'physical_location'"
        :type="'text'"
        v-model="formData.physical_location"
        :disabled="readonly"
      />
      <p v-if="error?.physical_location" class="text-danger">{{ error.physical_location }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'ClientContact'"> undefined </Label>
      <Input
        :id="'ClientContact'"
        :type="'text'"
        v-model="formData.ClientContact"
        :disabled="readonly"
      />
      <p v-if="error?.ClientContact" class="text-danger">{{ error.ClientContact }}</p>
    </div>

    <div class="mb-2 form-group">
      <Label :labelFor="'ClientBillingInformation'"> undefined </Label>
      <Input
        :id="'ClientBillingInformation'"
        :type="'text'"
        v-model="formData.ClientBillingInformation"
        :disabled="readonly"
      />
      <p v-if="error?.ClientBillingInformation" class="text-danger">
        {{ error.ClientBillingInformation }}
      </p>
    </div>

    <div v-if="!hideSubmit" class="text-center mt-3">
      <Button type="submit" customClass="btn btn-success d-inline-block" :disabled="isLoading">
        {{ isLoading ? 'Submitting...' : 'Save' }}
      </Button>
    </div>
  </form>
</template>
    