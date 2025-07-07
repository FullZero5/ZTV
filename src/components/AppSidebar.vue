<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
/** worker */
import { ref, inject, onMounted, type Ref } from 'vue'
import { useM3UStore } from '../useM3UStore'
import M3UFileInput from './M3UFileInput.vue'
import M3UDropZone from './M3UDropZone.vue'
import type { WorkerMessage } from '@/lib/worker'

const {
  addPlaylist,
  selectPlaylist,
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

interface NavProps {
  isCollapsed: boolean
}

defineProps<NavProps>()
</script>

<template>
  <div :data-collapsed="isCollapsed" class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
    <M3UFileInput @file-upload="handleFileUpload" :disabled="isLoading" v-if="isCollapsed" />
    <Card class="shadow-none" v-else>
      <CardHeader class="p-4 pb-0">
        <CardTitle class="text-sm font-semibold text-center">
          Плейлист
        </CardTitle>
        <CardDescription class="text-sm font-semibold text-center">
         Перетащите файл M3U сюда
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-2.5 p-2">
         <M3UDropZone @file-upload="handleFileUpload" :disabled="isLoading" />
      </CardContent>
    </Card>

  </div>
</template>
