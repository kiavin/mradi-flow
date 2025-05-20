
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
                    <Label :labelFor="'id'"> Id </Label>
                    <Input :id="'id'" :type="'number'" v-model="formData.id" :disabled="readonly"/>
                    <p v-if="error?.id" class="text-danger">{{ error.id }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'user_id'"> User id </Label>
                    <Input :id="'user_id'" :type="'number'" v-model="formData.user_id" :disabled="readonly"/>
                    <p v-if="error?.user_id" class="text-danger">{{ error.user_id }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'data'"> Data </Label>
                    <Input :id="'data'" :type="'text'" v-model="formData.data" :disabled="readonly"/>
                    <p v-if="error?.data" class="text-danger">{{ error.data }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'is_deleted'"> Is deleted </Label>
                    <Input :id="'is_deleted'" :type="'number'" v-model="formData.is_deleted" :disabled="readonly"/>
                    <p v-if="error?.is_deleted" class="text-danger">{{ error.is_deleted }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'status'"> Status </Label>
                    <Input :id="'status'" :type="'number'" v-model="formData.status" :disabled="readonly"/>
                    <p v-if="error?.status" class="text-danger">{{ error.status }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'created_at'"> Created at </Label>
                    <Input :id="'created_at'" :type="'number'" v-model="formData.created_at" :disabled="readonly"/>
                    <p v-if="error?.created_at" class="text-danger">{{ error.created_at }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'updated_at'"> Updated at </Label>
                    <Input :id="'updated_at'" :type="'number'" v-model="formData.updated_at" :disabled="readonly"/>
                    <p v-if="error?.updated_at" class="text-danger">{{ error.updated_at }}</p>
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
    