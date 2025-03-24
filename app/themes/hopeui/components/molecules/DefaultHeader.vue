<script setup>
import { RouterLink, useRouter } from 'vue-router'
</script>
<template>
  <header class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <RouterLink to="/" class="navbar-brand">
        <img src="../../../../../modules/main/assets/logo.svg" alt="Logo" class="logo" />
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <nav>
          <ul class="navbar-nav">
            <li class="nav-item">
                <RouterLink to="/" class="nav-link">Home</RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Services</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.logo {
  height: 30px;
  width: auto;
}

.navbar-nav {
  display: flex;
  gap: 20px;
}

@media (max-width: 991px) {
  .navbar-collapse {
    text-align: center;
  }
}
</style>
