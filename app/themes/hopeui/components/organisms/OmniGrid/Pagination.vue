<script setup>
import { computed } from 'vue'

const emit = defineEmits(['changePage'])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ paginationData: {} }),
  },
  position: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'rounded', 'circle'].includes(value),
  },
  showFirstLast: {
    type: Boolean,
    default: true,
  },
  showNumbers: {
    type: Boolean,
    default: true,
  },
  showTotal: {
    type: Boolean,
    default: true,
  },
  showRange: {
    type: Boolean,
    default: true,
  },
  bgColor: {
    type: String,
    default: null,
  },
  hoverBgColor: {
    type: String,
    default: null,
  },
  textColor: {
    type: String,
    default: null,
  },
  activeTextColor: {
    type: String,
    default: null,
  },

  maxVisiblePages: {
    type: Number,
    default: 5,
  },
})

const currentPage = computed(() => props.data.paginationData.currentPage || 1)
const perPage = computed(() => props.data.paginationData.perPage || 10)
const totalCount = computed(() => props.data.paginationData.totalCount || 0)
const totalPages = computed(() =>
  Math.max(1, props.data.paginationData.totalPages || Math.ceil(totalCount.value / perPage.value)),
)

const startItem = computed(() => (currentPage.value - 1) * perPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * perPage.value, totalCount.value))

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    emit('changePage', page)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Calculate range with ellipsis
    const half = Math.floor(maxVisible / 2)
    let start = current - half
    let end = current + half

    if (start < 1) {
      start = 1
      end = maxVisible
    } else if (end > total) {
      end = total
      start = total - maxVisible + 1
    }

    // Always show first page
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    // Middle range
    for (let i = start; i <= end; i++) {
      if (i > 0 && i <= total) pages.push(i)
    }

    // Always show last page
    if (end < total) {
      if (end < total - 1) pages.push('...')
      pages.push(total)
    }
  }

  return pages
})
</script>

<template>
  <div class="pagination-wrapper" :class="`justify-${position}`">
    <div v-if="(showTotal || showRange) && position !== 'center'" class="pagination-info">
      <span v-if="showTotal" class="total-items">Total: {{ totalCount }}</span>
      <span v-if="showRange" class="item-range">Showing {{ startItem }}-{{ endItem }}</span>
    </div>

    <nav class="pagination-nav">
      <ul :class="['pagination', `pagination-${variant}`]">
        <!-- First Page -->
        <li v-if="showFirstLast" class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="changePage(1)" title="First Page">
            <font-awesome-icon :icon="['fas', 'angles-left']" />
          </a>
        </li>

        <!-- Previous -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="changePage(currentPage - 1)" title="Previous">
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </a>
        </li>

        <!-- Numbered Pagination -->
        <!-- <template v-if="showNumbers">
          <li
            class="page-item"
            v-for="count in totalPages"
            :key="count"
            :class="{ active: count === currentPage }"
          >
            <a class="page-link" @click="changePage(count)">{{ count }}</a>
          </li>
        </template> -->
        <!-- Numbered Pagination -->
        <template v-if="showNumbers">
          <template v-for="(count, index) in visiblePages" :key="index">
            <li v-if="count === '...'" class="page-item disabled">
              <span class="page-link">...</span>
            </li>
            <li v-else class="page-item" :class="{ active: count === currentPage }">
              <a class="page-link" @click="changePage(count)">{{ count }}</a>
            </li>
          </template>
        </template>

        <!-- Next -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="changePage(currentPage + 1)" title="Next">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </a>
        </li>

        <!-- Last Page -->
        <li
          v-if="showFirstLast"
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
        >
          <a class="page-link" @click="changePage(totalPages)" title="Last Page">
            <font-awesome-icon :icon="['fas', 'angles-right']" />
          </a>
        </li>
      </ul>
    </nav>

    <div v-if="(showTotal || showRange) && position === 'center'" class="pagination-info">
      <span v-if="showTotal" class="total-items">Total: {{ totalCount }}</span>
      <span v-if="showRange" class="item-range">Showing {{ startItem }}-{{ endItem }}</span>
    </div>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
  gap: 1rem;
}

.justify-left {
  justify-content: flex-start;
}
.justify-center {
  justify-content: center;
}
.justify-right {
  justify-content: flex-end;
}

.pagination-info {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.pagination-nav {
  display: flex;
}

.pagination {
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
}

.page-item {
  margin: 0 0.125rem;
}

.page-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: v-bind('props.textColor || "inherit"');
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.page-link:hover {
  background-color: v-bind('props.hoverBgColor || "rgba(0, 0, 0, 0.05)"');
}

.page-item.active .page-link {
  background-color: v-bind('props.bgColor || "#0d6efd"');
  color: v-bind('props.activeTextColor || "white"');
  border-color: v-bind('props.bgColor || "#0d6efd"');
}

.page-item.disabled .page-link {
  opacity: 0.5;
  pointer-events: none;
}

/* Variant Styles */
.pagination-default .page-link {
  padding: 0.5rem 0.75rem;
}

.pagination-compact .page-link {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.pagination-rounded .page-link {
  border-radius: 0.25rem;
}

.pagination-circle .page-item {
  margin: 0 0.25rem;
}

.pagination-circle .page-link {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  padding: 0;
}

/* ellipsis */
.page-item.disabled .page-link {
  background: transparent;
  border-color: transparent;
  cursor: default;
}
</style>
