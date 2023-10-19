<template>
    <aside id="sidebar"
        class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width hidden"
        aria-label="Sidebar">
        <div
            class="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                <div class="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <input v-model="searchTerm" placeholder="Filter..."
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200 dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <div class="pb-2 space-y-2">
                        <a href="#" v-for="url in filteredUrls" :key="url.id" :id="url.id" @click="getId(url.id)"
                            class="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M14 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                                <path
                                    d="M18 5h-8a2 2 0 0 0-2 2v11H5a1 1 0 0 0 0 2h14a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2Zm-4 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm0 9a3 3 0 1 1 0-5.999A3 3 0 0 1 14 17Z" />
                                <path
                                    d="M6 9H2V2h16v1c.65.005 1.289.17 1.86.48A.971.971 0 0 0 20 3V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h4V9Z" />
                            </svg>
                            <span class="ml-3" sidebar-toggle-item="">{{ url.title }}</span>
                        </a>
                    </div>
                    <div class="pt-2 space-y-2">
                        <!--panel-->

                    </div>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800"
                sidebar-bottom-menu="">
                <!--topmenu-->
            </div>
            <div>
            </div>
        </div>
    </aside>
</template>
<script>
import { useUrlsStore } from '../store'
import { ref, watch, computed } from 'vue'

export default {
    setup() {
        const urlsStore = useUrlsStore()
        urlsStore.fetchUrls()
        const searchTerm = ref('')
        const getId = (id) => urlsStore.selectVideo(id)

        watch(searchTerm, (newVal, oldVal) => {
            myStore.setSearchTerm(newVal);
        })

        const filteredUrls = computed(() => {
            return urlsStore.filteredUrls;
        })

        return {
            getId,
            searchTerm,
            filteredUrls: filteredUrls
        }
    }
}
</script>
