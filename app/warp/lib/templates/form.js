export default function formTemplate(name, properties) {
    const scriptSection = `
<script setup>
import { ref } from 'vue';
import Input from '~/themes/hopeui/components/atoms/input/BaseInput.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Label from '~/themes/hopeui/components/atoms/labels/BaseLabel.vue'

const props = defineProps({
    formData: Object,
    error: Object, 
    isLoading: Boolean 
});

const emit = defineEmits(['submit', 'update']);

const onSubmit = () => {
    emit('submit', props.formData); // Emit the form data to the parent
};
</script>
    `;

    const templateSection = `
        <template>
            <form @submit.prevent="onSubmit" class="row g-3">
                ${Object.entries(properties).map(([key, value]) => `
                <div class="mb-2 form-group">
                    <Label :labelFor="'${key}'"> ${value.title} </Label>
                    <Input :id="'${key}'" :type="'${mapInputType(value.type)}'" v-model="formData.${key}" />
                    <p v-if="error?.formData?.${key}" class="text-danger">{{ error.formData.${key} }}</p>
                </div>
                `).join('')}
                
                <div class="text-center mt-3">
            <Button 
                type="submit" 
                customClass="btn btn-success d-inline-block" 
                :disabled="isLoading"
            >
                {{ isLoading ? 'Submitting...' : '${name}' }}
            </Button>
        </div>
            </form>
        </template>
    `;

    return `${scriptSection} \n ${templateSection}`;
}

// Function to map JSON schema types to input types
function mapInputType(type) {
    const typeMap = {
        integer: 'number',
        int: 'number',
        string: 'text',
        boolean: 'checkbox'
    };
    return typeMap[type] || 'text';
}

const formatLabel = (propertyName) => {
    return propertyName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

