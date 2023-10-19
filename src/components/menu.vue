<template>
    <ul v-for="(item, index) in Array.from(getGroupUrls.keys())">
        <button type="button"
            class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            :aria-controls="`dropdown-layouts${index}`" :data-collapse-toggle="`dropdown-layouts${index}`"
            aria-expanded="false">
            <svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z">
                </path>
            </svg>
            <span class="flex-1 ml-3 text-left whitespace-nowrap" :sidebar-toggle-item="`dropdown-layouts${index}`">{{ item
            }}</span>
            <svg sidebar-toggle-item="" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"></path>
            </svg>
        </button>
        <ul :id="`dropdown-layouts${index}`" class="py-2 space-y-2 hidden">
            <li v-for="url in getGroupUrls.get(item)">
                <a href="#" :key="url.id" :id="url.id" class="flex items-center p-2 text-base text-gray-900 
                    transition duration-75 rounded-lg pl-11 
                    group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    @click="getId(url.id)">{{ url.title }}</a>
            </li>

        </ul>
    </ul>
</template>
<script>
import { useUrlsStore } from '../store'
import { storeToRefs } from 'pinia'

export default {
    setup() {
        const urlsStore = useUrlsStore()
        const { getGroupUrls } = storeToRefs(urlsStore)
        const getId = (id) => urlsStore.selectVideo(id)
        return {
            getGroupUrls,
            getId
        }
    }
}
</script>
