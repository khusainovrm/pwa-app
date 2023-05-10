import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/ru'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router'

import './assets/main.scss'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify
  },
  lang: quasarLang
})

app.use(createPinia())
app.use(router)

app.mount('#app')
