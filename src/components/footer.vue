<template>
    <p class="my-10 text-sm text-center text-gray-500">
      &copy; {{ formattedYear }} <a href="#" class="hover:underline" target="_blank">Zырь TV.ru</a>. All rights reserved.
    </p>
  </template>
  
  <script setup>
    import { ref, watchEffect, computed } from 'vue'
  
    const year = ref(new Date().getFullYear())
    const format = ref('YYYY')
  
    const formattedYear = computed(() => {
      return format.value.replace(/YYYY/g, year.value)
    })
  
    watchEffect(() => {
      year.value = new Date().getFullYear()
    })
  </script>