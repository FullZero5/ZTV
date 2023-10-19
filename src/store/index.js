import { defineStore } from 'pinia'
import urlsData from '../assets/json/urls.json'

export const useUrlsStore = defineStore('urls', {
  state: () => ({
    selectUrl: null,
    urls: []
  }),
  actions: {
    async fetchUrls() {
      this.urls = urlsData
    },
    selectVideo(id) {
      const { file } = id ? this.urls.find( item => item.id === id) : this.urls[0].file
      this.selectUrl = file
    }
  },
  getters: {
    filteredUrls(searchTerm){
      return searchTerm ? this.urls.filter((item) => {
        return item.title.includes('');
      }): this.urls
    },
    getSelectUrl() { return this.selectUrl    },
    getFirstUrl()  { return this.urls[0].file }
  }
})
