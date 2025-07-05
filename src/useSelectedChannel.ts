// useSelectedChannel.ts
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface Channel {
  file: string
  group: string
  id: number
  img: string
  tag: string[]
  title: string
  work: boolean
}

export function useSelectedChannel() {
  const STORAGE_KEY = 'selected_tv_channel'
  
  // Используем кастомный сериализатор/десериализатор
  const storage = useStorage<Channel | null>(
    STORAGE_KEY,
    null,
    localStorage,
    { 
      serializer: {
        read: (v) => v ? JSON.parse(v) : null,
        write: (v) => JSON.stringify(v)
      }
    }
  )

  // Проверяем, не сохранился ли у нас "[object Object]"
  if (storage.value && typeof storage.value === 'object' && storage.value.toString() === '[object Object]') {
    storage.value = null // Сбрасываем некорректное значение
  }

  const selectChannel = (channel: Channel) => {
    if (isValidChannel(channel)) {
      storage.value = channel
    }
  }

  const clearSelectedChannel = () => {
    storage.value = null
  }

  const isValidChannel = (channel: any): channel is Channel => {
    return channel?.id && channel?.title // Простая проверка
  }

  return {
    selectedChannel: storage,
    selectChannel,
    clearSelectedChannel,
    isChannelSelected: computed(() => !!storage.value)
  }
}