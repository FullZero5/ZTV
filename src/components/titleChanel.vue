<script>
import { storeToRefs } from 'pinia'
import { useUrlsStore } from '../store'

export default {
  setup() {
    const urlsStore = useUrlsStore()
    const { getTitle} = storeToRefs(urlsStore)
    return {
      getTitle
    }
  }
}

</script>

<template>
    <div>
        <!-- title-->
        <span
            class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            Канал : {{ getTitle }}
        </span>
    </div>
</template>