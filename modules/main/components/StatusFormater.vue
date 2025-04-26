<!-- components/StatusFormatter.vue -->
<script setup>
defineProps({
  value: String,
  data: Object,
});

const statusTheme = (theme) => {
  const themeMap = {
    info: "bg-info text-white badge",
    success: "bg-success text-white badge",
    warning: "bg-warning text-dark badge",
    danger: "bg-danger text-white badge",
    primary: "bg-primary text-white badge",
    secondary: "bg-secondary text-white badge",
    dark: "bg-dark text-white badge",
  };
  return themeMap[theme] || "bg-light text-dark";
};
</script>

<template>
  <span :class="statusTheme(data.recordStatus?.theme || 'default')">
    {{ data.recordStatus?.label || value }}
  </span>
</template>
