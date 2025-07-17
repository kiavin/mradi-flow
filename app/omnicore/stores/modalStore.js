import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';

export const useModalStore = defineStore('modalStore', () => {
    const isOpen = ref(false);
    const component = ref(null);
    const props = ref({});
    const title = ref('');
    const useModal = ref(true);
    const modalSize = ref('');
    const showFooter = ref(false)

    const fullscreen = ref(false)
    const centered = ref(false)
    const scrollable = ref(false)

    function openModal(modalComponent = null, modalProps = {}, modalTitle = 'Modal Title', size = 'lg', footer = false, options = { centered: false, scrollable: false, fullscreen: false }) {
        component.value = modalComponent ? markRaw(modalComponent) : null;
        props.value = modalProps;
        title.value = modalTitle;
        isOpen.value = true;
        showFooter.value = footer;

        fullscreen.value = options.fullscreen;
        centered.value = options.centered;
        scrollable.value = options.scrollable;

        const allowedSizes = ['sm', 'lg', 'xl'];
        modalSize.value = allowedSizes.includes(size) ? size : '';
    }

    function closeModal() {
        isOpen.value = false;
        component.value = null;
        props.value = {};
        title.value = '';
        showFooter.value = false;
    }

    function toggleModalUsage(value) {
        useModal.value = value;
    }

    return { isOpen, showFooter, component, useModal, modalSize, props, centered, fullscreen, scrollable, title, openModal, closeModal, toggleModalUsage };
});
