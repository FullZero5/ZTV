<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
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
  <div class="file-input-container">
    <input 
      ref="fileInput"
      type="file" 
      accept=".m3u" 
      @change="handleInputChange"
      class="file-input"
      aria-label="Select M3U file"
      :disabled="disabled"
    >
    
    <Button 
      @click="triggerFileInput"
      class="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
      size="sm"
      :disabled="disabled"
    >
      <slot>
        <span v-if="!disabled" class="flex items-center">
          <File class="ml-2 h-4 w-4" />
           Файл
         </span>
        <span v-else>Закрузка...</span>
      </slot>
    </Button>
  </div>
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