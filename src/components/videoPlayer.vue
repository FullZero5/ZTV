<template>
  <div>
    <!-- Видеоплеер с обработкой состояний -->
    <div class="relative">
      <video
        ref="videoElement"
        controls
        :poster="selectedChannel?.img || ''"
        class="w-full"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @error="handleVideoError"
      ></video>
      
      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <span class="text-white">Загрузка...</span>
      </div>
      
      <!-- Сообщение об ошибке -->
      <div v-if="errorMessage" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <span class="text-red-500">{{ errorMessage }}</span>
      </div>
    </div>
    
    <!-- Информация о канале -->
    <div v-if="selectedChannel" class="mt-2 p-2 bg-gray-100 rounded">
      <h2 class="text-xl font-bold">{{ selectedChannel.title }}</h2>
      <p class="text-gray-600">{{ selectedChannel.group }}</p>
    </div>
    
    <!-- Управление качеством -->
    <div v-if="showControls && selectedChannel" class="mt-2 flex gap-2">
      <select 
        v-model="selectedQuality" 
        @change="changeQuality"
        class="rounded border p-1"
        aria-label="Выбор качества видео"
      >
        <option value="-1">Авто</option>
        <option 
          v-for="quality in availableQualities" 
          :key="quality"
          :value="quality"
        >
          {{ quality }}p
        </option>
      </select>
      
      <button 
        @click="togglePlay"
        class="rounded bg-blue-500 px-3 py-1 text-white"
        :disabled="isLoading"
        aria-label="Кнопка воспроизведения/паузы"
      >
        {{ isPlaying ? 'Пауза' : 'Воспроизведение' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { createNewHls, isHlsSupported } from '../lib/videoHls'
import { useSelectedChannel } from '../useSelectedChannel'

interface Channel {
  id: string
  title: string
  group: string
  img?: string
  file: string
  // другие свойства при необходимости
}

const { selectedChannel } = useSelectedChannel()

const videoElement = ref<HTMLVideoElement | null>(null)
const hlsInstance = ref<ReturnType<typeof createNewHls> | null>(null)
const isPlaying = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const selectedQuality = ref(720)
const showControls = ref(true)
const availableQualities = ref<number[]>([360, 720, 1080]) // Будет обновляться при инициализации

// Обработчик ошибок видео
const handleVideoError = () => {
  if (!videoElement.value) return
  
  errorMessage.value = 'Ошибка воспроизведения видео'
  console.error('Video error:', videoElement.value.error)
}

// Инициализация/переинициализация плеера при смене канала
const initPlayer = async () => {
  if (!videoElement.value || !selectedChannel.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Очищаем предыдущий экземпляр
    if (hlsInstance.value) {
      hlsInstance.value.destroy()
      hlsInstance.value = null
    }

    if (isHlsSupported()) {
      hlsInstance.value = createNewHls({
        source: selectedChannel.value.file,
        element: videoElement.value,
        initialQuality: selectedQuality.value,
        aspectRatio: 16 / 9,
        config: {
          autoPlay: true
        },
        callbacks: {
          onCanPlay: () => {
            isPlaying.value = true
            isLoading.value = false
          },
          onError: (error) => {
            console.error('HLS error:', error)
            errorMessage.value = 'Ошибка загрузки видео'
            isLoading.value = false
          },
          onQualityAvailable: (qualities) => {
            console.log('Доступные качества:', qualities)
            availableQualities.value = qualities
          }
        }
      })
    } else {
      // Fallback для браузеров без HLS
      videoElement.value.src = selectedChannel.value.file
      await videoElement.value.play()
      isPlaying.value = true
      isLoading.value = false
    }
  } catch (error) {
    console.error('Player initialization error:', error)
    errorMessage.value = 'Ошибка инициализации плеера'
    isLoading.value = false
  }
}

// Реакция на смену канала
watch(selectedChannel, (newVal) => {
  if (newVal) {
    initPlayer()
  } else {
    if (videoElement.value) {
      videoElement.value.pause()
      videoElement.value.removeAttribute('src')
      isPlaying.value = false
      isLoading.value = false
    }
  }
}, { immediate: true })

const changeQuality = () => {
  if (hlsInstance.value) {
    try {
      hlsInstance.value.setQuality(Number(selectedQuality.value))
    } catch (error) {
      console.error('Quality change error:', error)
      errorMessage.value = 'Ошибка смены качества'
    }
  }
}

const togglePlay = async () => {
  if (!videoElement.value) return

  try {
    if (isPlaying.value) {
      await videoElement.value.pause()
    } else {
      isLoading.value = true
      await videoElement.value.play()
    }
  } catch (error) {
    console.error('Playback error:', error)
    errorMessage.value = 'Ошибка воспроизведения'
    isLoading.value = false
  }
}

// Очистка ресурсов
onBeforeUnmount(() => {
  if (videoElement.value) {
    videoElement.value.pause()
    videoElement.value.src = ''
  }
  
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
  }
})
</script>