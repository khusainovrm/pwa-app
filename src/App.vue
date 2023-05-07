<template>
  <main-layout>
    <RouterView />

    <ReloadPromt />
  </main-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ReloadPromt from '@/components/ReloadPromt.vue'
import MainLayout from '@/layout/MainLayout.vue'
</script>
