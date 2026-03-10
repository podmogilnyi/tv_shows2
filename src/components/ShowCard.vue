<script setup>
defineProps({
  shows: Object
})
</script>

<template>
  <div class="card">
    <h3>{{ shows.name || shows.show && shows.show.name }}</h3>

    <div class="image-container">
  <img
    v-if="(shows.image && shows.image.medium) || shows.poster_path"
    :src="shows.image && shows.image.medium ? shows.image.medium : `https://image.tmdb.org/t/p/w300${shows.poster_path}`"
    alt="Show image"
    loading="lazy"
  >
  <p v-else>No image available</p>
</div>

    <p>
      Rating:
      {{ 
        shows.rating && shows.rating.average != null
          ? shows.rating.average.toFixed(1)
          : shows.vote_average != null
            ? shows.vote_average.toFixed(1)
            : "Rating not available" 
      }}
    </p>


    <p v-if="shows.premiered || shows.first_air_date">
      Start: {{ (shows.premiered || shows.first_air_date).slice(0,4) }}
    </p>

    <p>
      End: {{ (shows.ended || shows.last_air_date) ? (shows.ended || shows.last_air_date).slice(0,4) : 'Still running' }}
    </p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px;
  width: 220px;
  display: inline-block;
  vertical-align: top;
  text-align: center;
}

.card img {
  width: 100%;
  height: auto;
  margin-bottom: 5px;
}

.card h3 {
  font-size: 1em;
  margin-bottom: 5px;
}

.card p {
  margin: 2px 0;
  font-size: 0.9em;
}
</style>