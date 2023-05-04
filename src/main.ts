import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import quasarLang from 'quasar/lang/ru'

// Import Quasar css
import 'quasar/dist/quasar.css'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
  lang: quasarLang
})

app.use(createPinia())
app.use(router)

app.mount('#app')
