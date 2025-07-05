<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useDropZone } from '@vueuse/core'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits(['file-upload'])
const dropZone = ref<HTMLElement | null>(null)
const MAX_FILE_SIZE_MB = 10

// Используем toRef для реактивности
const disabledRef = toRef(props, 'disabled')

const { isOverDropZone } = useDropZone(dropZone, (files) => {
  if (!disabledRef.value && files?.[0]) {
    emit('file-upload', files[0])
  }
})
</script>

<template>
  <div
    ref="dropZone"
    class="drop-zone"
    :class="{ 'over': isOverDropZone, 'disabled': disabled }"
    aria-label="File drop zone"
  >
    <p>Перетащите файл M3U сюда</p>
    <p class="hint">Максимальный размер: {{ MAX_FILE_SIZE_MB }} MB</p>
  </div>
</template>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.drop-zone.over:not(.disabled) {
  border-color: #42b983;
  background-color: rgba(66, 185, 131, 0.1);
}

.drop-zone.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.drop-zone p {
  margin: 0;
}

.hint {
  font-size: 0.8em;
  color: #888;
  margin-top: 8px !important;
}
</style>