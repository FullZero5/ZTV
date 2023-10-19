import { defineStore } from 'pinia'

export const useUIelements = defineStore('ui', {
  state: () => ({ menu: true }),
  actions: {
    togleMenu() { 
        this.menu = this.menu ? false : true 
    }
  },
  getters: {
    getMenu: state => state.menu 
  }
})
