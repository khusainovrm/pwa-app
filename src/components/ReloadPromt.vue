<template>
  <q-dialog v-model="needRefresh" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="security_update" color="primary" text-color="white" />
        <span class="q-ml-sm">Доступно новое обновление</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Закрыть" color="primary" v-close-popup />
        <q-btn
          flat
          label="Обновить"
          color="primary"
          v-close-popup
          @click="update"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { pwaInfo } from 'virtual:pwa-info'
import { ref } from 'vue'

console.log('pwaInfo', pwaInfo)

// replaced dyanmicaly
const reloadSW: any = '__RELOAD_SW__'
const loading = ref(false)

const { needRefresh, updateServiceWorker } = useRegisterSW({
  // immediate: true,
  onRegisteredSW(swUrl, r) {
    if (reloadSW === 'true') {
      r &&
        setInterval(async () => {
          console.log('Checking for sw update')
          await r.update()
        }, 20000 /* 20s for testing purposes */)
    } else {
      console.log(`SW Registered: ${r}`)
    }
  }
})
const update = async () => {
  console.log('start updating')
  loading.value = true
  await updateServiceWorker()
  loading.value = false
}
</script>

<style scoped lang="scss">
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
