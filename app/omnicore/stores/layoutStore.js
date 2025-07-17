import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { layouts } from '~/themes/layouts.js';

export const useLayoutStore = defineStore('layoutStore', () => {
    const layout = shallowRef(null);

    const setLayout = (layoutName) => {
        layout.value = layouts[layoutName] || null;
    };

    return { layout, setLayout };
});
