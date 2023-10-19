<template>
    <aside id="sidebar"
        class="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width "
        :class="menu?'hidden':null"
        aria-label="Sidebar">
        <div
            class="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
                <div class="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <div class="pb-2 space-y-2">
                        <MainMenu />
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
import { storeToRefs } from 'pinia'
import MainMenu from './menu.vue'

export default {
    components: {
        MainMenu
    },
    setup() {
        const urlsStore = useUrlsStore()
        const { getMenu } = storeToRefs(urlsStore)
        urlsStore.fetchUrls()
        return {
            menu: getMenu
        }
    }
}
</script>
