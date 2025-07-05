<script setup lang="ts">
import { ref, inject, onMounted, type Ref } from 'vue'
import M3UFileInput from './M3UFileInput.vue'
import M3UDropZone from './M3UDropZone.vue'
import M3UResults from './M3UResults.vue'
import type { WorkerMessage } from '@/lib/worker'
import { useM3UStore } from '../useM3UStore'

const { 
  addPlaylist, 
  selectedPlaylist,
  selectPlaylist,
  removePlaylist
} = useM3UStore()

const { worker, initWorker } = inject('m3u-worker') as {
  worker: Ref<Worker | null>
  initWorker: () => void
}

const parsedData = ref<any>(null)
const error = ref<string | null>(null)
const isLoading = ref(false)
const fileName = ref<string | null>(null)



onMounted(() => {
  initWorker()
  
  if (worker.value) {
    worker.value.onmessage = (event: MessageEvent<WorkerMessage>) => {
      isLoading.value = false
      
      if (event.data.type === 'data') {
        parsedData.value = event.data.data
        error.value = null
        const newPlaylist = addPlaylist(event.data.data, fileName.value || 'Unnamed playlist')
        selectPlaylist(newPlaylist.id)
      } else {
        error.value = event.data.message || 'Unknown error occurred during parsing'
        parsedData.value = null
      }
    }
  }
})

// Остальной код компонента остается без изменений
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
  if (selectedPlaylist.value) {
    removePlaylist(selectedPlaylist.value.id)
  }
}
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