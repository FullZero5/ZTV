import { defineStore } from 'pinia'
import urlsData from '../assets/json/urls.json'
import { groupBy } from '../function/utils'

export const useUrlsStore = defineStore('urls', {
  state: () => ({
    selectUrl: null,
    urls: [],
    menu: true
  }),
  actions: {
    async fetchUrls() {
      this.urls = urlsData
    },
    selectVideo(id) {
      const { file } = id ? this.urls.find( item => item.id === id) : this.urls[0].file
      this.selectUrl = file
    },
    togleMenu() { this.menu = this.menu ? false : true }
  },
  getters: {
    getMenu(){ return this.menu },
    filteredUrls(searchTerm){
      return searchTerm ? this.urls.filter((item) => {
        return item.title.includes('');
      }): this.urls
    },
    getSelectUrl() { return this.selectUrl    },
    getFirstUrl()  { return this.urls[0].file },
    getGroupUrls() {
      return groupBy(this.urls, 'group')
    }
  }
})
