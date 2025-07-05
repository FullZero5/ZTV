<script setup lang="ts">
import NavUser from '@/components/NavUser.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  type SidebarProps,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
/** worker */
import { ref, inject, onMounted, type Ref } from 'vue'
import { useM3UStore } from '../useM3UStore'
import M3UFileInput from './M3UFileInput.vue'
import M3UDropZone from './M3UDropZone.vue'
import type { WorkerMessage } from '@/lib/worker'

const { 
  addPlaylist, 
  selectedPlaylist,
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

/** */
const props = defineProps<SidebarProps>()
// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  calendars: [
    {
      name: 'My Calendars',
      items: ['Personal', 'Work', 'Family'],
    },
    {
      name: 'Favorites',
      items: ['Holidays', 'Birthdays'],
    },
    {
      name: 'Other',
      items: ['Travel', 'Reminders', 'Deadlines'],
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader class="h-16 border-b border-sidebar-border">
      <NavUser :user="data.user" />
    </SidebarHeader>
    <SidebarContent>

      {{ selectedPlaylist?.name }}
      <SidebarSeparator class="mx-0" />

    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <div class="p-1">
          <Card class="shadow-none">
            <div>
              <CardHeader class="p-4 pb-0">
                <CardTitle class="text-sm font-semibold text-center">
                  Загрузите плейлист
                </CardTitle>
                <CardDescription>
                  <M3UDropZone @file-upload="handleFileUpload" :disabled="isLoading"/>
                </CardDescription>
              </CardHeader>
              <CardContent class="grid gap-2.5 p-4">
                <M3UFileInput  @file-upload="handleFileUpload" :disabled="isLoading"/>
              </CardContent>
            </div>
          </Card>
        </div>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
