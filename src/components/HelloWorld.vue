<script setup lang="ts">
import M3UParser from './M3UParser.vue'

// Pass { disableTransition: false } to enable transitions

defineProps<{ msg: string }>()

</script>

<template>
  <div>
    <M3UParser></M3UParser>
  </div>  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
