<script setup>
import { useNotificationStore } from '../../omnicore/stores/notificationStore'
const store = useNotificationStore()
</script>

<template>
  <div class="notifications">
    <div v-for="note in store.notifications" :key="note.id">
      <strong>{{ note.title }}</strong>
      <p>{{ note.message }}</p>
      <small>{{ note.timestamp.toLocaleTimeString() }}</small>
    </div>
  </div>
</template>
