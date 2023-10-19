import { createApp, useAttrs } from 'vue'
import './style.css'
import App from './App.vue'
import 'flowbite'
import { createPinia } from "pinia"

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .mount('#app')
