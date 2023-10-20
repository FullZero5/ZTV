import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'flowbite'
import { createPinia } from "pinia"
import { inject } from '@vercel/analytics'
 
inject()

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount('#app')
