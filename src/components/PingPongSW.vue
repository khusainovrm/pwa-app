<template>
  <q-card class="my-card">
    <q-card-section>
      <button @click="runWorker">Ping web worker</button>
      &#160;&#160;
      <button @click="resetMessage">Reset message</button>
      <br />

      <template v-if="pong">
        Response from web worker:
        <span> Message: {{ pong }} </span>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import MyWorker from '../my-worker?worker'

const pong = ref(null)

const worker = new MyWorker()

const runWorker = async () => {
  worker.postMessage('ping')
}
const resetMessage = async () => {
  worker.postMessage('clear')
}
const messageFromWorker = async ({ data: { msg } }: MessageEvent) => {
  pong.value = msg
}
onBeforeMount(() => {
  worker.addEventListener('message', messageFromWorker)
})
</script>
