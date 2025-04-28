<script setup>
import { computed } from 'vue'

const emit = defineEmits(['changePage', 'update:perPage'])

const props = defineProps({
  data: {
    type: Object,
    required: true,
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
  bgColor: String,
  hoverBgColor: String,
  textColor: String,
  activeTextColor: String,
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
})

const currentPage = computed(() => props.data.currentPage || 1)
const perPage = computed(() => props.data.perPage || 10)
const totalCount = computed(() => props.data.totalCount || 0)

const totalPages = computed(() => {
  if (props.data.totalPages) {
    return props.data.totalPages
  }
  // return Math.max(1, Math.ceil(totalCount.value / perPage.value))
  return props.data.totalPages

})

const startItem = computed(() => (currentPage.value - 1) * perPage.value + 1)
const endItem = computed(() => Math.min(currentPage.value * perPage.value, totalCount.value))

const changePage = (page) => {
  if (page >= 1 && page <= props.data.totalPages) {
    emit('changePage', page)
  }
}

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    const half = Math.floor(maxVisible / 2)
    let start = current - half
    let end = current + half

    if (start < 1) {
      start = 1
      end = maxVisible
    }
    if (end > total) {
      end = total
      start = total - maxVisible + 1
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) {
        pages.push('...')
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < total) {
      if (end < total - 1) {
        pages.push('...')
      }
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
        <template v-if="showNumbers">
          <template v-for="(count, index) in visiblePages" :key="index">
            <li v-if="count === '...'" class="page-item disabled">
              <span class="page-link dots">
                <slot name="dots">...</slot>
              </span>
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
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
  gap: 0.5rem;
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
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.pagination-nav {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px; /* Space for scrollbar */
}

.pagination {
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.125rem;
}

.page-item {
  margin: 0;
  flex-shrink: 0;
}

.page-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: v-bind('props.textColor || "inherit"');
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-width: 2rem;
  text-align: center;
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
  padding: 0.375rem 0.5rem;
}

.pagination-compact .page-link {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
}

.pagination-rounded .page-link {
  border-radius: 0.25rem;
}

.pagination-circle .page-item {
  margin: 0 0.125rem;
}

.pagination-circle .page-link {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  padding: 0;
}

/* ellipsis */
.page-item.disabled .page-link.dots {
  background: transparent;
  border-color: transparent;
  cursor: default;
  min-width: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .pagination-wrapper {
    gap: 0.25rem;
  }
  
  .pagination-info {
    font-size: 0.8rem;
    gap: 0.25rem;
  }
  
  .pagination-default .page-link {
    padding: 0.25rem 0.375rem;
    font-size: 0.85rem;
  }
  
  .pagination-compact .page-link {
    padding: 0.15rem 0.3rem;
    font-size: 0.75rem;
  }
  
  .pagination-circle .page-link {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .page-link {
    min-width: 1.75rem;
  }
}

@media (max-width: 400px) {
  .pagination-default .page-link {
    padding: 0.2rem 0.3rem;
    font-size: 0.8rem;
  }
  
  .pagination-compact .page-link {
    padding: 0.1rem 0.2rem;
    font-size: 0.7rem;
  }
  
  .pagination-circle .page-link {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .page-link {
    min-width: 1.5rem;
  }
  
  .showFirstLast {
    display: none;
  }
}
</style>