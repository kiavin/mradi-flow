import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
    const isOpen = ref(false);
    const component = ref(null);
    const props = ref({});
    const title = ref('');
    const useModal = ref(true);
    const modalSize = ref('');

    function openModal(modalComponent = null, modalProps = {}, modalTitle = 'Modal Title', size = 'xl') {
        component.value = modalComponent ? markRaw(modalComponent) : null;
        props.value = modalProps;
        title.value = modalTitle;
        isOpen.value = true;
        modalSize.value = size;
    }

    function closeModal() {
        isOpen.value = false;
        component.value = null;
        props.value = {};
        title.value = '';
    }

    function toggleModalUsage(value) {
        useModal.value = value;
    }

    return { isOpen, component, useModal, modalSize, props, title, openModal, closeModal, toggleModalUsage };
});
