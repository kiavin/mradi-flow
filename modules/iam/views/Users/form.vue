
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
                    <Label :labelFor="'name'"> Role NAme </Label>
                    <Input :id="'name'" :type="'text'" v-model="formData.name" :disabled="readonly"/>
                    <p v-if="error?.name" class="text-danger">{{ error.name }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'description'"> Description </Label>
                    <Input :id="'description'" :type="'text'" v-model="formData.description" :disabled="readonly"/>
                    <p v-if="error?.description" class="text-danger">{{ error.description }}</p>
                </div>
                
                <div class="mb-2 form-group">
                    <Label :labelFor="'ruleName'"> Rule Name </Label>
                    <Input :id="'ruleName'" :type="'text'" v-model="formData.ruleName" :disabled="readonly"/>
                    <p v-if="error?.ruleName" class="text-danger">{{ error.ruleName }}</p>
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
    