import { defineStore } from 'pinia';
import { ref, unref } from 'vue';

export const useOmnigridStore = defineStore('omnigridStore', () => {
    const expandedRows = ref(new Set());
    const allExpanded = ref(false);

    const toggleRow = (rowKey) => {
        if (expandedRows.value.has(rowKey)) {
            expandedRows.value.delete(rowKey);
        } else {
            expandedRows.value.add(rowKey);
        }
    };

    const setRowExpanded = (rowKey, expand) => {
        if (expand) {
            expandedRows.value.add(rowKey);
        } else {
            expandedRows.value.delete(rowKey);
        }
    };

    const setAllExpanded = (rows, expand) => {
        rows = unref(rows);

        allExpanded.value = expand;

        if (!Array.isArray(rows)) {
            console.warn('setAllExpanded expects an array, received:', typeof rows, rows);
            expandedRows.value = new Set();
            return;
        }

        expandedRows.value = expand
            ? new Set(rows.map((row, index) => row?.id ?? index))
            : new Set();
    };

    const isRowExpanded = (rowKey) => {
        return expandedRows.value.has(rowKey);
    };

    return {
        expandedRows,
        allExpanded,
        toggleRow,
        setRowExpanded,
        setAllExpanded,
        isRowExpanded
    };
});
