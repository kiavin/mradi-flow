<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()


</script>

<template>
    <div class="container">{{ route.id }}</div>
</template>

<style scooped></style>
