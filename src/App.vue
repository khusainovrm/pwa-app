<template>
  <RouterView />

  <ReloadPromt />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ReloadPromt from '@/components/ReloadPromt.vue'
</script>
