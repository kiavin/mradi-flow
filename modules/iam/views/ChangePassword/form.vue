
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
            <form @submit.prevent="onSubmit" class="row g-3">
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'currentPassword'"> Current Password </Label>
                    <Input :id="'currentPassword'" :type="'text'" v-model="formData.currentPassword" :disabled="readonly"/>
                    <p v-if="error?.currentPassword" class="text-danger">{{ error.currentPassword }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'newPassword'"> New Password </Label>
                    <Input :id="'newPassword'" :type="'text'" v-model="formData.newPassword" :disabled="readonly"/>
                    <p v-if="error?.newPassword" class="text-danger">{{ error.newPassword }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'confirmNewPassword'"> Confirm New Password </Label>
                    <Input :id="'confirmNewPassword'" :type="'text'" v-model="formData.confirmNewPassword" :disabled="readonly"/>
                    <p v-if="error?.confirmNewPassword" class="text-danger">{{ error.confirmNewPassword }}</p>
                </div>
                
                
                <div v-if="!hideSubmit" class="text-center mt-3">
            <Button 
                type="submit" 
                customClass="btn btn-success d-inline-block" 
                :disabled="isLoading"
            >
                {{ isLoading ? 'Submitting...' : 'Save' }}
            </Button>
        </div>
            </form>
        </template>
    