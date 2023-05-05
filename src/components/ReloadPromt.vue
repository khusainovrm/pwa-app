<template>
  <h6 class="q-mt-xs">Statuses:</h6>
  <p>needRefresh - {{ needRefresh }}</p>

  <div v-if="needRefresh" class="pwa-toast" role="alert">
    <button v-if="needRefresh" @click="updateServiceWorker()">Reload</button>
    <button @click="close">Close</button>
  </div>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { pwaInfo } from 'virtual:pwa-info'

console.log('pwaInfo', pwaInfo)
// replaced dyanmicaly
const reloadSW: any = '__RELOAD_SW__'

const { needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    if (reloadSW === 'true') {
      r &&
        setInterval(async () => {
          console.log('Checking for sw update')
          await r.update()
        }, 10000 /* 10s for testing purposes */)
    } else {
      console.log(`SW Registered: ${r}`)
    }
  }
})
const close = async () => {
  needRefresh.value = false
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
  box-shadow: 3px 4px 5px 0px #8885;
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
