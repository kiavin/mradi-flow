<script setup>

const props = defineProps({
  clientContact: {
    type: Array
  },
 
})
</script>
<template>
  <div class="col section-card">
    <div class="section-header">
      <div class="add-icon">
        <font-awesome-icon :icon="['fas', 'address-book']" />
      </div>
      <h2 class="mb-0 text-white">Client Contacts</h2>
    </div>

    <div class="section-content">
      <div class="contact-grid">

        <div v-for="contact in clientContact" :key="contact.client_contact_id" class="contact-card">
          <div class="d-flex">
            <div class="contact-avatar">
              {{ contact.first_name.charAt(0) }}{{ contact.last_name.charAt(0) }}
            </div>
            <div>
              <h4 class="mb-1">
                {{ contact.first_name }} {{ contact.last_name }}
              </h4>
              <p class="mb-2 text-muted">
                {{ contact.designation }}
              </p>
              <span class="status-badge status-active">
                <font-awesome-icon
                  class="fas fa-circle me-1"
                  style="font-size: 8px"
                  :icon="['fas', 'circle']"
                />
                {{ contact.status.label }}
              </span>
            </div>
          </div>
          <div class="contact-details">
            <div class="detail-item">
              <font-awesome-icon class="icon" :icon="['fas', 'phone']" />
              <div>
                <div class="text-muted small">Mobile</div>
                <div>{{ contact.mobile_number }}</div>
              </div>
            </div>

            <div class="detail-item">
              <font-awesome-icon class="icon" :icon="['fas', 'envelope']" />
              <div>
                <div class="text-muted small">Email</div>
                <div>{{ contact.email_address }}</div>
              </div>
            </div>
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

.section-header .add-icon {
  margin-right: 15px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 20px; /* Adjust to scale the icon nicely */
}

.section-header .add-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.section-content {
  padding: 25px;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  height: 25vh;
  overflow-y: auto;
}

.contact-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.contact-card:hover {
  border-color: #4361ee;
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.1);
}

.contact-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4361ee, #3f37c9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
  margin-right: 20px;
}

.contact-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-item .icon {
  color: #4361ee;
  margin-right: 10px;
  margin-top: 4px;
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
  .section-content {
    padding: 20px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>