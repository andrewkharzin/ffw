<script setup lang="ts">
import { ref, watch } from 'vue'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Flights' })

// Get the freighterId from the route parameters
const route = useRoute()
const freighterId = route.params.id

// Use your composable to fetch freighter details by ID
const { freighter, loading, error } = useFreighterById(freighterId)

// Table columns for ULD and AWB details
const columns = [
  { key: 'uld', label: 'ULD' },
  { key: 'number', label: 'AWB' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  { key: 'pieces', label: 'Pieces' },
  { key: 'weight', label: 'Weight (kg)' },
  { key: 'natureOfGoods', label: 'Nature Of Goods' },
  { key: 'specialHandling', label: 'Special Handling' },
]

// Watch for freighter changes and map the parsed FFM data to table rows
const tableRows = ref([])

watch(
  () => freighter.value?.parsedFFM,
  (newParsedFFM) => {
    if (newParsedFFM) {
      tableRows.value = newParsedFFM.ulds.flatMap((uld) => {
        return uld.awbs.map((awb) => ({
          uld: uld.uld, // Update ULD key
          number: awb.number, // Update AWB key
          origin: awb.origin,
          destination: awb.destination,
          pieces: awb.pieces,
          weight: awb.weight,
          natureOfGoods: awb.natureOfGoods || 'N/A', // Handle null values
          specialHandling: awb.specialHandling || 'N/A', // Handle null values
        }))
      })
    }
  },
  { immediate: true }
)
</script>

<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <UCard>
        <!-- Display general flight information -->
        <div v-if="freighter && !loading && !error">
          <h2>Flight PSD: {{ freighter.flight_psd }}</h2>
          <h2>Flight PST: {{ freighter.flight_pst }}</h2>
        </div>
      </UCard>
      <UCard class="mt-4">
        <div>
          <!-- Display table for parsed FFM data -->
          <UTable :rows="tableRows" :columns="columns" :loading="loading">
            <template #loading-state>
              <div class="flex items-center justify-center h-32">
                <i class="loader --6" />
              </div>
            </template>
            <template #empty-state>
              <div class="flex flex-col items-center justify-center py-6 gap-3">
                <span class="italic text-sm">No one here!</span>
                <UButton label="Add FFM" />
              </div>
            </template>
          </UTable>

          <!-- Handle errors -->
          <div v-if="error">{{ error }}</div>
        </div>
      </UCard>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
/* Loader styles for loading state */
.loader {
  --color: rgb(var(--color-primary-400));
  --size-square: 3vmin;
  display: block;
  position: relative;
  width: 50%;
  display: grid;
  place-items: center;
}

.loader.--6::before {
  content: '';
  width: var(--size-square);
  height: var(--size-square);
  background-color: var(--color);
  animation: loader-6 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes loader-6 {
  0%,
  100% {
    transform: none;
  }
  25% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(100%) translateY(100%);
  }
  75% {
    transform: translateY(100%);
  }
}
</style>
