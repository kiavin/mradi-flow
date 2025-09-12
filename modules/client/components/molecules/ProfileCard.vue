<script setup>
const props = defineProps({
  profileInfo: {
    type: Object,
  },
})
</script>

<template>
  <div class="client-card">
    <div class="card-header">
      <div class="client-id">ID: ef74a54f</div>
      <h1 class="client-name">CrackIT Technologies</h1>
    </div>

    <div class="card-body">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-phone-alt"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Mobile Number</div>
            <div class="info-value">0712345676</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Email Address</div>
            <div class="info-value">crack@example.com</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Physical Location</div>
            <div class="info-value">Nairobi, Kenya</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-building"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Client Since</div>
            <div class="info-value">Jan 2022</div>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <button class="btn btn-primary btn-action"><i class="fas fa-edit"></i> Edit Client</button>
        <button class="btn btn-outline-primary btn-action">
          <i class="fas fa-file-invoice"></i> View Invoices
        </button>
        <button class="btn btn-outline-primary btn-action">
          <i class="fas fa-comments"></i> Send Message
        </button>
        <button class="btn btn-outline-primary btn-action">
          <i class="fas fa-history"></i> View History
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
:root {
  --primary: #4361ee;
  --secondary: #3f37c9;
  --accent: #4cc9f0;
  --dark: #212529;
  --light: #f8f9fa;
  --gray: #6c757d;
}
.client-card {
  background: white;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  transition: all 0.4s ease;
  border: none;
}

.client-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(67, 97, 238, 0.2);
}

.card-header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 25px 30px;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: 30px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.client-id {
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  display: inline-block;
  margin-bottom: 15px;
  backdrop-filter: blur(4px);
}

.client-name {
  font-weight: 700;
  font-size: 2.2rem;
  margin-bottom: 5px;
  position: relative;
  z-index: 2;
}

.card-body {
  padding: 35px 30px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 4px solid var(--primary);
}

.info-item:hover {
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transform: translateY(-3px);
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin-right: 20px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  color: var(--gray);
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.info-value {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--dark);
  word-break: break-word;
}

.action-bar {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding-top: 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.btn-action {
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.btn-action i {
  margin-right: 10px;
  font-size: 1.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border: none;
}

.btn-outline-primary {
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: white;
}

@media (max-width: 768px) {
  .client-name {
    font-size: 1.8rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    padding: 20px;
  }

  .card-body {
    padding: 25px 20px;
  }
}
</style>