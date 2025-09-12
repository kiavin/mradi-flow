<script setup>
const props = defineProps({
  clientBillingInformation: {
    type: Array,
  },
  billingInfo: {
    type: Array,
  },
})
</script>
<template>
  <div class="col section-card">
    <div class="section-header">
      <div class="add-icon-wrapper">
        <font-awesome-icon class="add-icon" :icon="['fas', 'file-invoice-dollar']" />
      </div>
      <h2 class="mb-0 text-white">Billing Information</h2>
    </div>

    <div class="section-content">
      <div class="billing-grid">
        <div class="billing-item">
          <h6>Payment Terms</h6>
          <p>{{ clientBillingInformation[0]?.payment_terms }}</p>
          <h6 class="mt-3">VAT Number</h6>
          <p>{{ clientBillingInformation[0]?.vat_number }}</p>
          <h6 class="mt-3">Tax Rate</h6>
          <p>{{ clientBillingInformation[0]?.tax_rate }} %</p>
        </div>

        <div class="billing-item">
          <h6>Currency</h6>
          {{ billingInfo[0]?.data?.dataPayload?.data?.name }}
          <h6 class="mt-3">Tax Jurisdiction</h6>
          {{ billingInfo[1]?.data?.dataPayload?.data?.name }}
          <h6 class="mt-3">Purchase Order Required</h6>
          <p>{{ clientBillingInformation[0].purchase_order_required ? 'Yes' : 'No' }}</p>
        </div>

        <div class="billing-item">
          <h6>Invoicing Email</h6>
          <p>{{ clientBillingInformation[0]?.invoicing_email }}</p>
          <h6 class="mt-3">Billing Address</h6>
          <p>{{ clientBillingInformation[0]?.billing_address }}</p>
          <div class="d-flex align-items-center mt-3">
            <span class="status-badge status-active">
              <font-awesome-icon
                class="fas fa-circle me-1"
                style="font-size: 8px"
                :icon="['fas', 'circle']"
              />
              {{ clientBillingInformation[0]?.status?.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 30px;
  transition: transform 0.3s ease;
}

.section-card:hover {
  transform: translateY(-3px);
}

.section-header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  color: white;
  padding: 18px 25px;
  display: flex;
  align-items: center;
}

.section-header {
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  color: white;
  padding: 18px 25px;
  display: flex;
  align-items: center;
}

/* New wrapper to match the section header gradient */
.add-icon-wrapper {
  background: linear-gradient(135deg, #4361ee, #3f37c9); /* same as .section-header */
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

/* icon style only, no need for background here */
.add-icon {
  font-size: 1.5rem;
  color: #ffffff;
}

.section-content {
  padding: 25px;
  overflow-x: auto;
}

.billing-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  height: 25vh;
}

.billing-item {
  min-width: 250px;
  max-width: 300px;
  flex: 0 0 auto;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #4361ee;
}

.billing-item h6 {
  color: #6c757d;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.billing-item p {
  margin-bottom: 0;
  font-weight: 500;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.status-active {
  background-color: rgba(76, 201, 240, 0.2);
  color: #0a9396;
}

@media (max-width: 768px) {
  .billing-grid {
    display: grid;
    grid-template-columns: 1fr;
    overflow-x: hidden;
  }

  .billing-item {
    min-width: 100%;
    max-width: 100%;
  }

  .section-content {
    padding: 20px;
  }
}
</style>
