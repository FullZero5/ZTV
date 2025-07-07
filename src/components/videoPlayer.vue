<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center p-2">
      <div class="flex items-center gap-2">
        <Tooltip v-if="showControls && selectedChannel">
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" :disabled="isLoading" @click="togglePlay">
              <component :is="isPlaying ? Pause : Play" class="size-4" />
              <span class="sr-only">{{ isPlaying ? 'Пауза' : 'Воспроизведение' }}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ isPlaying ? 'Пауза' : 'Воспроизведение' }}</TooltipContent>
        </Tooltip>
      </div>
      <div class="ml-auto flex items-center gap-2">
        Два
      </div>
      <Separator orientation="vertical" class="mx-2 h-6" />
      <DropdownMenu v-if="showControls && selectedChannel">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            
            <ChevronDown class="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-40">
          <DropdownMenuLabel>Выбор качества</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem v-for="quality in availableQualities" :key="quality" @click="changeQuality(quality)"
            :class="{ 'bg-accent': selectedQuality === quality }">
            {{ quality }}p
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="changeQuality(-1)" :class="{ 'bg-accent': selectedQuality === -1 }">
            Авто
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Separator />
    <div v-if="selectedChannel" class="flex flex-1 flex-col">
      <div class="flex items-start p-4">
        <div class="flex items-start gap-4 text-sm">
          <Avatar :src="selectedChannel.img" alt="Image">
            <AvatarFallback>
              TV
            </AvatarFallback>
          </Avatar>

          <div class="grid gap-1">
            <div class="font-semibold">
              <h3>{{ selectedChannel.title }}</h3>
            </div>
            <div class="line-clamp-1 text-xs" v-if="isLoading">
              Загрузка...
            </div>
            <div class="line-clamp-1 text-xs" v-if="errorMessage">
              <Alert variant="destructive">
                <AlertCircle class="w-4 h-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>
                  {{ errorMessage }}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        <div v-if="selectedChannel" class="ml-auto text-xs text-muted-foreground">
          {{ selectedChannel.group }}
        </div>
      </div>
      <Separator />
      <div class="flex-1">
        <!-- Видеоплеер с обработкой состояний -->
        <video ref="videoElement" controls :poster="selectedChannel?.img || ''" @play="isPlaying = true"
          @pause="isPlaying = false" @error="handleVideoError">
        </video>
      </div>
      <Separator class="mt-auto" />
      <div class="p-4">
        форма ответа
      </div>
    </div>

    <!-- 
    <div v-if="showControls && selectedChannel" class="mt-2 flex gap-2">
      <select v-model="selectedQuality" @change="changeQuality" class="rounded border p-1"
        aria-label="Выбор качества видео">
        <option value="-1">Авто</option>
        <option v-for="quality in availableQualities" :key="quality" :value="quality">
          {{ quality }}p
        </option>
      </select>

      <button @click="togglePlay" class="rounded bg-blue-500 px-3 py-1 text-white" :disabled="isLoading"
        aria-label="Кнопка воспроизведения/паузы">
        {{ isPlaying ? 'Пауза' : 'Воспроизведение' }}
      </button>
    </div>Управление качеством -->


  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { createNewHls, isHlsSupported } from '../lib/videoHls'
import { useSelectedChannel } from '../useSelectedChannel'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AlertCircle, ChevronDown, Pause, Play } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

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

const changeQuality = (quality: number) => {
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

<style scoped>
video {
  transition: opacity 0.3s ease;
}

video.invisible {
  opacity: 0;
}
</style>
