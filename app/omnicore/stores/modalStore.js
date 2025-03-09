import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
    const isOpen = ref(false);
    const component = ref(null);
    const props = ref({});
    const title = ref('');

    function openModal(modalComponent = null, modalProps = {}, modalTitle = 'Modal Title') {
        component.value = modalComponent ? markRaw(modalComponent) : null;
        props.value = modalProps;
        title.value = modalTitle;
        isOpen.value = true;
    }

    function closeModal() {
        isOpen.value = false;
        component.value = null;
        props.value = {};
        title.value = '';
    }

    return { isOpen, component, props, title, openModal, closeModal };
});
