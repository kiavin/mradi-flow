<script setup>
import { ref, watch } from "vue";
import Vue3autocounter from "vue3-autocounter";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useRoute } from "vue-router";
import { useModalStore } from "~/omnicore/stores/modalStore.js";
import ExpenseDetailModal from "../../components/organisms/ExpenseDetailModal.vue";
import ContributionForm from "../ExpenseContribution/form.vue";

import Form from "../ProjectFinancier/form.vue";
import {
  fetchFinancierOptions,
  fetchExpenseOptions,
  fetchProjectExpenseOptions,
} from "../../utils/selectOptionFetcher";
import ExpenseForm from "../ProjectExpense/form.vue";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { prefix } from "@fortawesome/free-solid-svg-icons";

// Get project ID from route
const route = useRoute();
const projectId = ref("");
const errors = ref({});
const modalStore = useModalStore();
const financierOptions = ref([]);
const expenseOptions = ref([]);

// Format number
const formatNumber = (val) => Number(val).toLocaleString();

// Swiper cards - will update later with API values
const swiperItems = ref([]);
const totalFunding = ref(0);
const totalExpenses = ref(0);

// Contributors, Contributions, Expenses
const contributors = ref([]);
const contributions = ref([]);
const expenses = ref([]);
const projectDetails = ref({
  id: "",
  name: "",
  bid_amount: 0,
  balance: 0,
  total_contributors: 0,
});

// Funding Chart
const fundingChart = ref({
  series: [0, 0], // Funding %, Spending %
  options: {
    chart: {
      height: 230,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "18px",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    colors: ["#0d6efd", "#dc3545"], // Funding = blue, Spending = red
    labels: ["Funding", "Spending"],
    legend: { show: false },
  },
});

// Fetch project report
const fetchProjectReport = async () => {
  const id = route.params.id;
  console.log("endpoint", id);
  const endpoint = `/v1/project/report/project/${id}`;

  const {
    data: reportData,
    request: fetchReport,
    refresh,
    error: reportError,
  } = useApi(endpoint, {
    method: "GET",

    autoFetch: true,
    autoAlert: false,
  });

  await fetchReport();

  if (reportData.value?.dataPayload?.data) {
    const d = reportData.value.dataPayload.data;

    totalFunding.value = Number(d.total_contributions);
    totalExpenses.value = Number(d.allocated_expenses);

    projectDetails.value = {
      id: d.project_id,
      name: d.project_name,
      bid_amount: Number(d.bid_amount),
      balance: Number(d.balance),
      total_contributors: Number(d.total_contributors),
    };
    // Prepare swiper cards
    swiperItems.value = [
      {
        subTitle: "Project Bid Amount",
        amount: Number(d.bid_amount),
        icon: "file-invoice-dollar",
        color: "info",
        prefix: "KES ",
      },
      {
        subTitle: "Total Expenses",
        amount: Number(d.allocated_expenses),
        icon: "receipt",
        color: "danger",
        prefix: "KES ",
      },
      {
        subTitle: "Total Contributions",
        amount: Number(d.total_contributions),
        icon: "donate",
        color: "success",
        prefix: "KES ",
      },
      {
        subTitle: "Total Contributors",
        amount: Number(d.total_contributors),
        icon: "users",
        color: "primary",
        prefix: " ",
      },
    ];

    // Funding chart values (convert to percentages safely)
    const bidAmount = Number(d.bid_amount) || 1;
    const fundingPercent = Math.round(
      (Number(d.total_contributions) / bidAmount) * 100
    );
    const spendingPercent = Math.round(
      (Number(d.allocated_expenses) / bidAmount) * 100
    );
    fundingChart.value.series = [fundingPercent, spendingPercent];

    // Set contributors list
    contributors.value = (d.contributors || []).map((f) => ({
      name: f.financier_name,
      totalAmount: Number(f.total_contribution).toLocaleString(),
    }));

    // Contributions list
    contributions.value = (d.contributions || []).map((c) => {
      const contributor = c.financier_name || "N/A";
      const initials = contributor
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return {
        contributor,
        expense: c.expense_name,
        amount: Number(c.amount),
        date: new Date(c.created_at * 1000), // Convert from seconds to ms
        initials,
      };
    });

    // Expenses summary (optional: fake until backend supports it)
    expenses.value = (d.expenses || []).map((e) => ({
      id: e.expense_id,
      title: e.expense_name,
      total: Number(e.allocated_amount),
      contributed: Number(e.contributed_amount),
      color: "info",
    }));
  } else {
    console.warn("Failed to load project report:", reportError.value);
  }
};
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      projectId.value = newId;
      fetchProjectReport();
    }
  },
  { immediate: true }
);

const handleAddContributor = async () => {
  errors.value = {};
  modalStore.toggleModalUsage(true);

  console.log("project id ", projectId.value);

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: "project/projectfinancier/create" });
    return;
  }
  financierOptions.value = await fetchFinancierOptions();
  // Define form submission handler
  const handleSubmit = async (newData) => {
    const apiBaseUrl = `/v1/project/project-financier`;

    const { request: createData, error } = useApi(apiBaseUrl, {
      method: "POST",
      autoAlert: true,
    });

    await createData(newData);

    if (error.value) {
      console.log("Error", error.value);
      errors.value = error.value; // Assign errors to be passed to the form
      return;
    }
    // Close modal and show success message
    modalStore.closeModal();
  };

  // Open modal with Form component
  modalStore.openModal(
    Form,
    {
      formData: {}, // Empty form for creation
      error: errors, // Empty error object
      projectId: projectId.value,
      financierOptions: financierOptions.value,
      isLoading: false,
      readonly: false, // Allow input
      hideSubmit: false,
      onSubmit: handleSubmit, // Pass submission function
    },
    "Add ProjectFinancier"
  );
};

const handleViewExpense = async (id) => {
  modalStore.toggleModalUsage(true); // if you want to navigate to route set to false

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: "project/projectexpense/view", params: { id } });
    return;
  }

  const apiBaseUrl = `/v1/project/project-expense/${projectId.value}/summary/${id}`;

  const { data, request, isLoading, error } = useApi(apiBaseUrl, {
    method: "GET",
    options: {},
    autoFetch: true,
  });

  await request();

  expenseOptions.value = await fetchExpenseOptions();

  modalStore.openModal(
    ExpenseDetailModal,
    {
      expenseData: data.value?.dataPayload?.data || {},
    },
    "Expense Summary"
  );
};

const handleCreateExpense = async () => {
  errors.value = {};
  modalStore.toggleModalUsage(true);

  await nextTick(); // ensure store state is updated

  expenseOptions.value = await fetchExpenseOptions(projectId.value);

  if (!modalStore.useModal) {
    router.push({ name: "project/projectexpense/create" });
    return;
  }

  // Define form submission handler
  const handleSubmit = async (newData) => {
    const apiBaseUrl = `/v1/project/project-expense`;

    const { request: createData, error } = useApi(apiBaseUrl, {
      method: "POST",
      autoAlert: true,
    });

    await createData(newData);

    if (error.value) {
      console.log("Error", error.value);
      errors.value = error.value; // Assign errors to be passed to the form
      return;
    }

    // Close modal and show success message
    modalStore.closeModal();

    // uncomment if not using auto alert,, now its enabled in the use api ie autoAlert = true

    // proxy.$showAlert({
    //   title: 'Success',
    //   icon: 'success',
    //   text: data.value?.alertifyPayload?.message} ?? 'ProjectExpense Created successfully',
    //   showConfirmButton: false,
    //   timer: 2000,
    //   timerProgressBar: true,
    // })

    refresh();
  };

  // Open modal with Form component
  modalStore.openModal(
    ExpenseForm,
    {
      formData: {}, // Empty form for creation
      error: errors, // Empty error object
      expenseOptions: expenseOptions.value,
      projectId: projectId.value,
      isLoading: false,
      readonly: false, // Allow input
      hideSubmit: false,
      onSubmit: handleSubmit, // Pass submission function
    },
    "Create ProjectExpense"
  );
};

const handleCreateContribution = async () => {
  errors.value = {};
  modalStore.toggleModalUsage(true);

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: "project/expensecontribution/create" });
    return;
  }
  financierOptions.value = await fetchFinancierOptions();
  expenseOptions.value = await fetchExpenseOptions();

  // Define form submission handler
  const handleSubmit = async (newData) => {
    const apiBaseUrl = `/v1/project/expense-contribution`;

    const { request: createData, error } = useApi(apiBaseUrl, {
      method: "POST",
      autoAlert: true,
    });

    await createData(newData);

    if (error.value) {
      console.log("Error", error.value);
      errors.value = error.value; // Assign errors to be passed to the form
      return;
    }
    // Close modal and show success message
    modalStore.closeModal();
    refresh();
  };

  // Open modal with Form component
  modalStore.openModal(
    ContributionForm,
    {
      formData: {}, // Empty form for creation
      error: errors, // Empty error object
      financierOptions: financierOptions.value,
      projectId: projectId.value,
      isLoading: false,
      readonly: false, // Allow input
      hideSubmit: false,
      onSubmit: handleSubmit, // Pass submission function
    },
    "Create ExpenseContribution"
  );
};
</script>
<template>
  <div class="row">
    <div class="col-md-12 col-lg-12">
      <b-card
        class="p-4 mb-4 border-0 text-white"
        style="
          background:
            linear-gradient(rgba(0, 123, 255, 0.9), rgba(0, 123, 255, 0.9)),
            url(&quot;/storage/backgrounds/project-banner.jpg&quot;)
              center/cover no-repeat;
          border-radius: 0.75rem;
        "
      >
        <div
          class="d-flex align-items-center justify-content-between flex-wrap"
        >
          <!-- Icon + Name -->
          <div class="d-flex align-items-center">
            <!-- Building Icon -->
            <div
              class="rounded-circle bg-white bg-opacity-25 d-flex justify-content-center align-items-center me-3"
              style="width: 60px; height: 60px"
            >
              <font-awesome-icon icon="building" class="text-white fs-3" />
            </div>

            <!-- Project Info -->
            <div>
              <h3 class="mb-1 fw-bold text-white">{{ projectDetails.name }}</h3>
              <p class="mb-0 text-white-50 small">
                Project ID: #{{ projectDetails.id }}
              </p>
            </div>
          </div>

          <!-- Status Badge -->
          <b-badge variant="light" class="text-primary px-3 py-2 rounded-pill">
            Active
          </b-badge>
        </div>
      </b-card>

      <Swiper
        :slides-per-view="4"
        :space-between="32"
        navigation
        pagination
        loop
        class="d-slider1"
        style="padding-bottom: 20px"
        :breakpoints="{
          320: { slidesPerView: 1 },
          550: { slidesPerView: 2 },
          991: { slidesPerView: 3 },
          1400: { slidesPerView: 3 },
          1500: { slidesPerView: 4 },
          1920: { slidesPerView: 4 },
          2040: { slidesPerView: 4 },
          2440: { slidesPerView: 4 },
        }"
        :navigation="{
          nextEl: '#blog-tranding-next',
          prevEl: '#blog-tranding-prev',
        }"
      >
        <SwiperSlide v-for="(item, index) in swiperItems" :key="index">
          <b-card :class="`card bg-${item.color}-subtle`">
            <div class="d-flex justify-content-between align-items-center">
              <!-- Icon Section -->
              <div :class="`bg-${item.color}-subtle rounded p-3`">
                <font-awesome-icon
                  :icon="['fas', item.icon]"
                  class="icon-20 text-dark"
                />
              </div>

              <!-- Counter and Title -->
              <div class="text-end">
                <h4 class="counter">
                  <Vue3autocounter
                    :ref="`counter-${index}`"
                    :prefix= item.prefix
                    separator=","
                    :duration="1"
                    :startAmount="0"
                    :endAmount="parseFloat(item.amount)"
                  />
                </h4>
                <p class="mb-0 text-muted">{{ item.subTitle }}</p>
              </div>
            </div>
          </b-card>
        </SwiperSlide>
      </Swiper>
      <div
        class="swiper-button swiper-button-next"
        id="blog-tranding-next"
      ></div>
      <div
        class="swiper-button swiper-button-prev"
        id="blog-tranding-prev"
      ></div>
      <span
        class="swiper-notification"
        aria-live="assertive"
        aria-atomic="true"
      ></span>
    </div>
    <div class="col-md-12 col-lg-12 d-flex justify-content-between mb-4">
      <div class="col-auto">
        <button
          type="submit"
          class="btn btn-info"
          @click="handleCreateContribution"
        >
          + Contribution
        </button>
      </div>
      <div class="col-auto">
        <button
          type="submit"
          class="btn btn-primary"
          @click="handleAddContributor"
        >
          + Contributor
        </button>
      </div>
    </div>
    <div class="col-md-12 col-lg-9">
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <div
            class="overflow-hidden card aos-init aos-animate"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <!-- Card Header -->
            <div class="flex-wrap card-header">
              <div class="header-title d-flex justify-content-between">
                <div class="col-auto">
                  <h4 class="mb-2 card-title">Expenses</h4>
                </div>
                <div class="col-auto">
                  <button class="btn btn-primary" @click="handleCreateExpense">
                    + Expense
                  </button>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="p-0 card-body">
              <div
                class="mt-4 table-responsive mb-0"
                style="max-height: 580px; overflow-y: auto"
              >
                <table
                  id="expenses-table"
                  class="table mb-0 table-striped"
                  role="grid"
                >
                  <thead>
                    <tr>
                      <th>Expense</th>
                      <th>Total</th>
                      <th>Contributed</th>
                      <th>Remaining</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in expenses"
                      :key="index"
                      @click="handleViewExpense(item.id)"
                    >
                      <!-- Expense Title -->
                      <td>
                        <div class="d-flex align-items-center">
                          <div
                            class="rounded bg-primary-subtle img-fluid avatar-40 me-3 d-flex justify-content-center align-items-center text-uppercase fw-bold"
                            style="width: 40px; height: 40px"
                          >
                            {{ item.title.slice(0, 2) }}
                          </div>
                          <h6 class="mb-0">{{ item.title }}</h6>
                        </div>
                      </td>
                      <td>KES {{ item.total.toLocaleString() }}</td>

                      <!-- Amount Contributed -->
                      <td>KES {{ item.contributed.toLocaleString() }}</td>

                      <!-- Remaining Amount -->
                      <td>
                        KES
                        {{ (item.total - item.contributed).toLocaleString() }}
                      </td>

                      <!-- Progress Bar -->
                      <td>
                        <div class="mb-1 d-flex align-items-center">
                          <h6 class="mb-0 me-2">
                            {{
                              item.total > 0
                                ? (
                                    (item.contributed / item.total) *
                                    100
                                  ).toFixed(0)
                                : "0"
                            }}%
                          </h6>
                        </div>
                        <div
                          class="shadow-none progress bg-light"
                          style="height: 4px"
                        >
                          <div
                            class="progress-bar"
                            :class="`bg-${item.color}`"
                            role="progressbar"
                            :aria-valuenow="
                              (item.contributed / item.total) * 100
                            "
                            aria-valuemin="0"
                            aria-valuemax="100"
                            :style="`width: ${(item.contributed / item.total) * 100}%; transition: width 2s ease`"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 col-lg-3">
      <b-col>
        <b-card no-body>
          <b-card-header
            class="d-flex justify-content-between align-items-center"
          >
            <div class="header-title">
              <h4 class="card-title mb-0">Contributors</h4>
            </div>
          </b-card-header>

          <b-card-body>
            <div
              class="d-flex align-items-center gap-3 border-bottom pb-3 mb-3"
              v-for="(contributor, index) in contributors"
              :key="index"
            >
              <!-- Avatar -->
              <div>
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=3A57E8&color=fff&rounded=true&size=64`"
                  class="rounded-circle"
                  style="width: 50px; height: 50px"
                  alt="Contributor avatar"
                />
              </div>

              <!-- Info -->
              <div class="flex-grow-1">
                <h6 class="mb-0">{{ contributor.name }}</h6>

                <div class="fw-bold text-primary mt-1">
                  KES {{ contributor.totalAmount }}
                </div>
              </div>
            </div>

            <!-- If no contributors -->
            <div
              v-if="contributors.length === 0"
              class="text-center text-muted"
            >
              No contributors available.
            </div>
          </b-card-body>
        </b-card>
      </b-col>
    </div>
  </div>
</template>
