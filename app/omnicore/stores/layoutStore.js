import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { layouts } from '~/themes/layouts.js';

export const useLayoutStore = defineStore('layoutStore', () => {
    // const layout = shallowRef(layouts.default); 
    const layout = shallowRef(null);

    const setLayout = (layoutName) => {
        // layout.value = layouts[layoutName] || layouts.default;
        layout.value = layouts[layoutName] || null;
        // layout.value = layoutName === 'none' ? null : layouts[layoutName] || layouts.default;
    };

    return { layout, setLayout };
});
