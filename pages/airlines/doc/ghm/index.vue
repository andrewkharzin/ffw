<script setup lang="ts"></script>
<template>
  <ContentList v-slot="{ list }" path="/doc/airlines/ghm">
    <div v-for="ghm in list" :key="ghm._path">
      <h2>{{ ghm.title }}</h2>
      <!-- <p>{{ article.description }}</p> -->
    </div>
  </ContentList>
</template>
