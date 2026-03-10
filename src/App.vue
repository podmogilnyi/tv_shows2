<script setup>
import { ref, watch, computed} from 'vue'
import { useBibliotekaShow } from './stores/showStore.js' // imp pin
import ShowCard from './components/ShowCard.vue'  // karto4ki

const searchQuery = ref('')
const biblioteka_show = useBibliotekaShow()  
const hasPerformedSearch = ref(false)      //bez rezultatov
const inputError = ref('')    //esli pysto


const sortBy = ref('rating')
const sortOrder = ref('desc')      // sortirovka

watch(searchQuery, () => {
  inputError.value = ''
  })

async function performSearch(query = null) {
  const q = query !== null ? query : searchQuery.value.trim()
  if (!q) {
    inputError.value = 'Type the show name first.'
    return
  }

  inputError.value = ''
  searchQuery.value = q  
  await biblioteka_show.fetchShows(q)
  hasPerformedSearch.value = true  // otmetka poiska
}

const sortedShows = computed(() => {
  const shows = [...biblioteka_show.shows] //delaet kopiu

  return shows.sort((a, b) => {
    if (sortBy.value === 'rating') {
      const ratingA = (a.rating && a.rating.average) ? a.rating.average : (a.vote_average || 0)
      const ratingB = (b.rating && b.rating.average) ? b.rating.average : (b.vote_average || 0)

      return sortOrder.value === 'asc'
        ? ratingA - ratingB
        : ratingB - ratingA
    }

    if (sortBy.value === 'date') {
      const dateA = a.premiered 
        ? new Date(a.premiered) 
        : (a.first_air_date 
          ? new Date(a.first_air_date) 
          : new Date(0))
      const dateB = b.premiered 
        ? new Date(b.premiered) 
        : (b.first_air_date 
          ? new Date(b.first_air_date) 
          : new Date(0))

      return sortOrder.value === 'asc'
        ? dateA - dateB
        : dateB - dateA
    }

    return 0
  })
})


function selectHistory(item) { 
  performSearch(item)
}
</script>



<template>
  <h1>TV Show Search</h1> 

  <input v-model="searchQuery" placeholder="Search for a show" @keyup.enter="() => performSearch()">  
  <button @click="() => performSearch(null)">Search</button>
  <div class="filters">
  <label>
    Sort by:
    <select v-model="sortBy">
      <option value="rating">Rating</option>
      <option value="date">Date</option> 
    </select>
  </label>

  <label>     
    Order:
    <select v-model="sortOrder">
      <option value="desc">Descending</option>
      <option value="asc">Ascending</option>
    </select>
  </label>
</div>

<p v-if="!hasPerformedSearch && !biblioteka_show.loading">Find your TV show</p>
  <p v-if="inputError" style="color: red">{{ inputError }}</p>
  <p v-if="biblioteka_show.loading">Loading...</p>
  <p v-if="biblioteka_show.shows.length">Found {{ biblioteka_show.shows.length }} shows</p>  
  <p v-if="biblioteka_show.error">Error: {{ biblioteka_show.error.message }}</p>
  <p v-if="hasPerformedSearch && !biblioteka_show.loading && biblioteka_show.shows.length === 0">No shows found</p>

  <div class="history" v-if="biblioteka_show.history.length > 0 && biblioteka_show.shows.length > 0">
    <p>History:</p>
    <ul>
      <li v-for="item in biblioteka_show.history" :key="item">
        <button @click="selectHistory(item)">{{ item }}</button>  
      </li>
    </ul>
  </div>

  <div class="shows-container">
    <ShowCard v-for="show in sortedShows" :key="show.id" :shows="show" />
  </div> 
</template>

<style scoped>  
.history {
  margin-top: 10px;
  padding: 5px;
  border: 1px solid #ddd;
  width: fit-content;
}

.history ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 5px;
}

.history li button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 3px 6px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 0.9em;
  color: black;
}

.history li button:hover {
  background-color: #ddd;
}

.shows-container {
  margin-top: 20px;  
}

.filters {
  margin: 15px 0;
  display: flex;
  gap: 15px;
  align-items: center;
}

.filters label {
  font-size: 0.9em;
}

.filters select {
  margin-left: 5px;
}
</style>