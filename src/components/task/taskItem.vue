<template>
  <q-card>
    <q-card-section>
      {{ item.name }}
    </q-card-section>

    <q-card-actions>
      <q-btn
        label="del"
        color="negative"
        @click="removeTask"
        :disable="loading"
        class="q-ml-auto"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import type { Task } from '@/types'
import { ref } from 'vue'

type Props = {
  item: Task
  remove: Function
}
const props = defineProps<Props>()

const loading = ref(false)

const removeTask = async () => {
  loading.value = true
  await props.remove(props.item._id)
  loading.value = false
}
</script>

<style scoped lang="scss"></style>
