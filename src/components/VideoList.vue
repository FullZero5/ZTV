<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

import { useSelectedChannel } from '../useSelectedChannel'
import { useM3UStore } from '../useM3UStore'
const {  selectChannel } = useSelectedChannel()

const {
  selectedPlaylist,
  selectedPlaylistId,
  updateItemStatus
} = useM3UStore()

interface MailListProps {
  items: any
}

defineProps<MailListProps>()
const selectedMail = defineModel<string>('selectedMail', { required: false })


function getBadgeVariantFromLabel(label: string) {
  if (['кино'].includes(label.toLowerCase()))
    return 'default'

  if (['общие'].includes(label.toLowerCase()))
    return 'outline'

  return 'secondary'
}

const handleCheckboxClick = (itemId: number, value: boolean | 'indeterminate') => {
  //console.log('Checkbox clicked:', { itemId, value })

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
  <ScrollArea class="h-screen flex">
    <div class="flex-1 flex flex-col gap-2 p-4 pt-0">
      <TransitionGroup name="list" appear>
        <button
          v-for="item of items"
          :key="item.id"
          :class="cn(
            'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
            selectedMail === item.id && 'bg-muted',
          )"
          @click="selectChannel(item)"
        >
          <div class="flex w-full flex-col gap-1">
            <div class="flex items-center">
              <div class="flex items-center gap-2">
                <div class="font-semibold">
                  {{ item.title }}
                </div>
                <span v-if="item.work" class="flex h-2 w-2 rounded-full bg-green-600" />
                <span v-else class="flex h-2 w-2 rounded-full bg-red-600" />
              </div>
              <div :class="cn(
                  'ml-auto text-xs',
                  selectedMail === item.id
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                )">
                <Checkbox :modelValue="Boolean(item.work)" @update:modelValue="handleCheckboxClick(item.id, $event)" class="h-5 w-5" @click.stop/>
              </div>
            </div>
            <div class="text-xs font-medium">
              {{ item.group }}
            </div>
          </div>
          <div class="line-clamp-2 text-xs text-muted-foreground break-words">
            {{ item.file.slice(0, 150) + '...'  }}
          </div>
          <div class="flex items-center gap-2">
            <Badge v-for="tag of item.tag" :key="tag" :variant="getBadgeVariantFromLabel(tag)">
              {{ tag }}
            </Badge>
          </div>
        </button>
      </TransitionGroup>
    </div>
  </ScrollArea>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-active {
  position: absolute;
}
</style>