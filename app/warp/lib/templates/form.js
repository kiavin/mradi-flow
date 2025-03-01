export default function formTemplate(name, properties) {
    const scriptSection = `
<script setup>
import { ref } from 'vue';
import Input from '@/components/atoms/inputs/Input.vue';
import Label from '@/components/atoms/Label.vue';
import Btn from '@/components/atoms/buttons/Button.vue'

const isLoading = ref(false)

// Define reactive properties
const formData = ref({
    ${Object.keys(properties).map((key) => `${key}: ''`).join(',\n    ')}
});

// Submit function
function onSubmit() {
    try {
    isLoading.value = true;
        console.log('Form Submitted:', formData.value);
        
    } catch (err) {
        console.error('Error submitting form:', err);
    } finally {
        isLoading.value = false;
    }
}
</script>
    `;

    const templateSection = `
        <template>
            <b-form @submit.prevent="onSubmit" class="row g-3">
                ${Object.entries(properties).map(([key, value]) => `
                <div class="mb-3 form-floating custom-form-floating form-group">
                    <Input :id="'${key}'" :type="'${mapInputType(value.type)}'" v-model="formData.${key}" />
                    <Label :labelFor="'${key}'"> ${value.title} </Label>
                </div>
                `).join('')}

                <div class="col-12">
                    <Btn variant="primary" type="submit"> Submit </Btn>
                </div>
            </b-form>
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

