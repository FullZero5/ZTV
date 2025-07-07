<script lang="ts" setup>
/** */
import { useM3UStore } from '../useM3UStore'

const { playlists, selectedPlaylist, selectedPlaylistId } = useM3UStore()

watch(playlists, (newVal) => {
  console.log('Playlists updated:', newVal)
}, { deep: true })

watch(selectedPlaylistId, (newVal) => {
  console.log('Selected playlist ID changed:', newVal)
})

// Для отладки
watch(selectedPlaylist, (newVal) => {
  console.log('Playlist updated:', JSON.parse(JSON.stringify(newVal)))
}, { deep: true })

/**  */

import { refDebounced } from '@vueuse/core'
import {
  Search,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import VideoDisplay from './VideoDisplay.vue'
import VideoList from './VideoList.vue'
import Nav from './Nav.vue'
import AppSidebar from './AppSidebar.vue'
import ThemeColor from './ThemeColor.vue'

interface MailProps {
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

const props = withDefaults(defineProps<MailProps>(), {
  defaultCollapsed: false,
  defaultLayout: () => [265, 440, 655],
})

const isCollapsed = ref(props.defaultCollapsed)
const selectedMail = ref<string | undefined>(
  selectedPlaylist.value?.data?.[0]?.id // Автовыбор первого элемента
)
const searchValue = ref('')
const debouncedSearch = refDebounced(searchValue, 350)

const filteredMailList = computed(() => {
  // Если плейлист не выбран, возвращаем пустой массив
  if (!selectedPlaylist.value?.data) return [];

  const searchValue = debouncedSearch.value?.trim().toLowerCase();

  // Если нет поискового запроса, возвращаем все каналы выбранного плейлиста
  if (!searchValue || searchValue.length < 3) {
    return selectedPlaylist.value.data;
  }

  // Фильтруем каналы по поисковому запросу
  return selectedPlaylist.value.data.filter((item: { title: string; file: string; group: string }) => {
    // Проверяем все текстовые поля канала на совпадение
    return (
      item.title?.toLowerCase().includes(searchValue) ||
      item.file?.toLowerCase().includes(searchValue) ||
      (item.group && item.group.toLowerCase().includes(searchValue))
    );
  });
});


const inactiveItems = computed(() => {
  return filteredMailList.value.filter((item: { work: boolean }) => item.work === false) || [];
})

const activeItems = computed(() => {
  return filteredMailList.value.filter((item: { work: boolean }) => item.work === true) || [];
})

const inactiveCount = computed(() => inactiveItems.value.length);
const activeCount = computed(() => activeItems.value.length);
const totalCount = computed(() => {
  return (selectedPlaylist.value?.data?.length) || 0;
});


function onCollapse() {
  isCollapsed.value = true
}

function onExpand() {
  isCollapsed.value = false
}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <ResizablePanelGroup id="resize-panel-group-1" direction="horizontal" class="h-full max-h-[800px] items-stretch">
      <ResizablePanel id="resize-panel-1" :default-size="defaultLayout[0]" :collapsed-size="navCollapsedSize"
        collapsible :min-size="15" :max-size="20"
        :class="cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')" @expand="onExpand"
        @collapse="onCollapse">

        <div class="flex items-center px-4 py-2">
          <ThemeColor />
        </div>
        <Separator />
        <Nav :is-collapsed="isCollapsed" :links="playlists" />
        <Separator />
        <AppSidebar :is-collapsed="isCollapsed"/>
        
        <Separator />

      </ResizablePanel>
      <ResizableHandle id="resize-handle-1" with-handle />
      <ResizablePanel id="resize-panel-2" :default-size="defaultLayout[1]" :min-size="30">
        <Tabs default-value="all">
          <div class="flex items-center px-4 py-2">
            <h1 class="text-xl font-bold">
              ТВ каналы ({{ totalCount }})
            </h1>
            <TabsList class="ml-auto">
              <TabsTrigger value="all" class="text-zinc-600 dark:text-zinc-200">
                Рабочие ({{ activeCount }})
              </TabsTrigger>
              <TabsTrigger value="unread" class="text-zinc-600 dark:text-zinc-200">
                Не рабочие ({{ inactiveCount }})
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />
          <div class="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div class="relative">
                <Search class="absolute left-2 top-2.5 size-4 text-muted-foreground" />
                <Input v-model="searchValue" placeholder="Поиск" class="pl-8" />
                <span v-if="searchValue && searchValue.length < 3"
                  class="absolute right-2 top-2.5 text-xs text-muted-foreground">
                  Введите ещё {{ 3 - searchValue.length }} симв.
                </span>
              </div>
            </form>
          </div>
          <TabsContent value="all" class="m-0">
            <VideoList v-model:selected-mail="selectedMail" :items="activeItems" item-key="id"/>
          </TabsContent>
          <TabsContent value="unread" class="m-0">
            <VideoList v-model:selected-mail="selectedMail" :items="inactiveItems" item-key="id"/>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
      <ResizableHandle id="resiz-handle-2" with-handle />
      <ResizablePanel id="resize-panel-3" :default-size="defaultLayout[2]">
        <VideoDisplay /> <!-- видео display -->
      </ResizablePanel>
    </ResizablePanelGroup>
  </TooltipProvider>
</template>