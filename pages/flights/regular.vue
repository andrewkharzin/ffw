<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <div class="flights-page">
        <div v-if="loading" class="text-center">Loading...</div>
        <div v-if="error" class="text-center text-red-500">
          {{ error }}
        </div>

        <SchedulerFlights
          v-if="!loading && !error"
          :flights-data="flightsData"
          :filter-type="filterType"
        />
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Regular flights' })

const { flightsData, loading, error, fetchFlights } = useRapid()
const filterType = ref('arrivals')

onMounted(() => {
  fetchFlights('SVO')
})
</script>

<style scoped>
.flights-page {
  padding: 20px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
}

.active {
  background-color: #1e3a8a !important;
}
</style>
