import { defineStore } from 'pinia'
import axios from 'axios'

export const useBibliotekaShow = defineStore('biblioteka_show', {
  state: function () {
    return {
      shows: [],
      loading: false,
      error: null,
      history: JSON.parse(localStorage.getItem('searchHistory') || '[]')
    }
  },
  actions: {
    async fetchShows(query) {

      this.loading = true
      this.error = null

      try {
        const response = await axios.get('https://api.tvmaze.com/search/shows?q=' + query)

        const showsArray = []
        for (let i = 0; i < response.data.length; i++) {
          showsArray.push(response.data[i].show)
        }
        this.shows = showsArray

        if (this.history.indexOf(query) === -1) {
          this.history.unshift(query)
          if (this.history.length > 5) {
            this.history.pop()
          }
          localStorage.setItem('searchHistory', JSON.stringify(this.history))
        }

      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    }
  }
})
      
