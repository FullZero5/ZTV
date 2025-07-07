<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { File } from 'lucide-vue-next'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits(['file-upload'])
const fileInput = ref<HTMLInputElement | null>(null)

const handleInputChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    emit('file-upload', input.files[0])
    input.value = ''
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <nav class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
    <input 
      ref="fileInput"
      type="file" 
      accept=".m3u" 
      @change="handleInputChange"
      class="file-input"
      aria-label="Select M3U file"
      :disabled="disabled"
    >
    <Tooltip :delay-duration="0">
          <TooltipTrigger as-child>
            <Button 
              @click="triggerFileInput"
              :class="cn(
                buttonVariants({ variant: 'destructive', size: 'icon' }),
                'h-9 w-9 cursor-pointer'
              )"
              :disabled="disabled"
            >
              <slot>
                <span v-if="!disabled">
                  <File class="h-4 w-4" />
                </span>
              </slot>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" class="flex items-center gap-4">
            Загрузить файл
          </TooltipContent>
        </Tooltip>
  </nav>
</template>

<style scoped>
.file-input-container {
  display: flex;
  justify-content: center;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

</style>