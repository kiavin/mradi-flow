import { defineStore } from 'pinia';
import { ref, unref, watch } from 'vue';

export const useOmnigridStore = defineStore('omnigridStore', () => {
    const expandedRows = ref(new Set());
    const allExpanded = ref(false);

    const pinnedColumns = ref({
        left: [],
        right: []
    });

    // Load pinned columns from localStorage
    const loadPinnedColumns = () => {
        const saved = localStorage.getItem('omnigrid-pinned-columns');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure we have valid arrays
                pinnedColumns.value.left = Array.isArray(parsed.left) ? parsed.left : [];
                pinnedColumns.value.right = Array.isArray(parsed.right) ? parsed.right : [];
            } catch (e) {
                console.error('Failed to parse pinned columns:', e);
            }
        }
    };

    // Save to localStorage whenever pinned columns change
    const savePinnedColumns = () => {
        localStorage.setItem('omnigrid-pinned-columns', JSON.stringify(pinnedColumns.value));
    };

    // Initialize
    loadPinnedColumns();

    // Watch for changes and save to localStorage
    watch(
        pinnedColumns,
        (newVal) => {
            savePinnedColumns();
        },
        { deep: true }
    );

    // Pin a column with order preservation
    const pinColumn = (columnKey, position) => {
        // Remove from other positions first
        pinnedColumns.value.left = pinnedColumns.value.left.filter(key => key !== columnKey);
        pinnedColumns.value.right = pinnedColumns.value.right.filter(key => key !== columnKey);

        if (position && position !== 'none') {
            // Add to the beginning of the array (so first pinned stays first)
            pinnedColumns.value[position] = [
                columnKey,
                ...pinnedColumns.value[position].filter(key => key !== columnKey)
            ];
        }
    };

    // Get pinned columns for a position in the correct order
    const getPinnedColumns = (position) => {
        return [...pinnedColumns.value[position]]; // Return a copy to prevent mutation
    };

    // Check if a column is pinned
    const isColumnPinned = (columnKey) => {
        return pinnedColumns.value.left.includes(columnKey) ||
            pinnedColumns.value.right.includes(columnKey);
    };

    // Get pin position of a column
    const getColumnPinPosition = (columnKey) => {
        if (pinnedColumns.value.left.includes(columnKey)) return 'left';
        if (pinnedColumns.value.right.includes(columnKey)) return 'right';
        return null;
    };

    // Get the index of a pinned column (for z-index calculations)
    const getPinnedColumnIndex = (columnKey) => {
        const leftIndex = pinnedColumns.value.left.indexOf(columnKey);
        if (leftIndex >= 0) return leftIndex;

        const rightIndex = pinnedColumns.value.right.indexOf(columnKey);
        if (rightIndex >= 0) return rightIndex;

        return -1;
    };

    const resetPinnedColumns = () => {
        pinnedColumns.value.left = [];
        pinnedColumns.value.right = [];
        localStorage.removeItem('omnigrid-pinned-columns');
    };


    // Row expansion methods (unchanged)
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
        pinnedColumns,
        pinColumn,
        getPinnedColumns,
        isColumnPinned,
        getColumnPinPosition,
        getPinnedColumnIndex,
        toggleRow,
        setRowExpanded,
        setAllExpanded,
        isRowExpanded,
        resetPinnedColumns
    };
});