<template>
  <USelect
    placeholder="Search for an airport..."
    :options="airportOptions"
    v-model="selectedAirport"
    @change="onAirportChange"
    label="Choose an airport"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const selectedAirport = ref<string | null>(null)
const airportOptions = ref([]) // This will hold airport options for USelect

const { getAirports } = useAirports()

// Fetch airports on component mount
onMounted(async () => {
  const airportData = await getAirports()
  if (airportData) {
    airportOptions.value = airportData.map((airport) => ({
      label: airport.iata, // Display airport name
      value: airport.id, // Set airport ID as the value
    }))
  }
})

// Handle airport selection change
const onAirportChange = () => {
  console.log('Selected Airport ID:', selectedAirport.value)
  // Use selectedAirport.value for further logic like fetching airport data
}
</script>
