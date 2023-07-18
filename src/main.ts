import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

import routes from './routes'

import './style.css'
import App from './App.vue'

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})
const store = createPinia()
const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
