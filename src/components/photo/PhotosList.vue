<template>
  <q-card class="my-card">
    <q-card-section>
      <q-input
        v-model="textInput"
        label="Укажите количество фото"
        mask="#"
        reverse-fill-mask
        hint="Only numbers up to 5000"
        :disable="loading"
      />
    </q-card-section>

    <q-card-section>
      <div v-if="error">{{ error }}</div>

      <div v-else class="q-pa-md">
        <div class="row justify-center q-gutter-sm">
          <q-intersection
            v-for="item in photos"
            :key="item.id"
            transition="scale"
            class="example-item"
            once
          >
            <PhotoItem :item="item" />
          </q-intersection>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from 'quasar'
import { fetchPhotos } from '@/api/jsonplaceholder'
import type { Photo } from '@/types'
import PhotoItem from '@/components/photo/PhotoItem.vue'
const getPhotos = async () => {
  if (!textInput.value) {
    return
  }
  try {
    loading.value = true
    error.value = ''
    photos.value = await fetchPhotos(textInput.value)
  } catch (e: any) {
    if (e?.response?.data?.message) {
      error.value = e.response.data.message
    } else {
      error.value = 'Что-то пошло не так...'
    }
  } finally {
    loading.value = false
  }
}

const textInput = ref(0)
const loading = ref(false)
const error = ref('')
const photos = ref<Photo[]>([])

watch(textInput, debounce(getPhotos, 1500))
</script>
