<template>
  <UModal :model-value="localIsOpen" @update:model-value="updateIsOpen">
    <UCard
      class="max-w-full"
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <h3 class="text-lg font-semibold">Parsed SCR Results</h3>
      </template>

      <div class="p-4">
        <!-- Display table using UTable -->
        <UTable
          v-if="formattedFlights.length"
          :columns="columns"
          :rows="formattedFlights"
        />
        <p v-else>No flight results to display</p>
        <!-- Fallback when there are no flights -->
      </div>

      <template #footer>
        <UButton color="gray" variant="solid" @click="closeModal"
          >Close</UButton
        >
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'

// Props
const props = defineProps<{
  isOpen: boolean
  parsedResults: {
    flights: Array<Record<string, any>>
    airportCode: string
    scheduleDate: string
    // Add other properties if needed
  }
}>()
const emit = defineEmits(['update:isOpen'])

const localIsOpen = ref(props.isOpen)

watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue
  }
)

const updateIsOpen = (value: boolean) => {
  emit('update:isOpen', value)
}

function closeModal() {
  updateIsOpen(false)
}

// Define columns for UTable
const columns = [
  { key: 'flightNumber', label: 'Flight' },
  { key: 'startDate', label: 'Date1' },
  { key: 'endDate', label: 'Date2' },
  { key: 'timing', label: 'Day' },
  { key: 'aircraftType', label: 'AC Type' },
  { key: 'route', label: 'Route' },
  { key: 'utcTime', label: 'Time/UTC' },
  { key: 'serviceInfo', label: 'Service Info' },
  { key: 'flightType', label: 'Type' },
]

// Extract and format the flights array for the UTable
const formattedFlights = computed(() => {
  if (Array.isArray(props.parsedResults.flights)) {
    return props.parsedResults.flights.map((flight) => ({
      flightNumber: flight.flightNumber || 'N/A',
      startDate: flight.startDate || 'N/A',
      endDate: flight.endDate || 'N/A',
      timing: flight.timing || 'N/A',
      aircraftType: flight.aircraftType || 'N/A',
      route: flight.route || 'N/A',
      utcTime: flight.utcTime || 'N/A',
      serviceInfo: flight.serviceInfo || 'N/A',
      flightType: flight.flightType || 'N/A',
    }))
  } else {
    return []
  }
})
</script>
