<script setup>
import { ref, watch } from "vue";
import { BTable, BFormInput } from "bootstrap-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const errors = ref([]);

// Props
const props = defineProps({
  modelValue: Boolean,
  expenseData: Object,
  onSubmit: Function,
});

const show = ref(props.modelValue);
watch(
  () => props.modelValue,
  (val) => (show.value = val)
);
watch(show, (val) => emit("update:modelValue", val));

// Format number
const format = (val) => Number(val).toLocaleString();

// Expense and contributions state
const expense = ref({});
const contributions = ref([]);
const emit = defineEmits(["contributions-updated"]);

// Format incoming data
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

    contributions.value = (data.contributions || []).map((c) => {
      const dateObj = new Date(c.date * 1000);
      return {
        contribution_id: c.contribution_id,
        financier_name: c.financier_name,
        amount: Number(c.amount),
        date: dateObj,
        dateFormatted: new Intl.DateTimeFormat("en-KE", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(dateObj),
      };
    });
  },
  { immediate: true }
);

// Table Fields
const fields = [
  { key: "financier_name", label: "Financier" },
  { key: "amount", label: "Amount (KES)" },
  { key: "date", label: "Date" },
];

const saving = ref(false);

// Save Handler
const handleSave = async () => {
  saving.value = true;
  errors.value = [];

  try {
    // 1. Track all update promises
    const updatePromises = contributions.value.map(async (c) => {
      const updatedData = {
        amount: c.amount,
        date: Math.floor(new Date(c.date).getTime() / 1000),
      };

      const apiBaseUrl = `/v1/project/expense-contribution/${c.contribution_id}`;
      const { request: updateData, error } = useApi(apiBaseUrl, {
        method: "PUT",
        autoAlert: true,
      });

      await updateData(updatedData);

      // 2. Handle errors for this contribution
      const serverErrors = error.value?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        for (const [field, msg] of Object.entries(serverErrors)) {
          errors.value.push({
            id: c.contribution_id,
            field,
            message: msg,
          });
        }
      } else if (error.value) {
        errors.value.push({
          id: c.contribution_id,
          message:
            error.value?.message ||
            error.value?.amount ||
            "Update failed",
        });
      }
    });

    // 3. Wait for all updates to finish
    await Promise.all(updatePromises);

    // 4. Show success only if no errors
    if (errors.value.length === 0) {
      emit("contributions-updated");
      setTimeout(() => {
        router.push({ name: "project/expense-contribution" });
      }, 1500);
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
    errors.value.push({
      general: "Something went wrong while saving. Please try again.",
    });
  } finally {
    saving.value = false;
  }
};

</script>

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
        <template #cell(date)="row">
          <span>{{ row.item.dateFormatted }}</span>
        </template>
      </b-table>
      <!-- 🔴 Errors Display -->
      <div v-if="errors.length > 0" class="mt-3">
        <div
          v-for="(error, index) in errors"
          :key="index"
          class="text-danger small d-flex align-items-start"
        >
          <i class="fas fa-exclamation-circle me-2 mt-1"></i>
          <span>
            <strong v-if="error.id">Contribution ID {{ error.id }}:</strong>
            <span v-if="error.field">[{{ error.field }}] </span>
            {{ error.message || "An error occurred." }}
          </span>
        </div>
      </div>
      <!-- Save Button -->
      <div class="text-end mt-3">
        <b-button variant="success" @click="handleSave" :disabled="saving">
          <i class="fas fa-save me-1"></i>
          {{ saving ? "Saving..." : "Save Changes" }}
        </b-button>
      </div>
    </div>
  </b-card>
</template>
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
