<script setup lang="ts">
import { useSelectedChannel } from '../useSelectedChannel'
import type { Channel } from  '../useSelectedChannel'

const { selectedChannel, selectChannel, clearSelectedChannel } = useSelectedChannel()

// Тестовый канал (ваша структура)
const demoChannel: Channel = {
  file: "http://example.com/stream.m3u8",
  group: "Кино",
  id: 101,
  img: "https://i.ibb.co/sjwXGh4/tv-channel.png",
  tag: ["Кино", "Фильмы"],
  title: "Кинозал Premium",
  work: true
}

// Восстановит последний выбранный канал при загрузке
console.log('Текущий выбранный канал:', selectedChannel.value)
</script>

<template>
  <div v-if="selectedChannel" class="channel-card">
    <img :src="selectedChannel.img" :alt="selectedChannel.title">
    <h3>{{ selectedChannel.title }}</h3>
    <p>{{ selectedChannel.group }}</p>
    <button @click="clearSelectedChannel">Закрыть</button>
  </div>

  <button @click="selectChannel(demoChannel)">Выбрать тестовый канал</button>
</template>