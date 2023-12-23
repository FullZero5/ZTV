import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'flowbite'
import { createPinia } from "pinia"
import { inject } from '@vercel/analytics'
import VueLazyLoad from 'vue3-lazyload'
 
inject()

const pinia = createPinia()

createApp(App)
    .use(VueLazyLoad)
    .use(pinia)
    .mount('#app')
