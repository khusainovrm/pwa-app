<template>
  <main>
    <h4 class="q-mb-md">Service worker build date: {{ buildDate }}</h4>
    <PingPongSW class="q-mb-md" />

    <PhotosList />

    <div class="q-mt-md">new content #2</div>
  </main>
</template>

<script setup lang="ts">
import PhotosList from '@/components/PhotosList.vue'
import PingPongSW from '@/components/PingPongSW.vue'

const buildDate = '__BUILD_DATA__'
</script>
