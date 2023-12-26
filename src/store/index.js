import { defineStore } from 'pinia'
import urlsData from '../assets/json/urls.json'
import { groupBy } from '../function/utils'

export const useUrlsStore = defineStore('urls', {
  state: () => ({   
    selectUrl: null,
    selectUrlID: 1,
    selectUrlTitle: '',
    urls: []
  }),
  actions: {
    async fetchUrls() {
      if (localStorage.getItem('tvchannels')) {
        this.urls = JSON.parse(localStorage.getItem('tvchannels')).filter(channel => channel.work)
        //console.log(this.urls)
      } else {
        //this.urls = urlsData
        localStorage.setItem('tvchannels', JSON.stringify(urlsData))
      }
    },
    selectVideo(id) {
      const { file, title } = id ? this.urls.find( item => item.id === id) : this.urls[0].file
      this.selectUrl = file
      this.selectUrlID = id
      this.selectUrlTitle = title

    },
    async setWorkingChannel() {
      const index  = this.urls.findIndex(item => item.id === this.selectUrlID)
      if (index !== -1) {
        this.urls[index].work = false
        localStorage.setItem('tvchannels', JSON.stringify(this.urls))
        this.fetchUrls()
        this.selectVideo(this.selectUrlID+1)
      }
    }
  },
  getters: {
    filteredUrls(searchTerm){
      return searchTerm ? this.urls.filter((item) => {
        return item.title.includes('');
      }): this.urls
    },
    getSelectUrl() { return this.selectUrl    },
    getFirstUrl()  { return this.urls[this.selectUrlID].file },
    getGroupUrls() {
      return groupBy(this.urls, 'group')
    },
    getTitle() { return this.selectUrlTitle }
  }
})
