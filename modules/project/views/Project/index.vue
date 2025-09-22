<script setup>
import { onMounted, ref, watch, getCurrentInstance, nextTick } from "vue";
import { useRouter } from "vue-router";
import Button from "~/themes/hopeui/components/atoms/button/BaseButton.vue";
import { useModalStore } from "~/omnicore/stores/modalStore.js";
import Form from "./form.vue";
import { fetchProjectFinancierOptions } from "../../utils/selectOptionFetcher";

const { proxy } = getCurrentInstance();
const router = useRouter();
const isModalLoading = ref(true); // Initially loading
const editingData = ref(null);
const ProjectFinancierOptions = ref(null);
const modalStore = useModalStore();

const apiBaseUrl = `/v1/project/projects`;

const { data, request, refresh, isLoading, error } = useApi(apiBaseUrl, {
  method: "GET",
  options: {},
  autoFetch: false,
});

const tableData = ref({
  data: [],
  paginationData: {
    countOnPage: 0,
    currentPage: 1,
    perPage: 25,
    totalCount: 0,
    totalPages: 0,
    paginationLinks: {},
  },
});

const tableColumns = [
  { key: "name", label: "Name", class: "text-center" },
  { key: "bid_amount", label: "Bid Amount", class: "text-center" },
  {
    key: "total_expense_amount",
    label: "Total Expenses",
    class: "text-center",
  },
  {
    key: "total_contributed_amount",
    label: "Total Contributions",
    class: "text-center",
  },
  {
    key: "deficit",
    label: "Deficit",
    class: "text-center",
  },
];
const formatCurrency = (val) => {
  const num = Number(val);
  if (isNaN(num)) return "-";
  return num.toLocaleString("en-KE"); // e.g. 1,234,567
};

const financiersUrl = `/v1/project/financiers`;
const financierOptions = ref([]); // store the fetched financiers
watch(data, () => {
  updateResponseData();
});
const updateResponseData = () => {
  // console.log("NEW DATA ON PAGINATION", data.value)
  if (data.value?.dataPayload) {
    // Transform the object data into an array if needed
    const responseData = data.value.dataPayload.data;
    let formattedData = [];
    let rawData = [];

    if (typeof responseData === "object" && !Array.isArray(responseData)) {
      // Convert object to array if API returns object
      formattedData = Object.values(responseData);
    } else if (Array.isArray(responseData)) {
      rawData = responseData;

      formattedData = rawData.map((item) => {
        const totalExpenses = Number(item.total_expense_amount) || 0;
        const totalContributions = Number(item.total_expenses) || 0;
        const deficit = totalExpenses - totalContributions;

        return {
          ...item,
          bid_amount: Number(item.bid_amount) || 0,
          total_expense_amount: totalExpenses,
          total_expenses: totalContributions,
          deficit, // 👈 add this
        };
      });
    }

    tableData.value = {
      data: formattedData,
      paginationData: {
        countOnPage: data.value.dataPayload.countOnPage || 0,
        currentPage: data.value.dataPayload.currentPage || 1,
        perPage:
          data.value.dataPayload.perPage ||
          tableData.value.paginationData.perPage,
        totalCount: data.value.dataPayload.totalCount || 0,
        totalPages: data.value.dataPayload.totalPages || 0,
        paginationLinks: data.value.dataPayload.paginationLinks || {},
      },
    };
    // console.log('Updated tableData:', JSON.parse(JSON.stringify(tableData.value)))
  }
};

const handleView = async (row) => {
  const id = row.id;
  //redirect to project dash and pass id as param
  router.push({ name: "projectDashboard", params: { id: id } });

  // const apiBaseUrl = `/v1/project/project/${id}`

  // const { data, request, isLoading, error } = useApi(apiBaseUrl, {
  //   method: 'GET',
  //   options: {},
  //   autoFetch: true,
  // })

  // await request()

  // // ✅ Fetch financiers data
  // const {
  //   data: financiersData,
  //   request: fetchFinanciers,
  //   error: financiersError,
  // } = useApi(financiersUrl, { method: 'GET', autoFetch: true, autoAlert: false })

  // await fetchFinanciers()

  // if (financiersData.value?.dataPayload?.data) {
  //   financierOptions.value = financiersData.value.dataPayload.data.map((financier) => ({
  //     value: financier.id,
  //     label: financier.name,
  //   }))
  // } else {
  //   console.warn('Could not load financiers:', financiersData.value)
  // }
  // console.log('Financier Options:', financierOptions.value)

  // modalStore.openModal(
  //   Form,
  //   {
  //     formData: data.value?.dataPayload?.data || {},
  //     error,
  //     Financiers: financierOptions.value, // Pass fetched financiers
  //     isLoading,
  //     readonly: true,
  //     hideSubmit: true,
  //   },
  //   'View Project',
  // )
};

const errors = ref({});
// const handleEdit = async (row) => {
//   const id = row.id;
//   errors.value = {};

//   modalStore.toggleModalUsage(true); // if you want to navigate to route set to false

//   await nextTick(); // ensure store state is updated

//   if (!modalStore.useModal) {
//     // Navigate to the update page
//     router.push({ name: "project/project/update", params: { id } });
//     return;
//   }

//     // ✅ Open modal **immediately with loader**
//   modalStore.openModal(
//     Form,
//     {
//       formData: editingData, // this is a ref, initially null
//       Financiers: financierOptions, // ref
//       error: errors,
//       isLoading: isModalLoading,
//       prefill: true,
//       readonly: false,
//       hideSubmit: false,
//       onSubmit: handleSubmit,
//     },
//     "Edit Project"
//   )

//   // Fetch appointment data before opening the modal
//   const apiBaseUrl = `/v1/project/project/${id}`;
//   const { data, request, isLoading, error } = useApi(apiBaseUrl, {
//     method: "GET",
//     options: {},
//     autoFetch: true,
//     autoAlert: true,
//   });
//   await request(); // Fetch data before opening modal
//   // financierOptions.value = fetchProjectFinancierOptions(id);

//    financierOptions.value = await fetchProjectFinancierOptions(id)

//   // ✅ Fetch financiers data

//   // Function to handle form submission (Update API Call)
//   const handleSubmit = async (updatedData) => {
//     const { request: updateData, error } = useApi(apiBaseUrl, {
//       method: "PUT",
//     });
//     await updateData(updatedData);
//     if (error.value) {
//       console.log("Error", error.value);
//       errors.value = error.value; // Assign the error object to errors
//       return; // Stop execution if error occurs
//     }

//     // Close modal on success
//     modalStore.closeModal();

//     refresh();
//   };

//   // Open modal with Form component
//   // modalStore.openModal(
//   //   Form,
//   //   {
//   //     formData: data.value?.dataPayload?.data || {},
//   //     Financiers: financierOptions.value, // Pass fetched financiers
//   //     error: errors,
//   //     prefill: true,
//   //     isLoading,
//   //     readonly: false, // Allow editing
//   //     hideSubmit: false,
//   //     onSubmit: handleSubmit, // Pass the submission function
//   //   },
//   //   "Edit Project"
//   // );
// };
const handleEdit = async (row) => {
  const id = row.id;
  errors.value = {};

  modalStore.toggleModalUsage(true); // Allow modal usage
  await nextTick();

  // If modals disabled, fallback to routing
  if (!modalStore.useModal) {
    router.push({ name: "project/project/update", params: { id } });
    return;
  }
  const handleSubmit = async (updatedData) => {
    const { request: updateData, error } = useApi(apiBaseUrl, {
      method: "PUT",
    });
    await updateData(updatedData);
    if (error.value) {
      console.log("Error", error.value);
      errors.value = error.value; // Assign the error object to errors
      return; // Stop execution if error occurs
    }

    // Close modal on success
    modalStore.closeModal();

    refresh();
  };
  // ✅ Open modal **immediately with loader**
  modalStore.openModal(
    Form,
    {
      formData: editingData, // this is a ref, initially null
      error: errors,
      isLoading: isModalLoading,
      prefill: true,
      Financiers: financierOptions,
      readonly: false,
      hideSubmit: false,
      onSubmit: handleSubmit,
    },
    "Edit Project"
  );
  const apiBaseUrl = `/v1/project/project/${id}`;
  const { data, request, error } = useApi(apiBaseUrl, {
    method: "GET",
    autoFetch: true,
    autoAlert: true,
  });
  try {
    isModalLoading.value = true;
    await request(), (editingData.value = data?.value?.dataPayload?.data || {});

    const {
      data: financiersData,
      request: fetchFinanciers,
      error: financiersError,
    } = useApi(financiersUrl, {
      method: "GET",
      autoFetch: true,
      autoAlert: false,
    });

    await fetchFinanciers();

    if (Array.isArray(financiersData.value?.dataPayload?.data)) {
      financierOptions.value = financiersData.value.dataPayload.data.map(
        (financier) => ({
          value: financier.id,
          label: financier.name,
        })
      );
    } else {
      console.warn("Could not load financiers:", financiersData.value);
    }
  } catch (e) {
    console.error("Failed to fetch edit data", e);
    errors.value.general = "Could not load project data.";
  } finally {
    isModalLoading.value = false; // Unblock form
  }
};

const handleCreate = async () => {
  errors.value = {};
  modalStore.toggleModalUsage(true);

  await nextTick(); // ensure store state is updated

  if (!modalStore.useModal) {
    router.push({ name: "project/project/create" });
    return;
  }

  // ✅ Fetch financiers data
  const {
    data: financiersData,
    request: fetchFinanciers,
    error: financiersError,
  } = useApi(financiersUrl, {
    method: "GET",
    autoFetch: true,
    autoAlert: false,
  });

  await fetchFinanciers();

  if (Array.isArray(financiersData.value?.dataPayload?.data)) {
    financierOptions.value = financiersData.value.dataPayload.data.map(
      (financier) => ({
        value: financier.id,
        label: financier.name,
      })
    );
  } else {
    console.warn("Could not load financiers:", financiersData.value);
  }

  // Define form submission handler
  const handleSubmit = async (newData) => {
    const apiBaseUrl = `/v1/project/project`;

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
    Form,
    {
      formData: {}, // Empty form for creation
      error: errors, // Empty error object
      Financiers: financierOptions.value, // Pass fetched financiers
      isLoading: false,
      readonly: false, // Allow input
      hideSubmit: false,
      onSubmit: handleSubmit, // Pass submission function
    },
    "Create Project"
  );
};

const handleDelete = async (row) => {
  const id = row.id;
  const is_deleted = row.is_deleted;
  const action = is_deleted ? "Restore" : "Delete";

  const confirmationText = is_deleted
    ? "You are about to restore this record. Do you want to proceed?"
    : "You are about to delete this record. Do you want to proceed?";

  const result = await proxy.$showAlert({
    title: "Are you sure?",
    text: confirmationText,
    icon: "warning",
    showConfirmButton: true,
    confirmButtonText: `Yes, ${action} it!`,
    cancelButtonText: "No, cancel!",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      // console.log('Deleting record with ID:', id)

      // autoFetch.value = false
      const { data, request, isLoading } = useApi(`/v1/project/project/${id}`, {
        method: "DELETE",
      });

      await request();

      if (data.value) {
        await proxy.$showAlert({
          title: `${action}d!`,
          text:
            data.value?.alertifyPayload?.message ||
            "Record deleted successfully",
          icon: "success",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("Error deleting record:", error);
      await proxy.$showAlert({
        title: "Error!",
        text: `Error deleting record: ${error.value}`,
        icon: "error",
        showCancelButton: false,
      });
    } finally {
      await refresh();
    }
  } else {
    console.log("Deletion cancelled");
  }
  // await refresh()
};

const handleSearch = (query) => {
  request(null, {
    page: tableData.value.paginationData.currentPage,
    "per-page": tableData.value.paginationData.perPage,
    q: query,
  });
};

const changePage = async (page) => {
  await request(null, {
    page,
    "per-page": tableData.value.paginationData.perPage,
  });

  updateResponseData();
};

const updatePerPage = async (perPage) => {
  tableData.value.paginationData.perPage = perPage;
  await request(null, {
    page: tableData.value.paginationData.currentPage,
    "per-page": perPage,
  });
  updateResponseData();
};

const customAction = [
  // {
  //   key: 'Manage',
  //   label: 'Manage',
  //   icon: ['fas', 'shield'],
  //   callback : (row) => handleView(row),
  //   show: true,
  //   colorClass: 'sucess'
  // },
  //  {
  //   key: 'delete',
  //   label: 'Delete',
  //   icon: ['fas', 'trash'],
  //   callback : (row) => handleView(row),
  //   show: true,
  //   colorClass: 'sucess'
  // }
];

onMounted(() => {
  request().then(() => {
    updateResponseData();
  });
});
</script>
<template>
  <div class="card p-3">
    <div class="row d-flex justify-content-between align-items-center mb-3">
      <div class="col-auto">
        <h1 class="h4 mt-2">List of Project</h1>
      </div>
      <div class="col-auto mb-4">
        <Button
          type="submit"
          customClass="btn btn-primary"
          @click="handleCreate"
        >
          New Project
        </Button>
      </div>

      <OmniGridView
        :columns="tableColumns"
        :data="tableData"
        :loading="isLoading"
        action-layout="inline"
        :pagination-config="{
          variant: 'circle',
          position: 'right',
          bgColor: '#4f46e5',
          hoverBgColor: '#6366f1',
          textColor: '#374151',
          activeTextColor: '#ffffff',
          showFirstLast: true,
          showNumbers: true,
          showTotal: true,
          showRange: true,
        }"
        :toolbar="{
          show: false,
          // showCreateButton: false,
        }"
        :expandable-rows="false"
        :filtering="false"
        rowSize="sm"
        :striped="false"
        :dropDownPerPageOptions="[5, 10, 25, 50]"
        :multi-select="false"
        :radio-select="false"
        :break-extra-columns="false"
        :search-in-backend="true"
        :showEdit="true"
        :showDelete="false"
        :actions="customAction"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @search="handleSearch"
        @changePage="changePage"
        @update:perPage="updatePerPage"
        @refresh="request"
      >
        <template #left-buttons>
          <Button
            class="btn btn-success btn-sm"
            @click="handleCreate"
            style="font-size: 1.2rem"
          >
            <template #icon>
              <font-awesome-icon :icon="['fas', 'plus']" />
            </template>
            New Project
          </Button>
        </template>
        <template #column-bid_amount="{ row }">
          <div
            class="text-end font-monospace"
            style="
              font-variant-numeric: tabular-nums;
              max-width: 150px !important;
            "
          >
            {{ formatCurrency(row.bid_amount) }}
          </div>
        </template>

        <template #column-total_expense_amount="{ row }">
          <div
            class="text-end font-monospace"
            style="
              font-variant-numeric: tabular-nums;
              max-width: 150px !important;
            "
          >
            {{ formatCurrency(row.total_expense_amount) }}
          </div>
        </template>

        <template #column-total_contributed_amount="{ row }">
          <div
            class="text-end font-monospace"
            style="
              font-variant-numeric: tabular-nums;
              max-width: 150px !important;
            "
          >
            {{ formatCurrency(row.total_contributed_amount) }}
          </div>
        </template>

        <template #column-deficit="{ row }">
          <div
            class="text-end font-monospace"
            style="
              font-variant-numeric: tabular-nums;
              max-width: 150px !important;
            "
          >
            {{ formatCurrency(row.deficit) }}
          </div>
        </template>
      </OmniGridView>
    </div>
  </div>
</template>

<style scoped></style>
