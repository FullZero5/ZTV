<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import M3UFileInput from './M3UFileInput.vue'
import M3UDropZone from './M3UDropZone.vue'
import M3UResults from './M3UResults.vue'
import Worker from '../lib/worker?worker'
import type { WorkerMessage } from '../lib/worker'

const worker = ref<Worker | null>(null)
const parsedData = ref<any>(null)
const error = ref<string | null>(null)
const isLoading = ref(false)
const fileName = ref<string | null>(null)

const initWorker = () => {
  worker.value = new Worker()
  
  worker.value.onmessage = (event: MessageEvent<WorkerMessage>) => {
    isLoading.value = false
    
    if (event.data.type === 'data') {
      parsedData.value = event.data.data
      error.value = null
    } else {
      error.value = event.data.message || 'Unknown error occurred during parsing'
      parsedData.value = null
    }
  }

  worker.value.onerror = (err) => {
    isLoading.value = false
    error.value = `Worker error: ${err.message}`
    console.error('Worker error:', err)
  }
}

const processContent = (content: string, name: string) => {
  if (!worker.value) return
  
  isLoading.value = true
  error.value = null
  parsedData.value = null
  fileName.value = name
  
  try {
    worker.value.postMessage(content)
  } catch (err) {
    isLoading.value = false
    error.value = 'Failed to parse content'
    console.error('Parsing error:', err)
  }
}

const handleFileUpload = (file: File) => {
  const reader = new FileReader()

  reader.onload = (e) => {
    processContent(e.target?.result as string, file.name)
  }

  reader.onerror = () => {
    isLoading.value = false
    error.value = 'Failed to read file'
  }

  reader.readAsText(file)
}

const clearResults = () => {
  parsedData.value = null
  fileName.value = null
}

onMounted(initWorker)
onBeforeUnmount(() => worker.value?.terminate())

defineExpose({ parseM3U: (content: string, name = 'custom.m3u') => processContent(content, name) })
</script>

<template>
  <div class="m3u-parser-container">
    <M3UFileInput 
      @file-upload="handleFileUpload"
      :disabled="isLoading"
    />
    
    <M3UDropZone
      @file-upload="handleFileUpload"
      :disabled="isLoading"
    />

    <M3UResults
      :is-loading="isLoading"
      :error="error"
      :parsed-data="parsedData"
      :file-name="fileName"
      @clear="clearResults"
    />
  </div>
</template>

<style scoped>
.m3u-parser-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>