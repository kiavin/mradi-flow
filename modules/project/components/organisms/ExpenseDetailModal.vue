<template>
  <b-card no-body class="shadow rounded overflow-hidden mb-4 border-0">
    <!-- Expense Summary Card -->
    <div class="px-4 py-3 text-white" :style="`background-color: #1988FF`">
      <div class="row g-3 align-items-center">
        <div class="col-md-3 d-flex align-items-center">
          <i class="fas fa-tools fa-lg me-2"></i>
          <div>
            <div class="small text-white mb-2">Expense Name</div>
            <h6 class="mb-0">{{ expense.expense_name }}</h6>
          </div>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <i class="fas fa-coins fa-lg me-2"></i>
          <div>
            <div class="small text-white mb-2">Allocated</div>
            <h6 class="mb-0">KES {{ format(expense.allocated_amount) }}</h6>
          </div>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <i class="fas fa-donate fa-lg me-2"></i>
          <div>
            <div class="small text-white mb-2">Contributed</div>
            <h6 class="mb-0">KES {{ format(expense.contributed_amount) }}</h6>
          </div>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <i class="fas fa-wallet fa-lg me-2"></i>
          <div>
            <div class="small text-white mb-2">Balance</div>
            <h6 class="mb-0">KES {{ format(expense.balance) }}</h6>
          </div>
        </div>
      </div>
    </div>

    <!-- Contributions Table -->
    <div class="p-3">
      <b-table
        :items="contributions"
        :fields="fields"
        bordered
        striped
        responsive
        class=""
      >
        <!-- Amount Column Editable -->
        <template #cell(amount)="row">
          <b-form-input
            v-model="row.item.amount"
            type="number"
            min="0"
            class="form-control"
            placeholder="Enter amount"
          />
        </template>

        <!-- Date Column Editable -->
        <template>
          <flatpickr
            v-model="row.item.date"
            class="form-control"
            :config="{
              enableTime: true,
              dateFormat: 'Y-m-d H:i',
            }"
          />
        </template>
      </b-table>
    </div>
  </b-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { BTable, BFormInput } from "bootstrap-vue-next";
import Flatpickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
// Props
const props = defineProps({
  modelValue: Boolean,
  expenseData: Object,
});

// Emits
const emit = defineEmits(["update:modelValue", "save"]);

// Modal visibility sync
const show = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => (show.value = val)
);
watch(show, (val) => emit("update:modelValue", val));

// Helpers
const format = (val) => Number(val).toLocaleString();

// Expense details
const expense = ref({});
const contributions = ref([]);

// Watch and parse incoming data
watch(
  () => props.expenseData,
  (data) => {
    if (!data) return;

    expense.value = {
      expense_id: data.expense_id,
      expense_name: data.expense_name,
      allocated_amount: data.allocated_amount,
      contributed_amount: data.contributed_amount,
      balance: data.balance,
    };

    contributions.value = (data.contributions || []).map((c) => ({
      contribution_id: c.contribution_id,
      financier_name: c.financier_name,
      amount: Number(c.amount),
      date: new Date(c.date * 1000), // Date object for date picker
    }));
  },
  { immediate: true }
);

// Table fields
const fields = [
  { key: "financier_name", label: "Financier" },
  { key: "amount", label: "Amount (KES)" },
  { key: "date", label: "Date" },
];
</script>
<style scoped>
.fas {
  color: white;
  font-size: 1.2rem;
}
.bg-light {
  background-color: #f0f4ff !important;
}
.text-primary {
  color: #3a57e8 !important;
}
:deep(.table-responsive) {
  overflow: visible !important;
}

/* Make table rows taller for inputs */
:deep(.table td) {
  vertical-align: middle;
  min-height: 60px;
  padding: 12px;
}

/* Prevent b-card from clipping content */
:deep(.b-card) {
  overflow: visible !important;
}

/* Optional: Boost calendar z-index for modals or deep nesting */
:deep(.datepicker__calendar) {
  z-index: 3000 !important;
}
</style>
