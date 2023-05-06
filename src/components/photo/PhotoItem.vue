<template>
  <q-card class="my-card">
    <img :src="item.url" alt="Image" loading="lazy" />

    <q-card-section>
      <div class="text-h6">{{ item.title }}</div>
      <div class="text-subtitle2">Album ID #{{ item.albumId }}, item ID #{{ item.id }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { Photo } from '@/types'

type Props = {
  item: Photo
}
defineProps<Props>()
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 250px;
  height: 100%;
}
</style>
