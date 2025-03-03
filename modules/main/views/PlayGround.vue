<script setup>
import Input from '~/themes/hopeui/components/atoms/input/BaseInput.vue'
import Button from '~/themes/hopeui/components/atoms/button/BaseButton.vue'
import Label from '~/themes/hopeui/components/atoms/labels/BaseLabel.vue'


</script>
<template>
  <div class="container mt-4">
    <Label labelFor="email" customClass="form-label">Email</Label>
    <Input class="form-control" placeholder="demo input"/>
    <Button customClass="btn btn-primary">Submit</Button>
  </div>
</template>