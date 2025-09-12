<script setup>
import ClientBillingInfo from '../molecules/ClientBillingInfo.vue'
import ClientContactInfo from '../molecules/ClientContactInfo.vue'

const props = defineProps({
  clientInfo: {
    type: Object,
  },
  billingInfo: {
    type: Array,
  },
  isLoading: {
    type: Boolean,
  },
  isBatchLoading: {
    type: Boolean,
  },
})
</script>
<template>
  <div class="row2 client-info-container">
    <client-contact-info :clientContact="clientInfo?.ClientContact" />
    <client-billing-info
      :clientBillingInformation="clientInfo?.ClientBillingInformation"
      :billingInfo="billingInfo"
    />
  </div>
</template>
<style scoped>
.client-info-container {
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 20px; /* Fixed: should have units */
  justify-content: space-between;
}

/* Stack the components vertically on small screens */
@media (max-width: 768px) {
  .client-info-container {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>