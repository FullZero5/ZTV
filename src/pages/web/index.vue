<script lang="ts" setup>
import VideoPages from '@/components/VideoPages.vue'
</script>

<template>
  <div class="md:hidden">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2">
        <div class="font-semibold">
          Мобильная версия не поддерживается
        </div>
      </div>
    </div>
  </div>
  <div class="hidden flex-col md:flex">
    <VideoPages
      :nav-collapsed-size="4"
    />
  </div>
</template>