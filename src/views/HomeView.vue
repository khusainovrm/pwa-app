<template>
  <main>
    <p class="q-mb-md">Service worker build date: {{ buildDate }}</p>

    <TaskDashbord />
  </main>
</template>

<script setup lang="ts">
import TaskDashbord from '@/components/task/taskDashbord.vue'

const buildDate = '__BUILD_DATA__'
</script>
