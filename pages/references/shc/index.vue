<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Dangerous Goods Classes</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>
    <div
      v-if="!loading && !error"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="dgrClass in dgrClasses"
        :key="dgrClass.id"
        class="p-4 border rounded-lg shadow"
      >
        <h2 class="font-semibold text-xl">{{ dgrClass.label }}</h2>
        <p><strong>ICAO Class:</strong> {{ dgrClass.icao_class }}</p>
        <p><strong>Description:</strong> {{ dgrClass.description }}</p>
        <p><strong>IATA Code:</strong> {{ dgrClass.iata_code }}</p>
        <p><strong>Examples:</strong> {{ dgrClass.examples }}</p>
        <p>
          <strong>Emergency Actions:</strong> {{ dgrClass.emergency_actions }}
        </p>
        <a
          v-if="dgrClass.label_link"
          :href="dgrClass.label_link"
          class="text-blue-500 underline"
          target="_blank"
          >Label Link</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { dgrClasses, loading, error } = useRefCodes()
</script>

<style scoped>
.grid {
  display: grid;
  gap: 1rem;
}
</style>
