<script setup lang="ts">
import IndexPage from './pages/dashboard/index.vue'
import { ref, provide, onBeforeUnmount } from 'vue'
import Worker from './lib/worker?worker'

const worker = ref<Worker | null>(null)
const workerInitialized = ref(false)

const initWorker = () => {
  if (workerInitialized.value) return
  
  worker.value = new Worker()
  workerInitialized.value = true
  
  worker.value.onerror = (err) => {
    console.error('Worker error:', err)
  }
}

const terminateWorker = () => {
  worker.value?.terminate()
  worker.value = null
  workerInitialized.value = false
}

// Предоставляем worker дочерним компонентам
provide('m3u-worker', {
  worker,
  initWorker,
  terminateWorker
})

onBeforeUnmount(terminateWorker)
</script>

<template>
  <main>
     <IndexPage/>
  </main>
</template>

<style scoped>

</style>
