<script>
import { ref, onMounted, watch } from 'vue'
import { loadVideo } from '../function/videoHls'
import { useUrlsStore } from '../store'
import { storeToRefs } from 'pinia'
import image from "../assets/loading.gif"

export default {
  setup() {
    const urlsStore = useUrlsStore()
    const streamVideo = ref(null)
    const { getSelectUrl, getFirstUrl } = storeToRefs(urlsStore)
    watch(getSelectUrl, async () =>  await loadVideo(getSelectUrl.value, streamVideo.value))
    onMounted(async () =>  await loadVideo(getFirstUrl.value, streamVideo.value))

    return {
      streamVideo
    }
  }
}

</script>

<template>
  <video ref="streamVideo" controls playsinline autoplay loop class="w-full h-full" poster="../assets/loading.gif" preload="metadata">Your browser does not support the
    video tag</video>
</template>

<style scoped>

</style>
