<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  contributors: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  onSubmit: {
    type: Function,
    required: true,
  },
  errors: {
    type: Array,
    default: [],
  },
});

const emit = defineEmits(["remove"]);
/**
 * Filter contributors with names (guard against broken data)
 */
const filteredFinanciers = computed(() =>
  props.contributors?.filter((f) => f.financier_name)
);

/**
 * Get contributor initials
 */
const getInitials = (name) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .substring(0, 2);
};
/**
 * Format total contribution
 */
const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "Ksh 0.00";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(num);
};
/**
 * Check if a contributor is removable
 */
const isRemovable = (amount) => {
  return !amount || parseFloat(amount) === 0;
};
/**
 * Emit financier ID to be removed
 */
const onSubmit = (id) => {
    emit('submit', id); // Emit the form data to the parent
};
</script>

<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th scope="col">Contributor</th>
          <th scope="col">Name</th>
          <th scope="col">Total Contribution</th>
          <th scope="col" class="text-end">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="financier in filteredFinanciers"
          :key="financier. project_financier_id"
        >
          <!-- Contributor Avatar -->
          <td>
            <div class="avatar bg-primary text-white fw-bold">
              {{ getInitials(financier.financier_name) }}
            </div>
          </td>
          <!-- Name -->
          <td>{{ financier.financier_name }}</td>

          <!-- Total Contribution -->
          <td>{{ formatCurrency(financier.total_contribution) }}</td>

          <!-- Remove Button -->
          <td class="text-end">
            <button
              v-if="isRemovable(financier.total_contribution)"
              class="btn btn-sm btn-outline-danger"
              @click="onSubmit(financier. project_financier_id)"
              id="remove-btn-{{ financier. project_financier_id }}"
            >
              <font-awesome-icon :icon="['fas', 'trash-alt']" />
            </button>

            <!-- Tooltip bound to button above -->
            <b-tooltip
              :target="'remove-btn-' + financier. project_financier_id"
              title="Remove Contributor"
              placement="top"
              triggers="hover focus"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
