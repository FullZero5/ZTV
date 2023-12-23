<script setup>
const props = defineProps({
    urlLogo: {
        type: String,
        default: "https://i.ibb.co/sjwXGh4/tv-channel.png",
    },
    urlTitle:{
        type: String,
        default: "Zырь TV",
    }
});
</script>

<template>
    <div class="flex-shrink-0">
        <img class="rounded-full w-11 h-11 bg-white" :alt="props.urlTitle"
            v-lazy="{ src: props.urlLogo, error: 'https://i.ibb.co/sjwXGh4/tv-channel.png' }">
    </div>
</template>