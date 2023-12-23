<script>
import Worker from '../function/worker.js?worker&inline';
import { useUrlsStore } from '../store'
import { storeToRefs } from 'pinia'

export default {
    setup() {
        const store = useUrlsStore()
        const worker = new Worker();

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                worker.postMessage(event.target.result);
                worker.onmessage = (event) => {
                    event.data.type === 'error' ? console.error(event.data.message) : null;
                    // Сохранение результата в store
                    console.log(event.data)
                    //store.parsedData = event.data;
                };
            };
            reader.readAsText(file);
        };

        return { handleFileUpload };
    },
};
</script>

<template>
    <div class="flex items-center justify-center w-full">
        <label for="dropzone-file"
            class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">Загрузить ...</span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">m3u, m3u8</p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" accept="application/vnd.apple.mpegurl,audio/mpegurl,application/mpegurl,application/x-mpegurl,audio/mpegurl,audio/x-mpegurl,application/vnd.apple.mpegurl.audio" @change="handleFileUpload" />
        </label>
    </div>
</template>
