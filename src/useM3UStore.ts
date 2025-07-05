import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'm3u_playlists'

// Создаём реактивные переменные вне функции, чтобы они были общими для всех экземпляров
const playlists = ref<any[]>([])
const selectedPlaylistId = ref<string | null>(null)

// Инициализация из localStorage
const initializeStore = () => {
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
        playlists.value = JSON.parse(storedData)
    }
}

// Инициализируем сразу
initializeStore()

// Синхронизация между вкладками
window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
        initializeStore()
    }
})

export function useM3UStore() {
    // Сохраняем при изменениях
    watch(playlists, (newVal) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
    }, { deep: true })

    const addPlaylist = (data: any, name: string) => {
        const newPlaylist = {
            id: Date.now().toString(),
            name,
            data,
            createdAt: new Date().toISOString()
        }
        playlists.value.push(newPlaylist)
        return newPlaylist
    }

    const removePlaylist = (id: string) => {
        playlists.value = playlists.value.filter(p => p.id !== id)
        if (selectedPlaylistId.value === id) {
            selectedPlaylistId.value = null
        }
    }

    const selectPlaylist = (id: string) => {
        selectedPlaylistId.value = id
    }

    const selectedPlaylist = computed(() =>
        playlists.value.find(p => p.id === selectedPlaylistId.value)
    )

    const updateItemStatus = (playlistId: number, itemId: number, status: boolean) => {
        const playlist = playlists.value.find(p => p.id === playlistId)
        if (!playlist) return

        const item = playlist.data.find((i: { id: number }) => i.id === itemId)
        if (item) {
            item.work = status
        }
    }

    return {
        playlists: computed(() => playlists.value),
        addPlaylist,
        removePlaylist,
        selectPlaylist,
        selectedPlaylist,
        updateItemStatus,
        selectedPlaylistId: computed(() => selectedPlaylistId.value)
    }
}