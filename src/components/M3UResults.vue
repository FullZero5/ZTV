<script setup lang="ts">
import { useM3UStore } from '../useM3UStore'
import { watch } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Checkbox from './ui/checkbox/Checkbox.vue'
import Badge from './ui/badge/Badge.vue'

import { useSelectedChannel } from '../useSelectedChannel'

const {  selectChannel } = useSelectedChannel()

/** */

const {
  playlists,
  removePlaylist,
  selectPlaylist,
  selectedPlaylist,
  selectedPlaylistId,
  updateItemStatus
} = useM3UStore()

watch(playlists, (newVal) => {
  //console.log('Playlists updated:', newVal)
}, { deep: true })

watch(selectedPlaylistId, (newVal) => {
  //console.log('Selected playlist ID changed:', newVal)
})

// Для отладки
watch(selectedPlaylist, (newVal) => {
  //console.log('Playlist updated:', JSON.parse(JSON.stringify(newVal)))
}, { deep: true })

const handleCheckboxClick = (itemId: number, value: boolean | 'indeterminate') => {
  ////console.log('Checkbox clicked:', { itemId, value })

  if (!selectedPlaylistId.value) {
    //console.error('No selected playlist ID')
    return
  }

  const checked = value === true // Нормализуем в boolean
  //console.log('Updating:', { itemId, checked })

  // Вариант 1: Если используете прямое изменение
  const item = selectedPlaylist.value?.data.find((i: { id: number }) => i.id === itemId)
  if (item) {
    item.work = checked
    //console.log('Direct update:', item)
  }

  // Вариант 2: Если используете хранилище
  updateItemStatus(Number(selectedPlaylistId.value), itemId, checked)
}


</script>

<template>
  <div class="playlist-manager">
    <div class="playlist-container">
      <!-- Таблица плейлистов -->
      <div class="table-wrapper">
        <Table>
          <TableCaption v-if="playlists.length === 0">Нет загруженных плейлистов</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="playlist in playlists" :key="playlist.id"
              :data-state="playlist.id === selectedPlaylistId ? 'selected' : ''" @click="selectPlaylist(playlist.id)">
              <TableCell>{{ playlist.name }}</TableCell>
              <TableCell>{{ new Date(playlist.createdAt).toLocaleString() }}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" @click.stop="removePlaylist(playlist.id)">
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Просмотр содержимого -->
      <div class="data-container">
        <Card>
          <CardHeader>
            <CardTitle>
              {{ selectedPlaylist ? `Содержимое: ${selectedPlaylist.name}` : 'Выберите плейлист' }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea class="h-[calc(100vh-200px)]">
              <div v-if="selectedPlaylist?.data" class="space-y-2">
                <Card v-for="item in selectedPlaylist.data" :key="item.id" class="hover:shadow-md transition-shadow" @click="selectChannel(item)">
                  <CardContent class="p-4 flex items-center gap-4">
                    <img :src="item.img || 'https://via.placeholder.com/40'" :alt="item.title"
                      class="w-10 h-10 object-cover rounded">
                    <div class="flex-1 min-w-0 space-y-1">
                      <CardTitle class="text-base truncate">{{ item.title }}</CardTitle>
                      <CardDescription class="truncate">{{ item.group }}</CardDescription>
                    </div>
                    <div class="flex items-center gap-2">
                      <div v-for="(tag, index) in item.tag" :key="index">
                        <Badge>{{ tag }}</Badge>
                      </div>

                      <Checkbox 
                        :modelValue="Boolean(item.work)"
                        @update:modelValue="handleCheckboxClick(item.id, $event)" 
                        class="h-5 w-5" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div v-else class="flex items-center justify-center h-full text-muted-foreground">
                Нет данных для отображения
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-manager {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
}

.playlist-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: calc(100% - 60px);
}

.table-wrapper {
  overflow-y: auto;
  border-radius: 8px;
}

.data-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

[data-state="selected"] {
  background-color: hsl(var(--accent));
}

@media (max-width: 768px) {
  .playlist-container {
    grid-template-columns: 1fr;
  }
}
</style>