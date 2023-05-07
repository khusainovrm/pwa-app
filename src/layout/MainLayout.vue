<template>
  <div>
    <p class="q-mb-md q-pa-md">Service worker build date: {{ buildDate }}</p>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
const buildDate = '__BUILD_DATA__'
</script>
