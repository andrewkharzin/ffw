<template>
  <div class="connection-flight-container">
    <!-- Input field for Connection Flight with dynamic button -->
    <div class="input-with-button">
      <input
        variant="outline"
        icon="i-heroicons-folder"
        class="connection-flight-input"
        placeholder="Select connection flight"
        :value="selectedFlight ? selectedFlight.flight_number : ''"
        readonly
      />
      <UButton
        color="primary"
        variant="solid"
        @click="selectedFlight ? clearFlight() : (isModalOpen = true)"
      >
        {{ selectedFlight ? 'CLEAR' : 'SET' }}
      </UButton>
    </div>

    <!-- Modal Window -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center dark:bg-slate-900/60"
    >
      <div class="bg-slate-900/40 p-5 rounded-lg shadow-lg w-2/3">
        <h3 class="text-lg font-medium mb-4">Aviability</h3>

        <!-- Table to display available flights -->
        <UCard>
          <table class="min-w-full dark:bg-slate-900">
            <thead>
              <tr>
                <th class="text-sm font-medium dark:text-gray-300">
                  Flight Number
                </th>
                <th class="text-sm font-medium dark:text-gray-300">Route</th>
                <th class="text-sm font-medium dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="flight in freighters" :key="flight.id">
                <td class="text-md font-bold font-mono dark:text-pink-500">
                  <div class="flex flex-col">
                    <p class="font-black text-pink-500 text-sm">
                      {{ flight.airlines.iata }}
                      <span class="font-bold font-mono text-gray-400 text-sm">
                        <NuxtLink :to="`/flights/freighter/${flight.id}`">
                          {{ flight.flight_number }}
                        </NuxtLink>
                      </span>
                    </p>
                    <span class="font-light text-gray-500 text-xs">{{
                      flight.airlines.name
                    }}</span>
                    <div v-if="showBlock">
                      <p class="font-bold text-sm text-gray-400">
                        <Plane
                          class="w-[130px] text-pink-600"
                          :font-controlled="false"
                        />

                        {{ flight.aircrafts_register.ac_code }}
                        <span
                          class="font-normal text-sm text-gray-400 font-mono"
                          >REG:{{
                            flight.aircrafts_register.ac_registration_number
                          }}</span
                        >
                      </p>
                    </div>
                  </div>
                  <!-- {{ flight.flight_number }}
                  {{ flight.airlines?.iata || 'N/A' }} -->
                </td>
                <td class="">
                  <template v-if="flight.flight_type === 'Inbound'">
                    <div class="uppercase">
                      <span class="font-bold text-xl text-left">{{
                        flight.airports.iata
                      }}</span>
                      <span class="text-pink-600">→</span>
                      <span class="font-bold text-xl text-orange-600 text-left"
                        >SVO</span
                      >
                      <div v-if="showBlock">
                        <p
                          class="font-normal text-slate-400 tracking-widest text-left"
                        >
                          {{ flight.flight_type }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <!-- If not inbound, consider it outbound -->
                  <template v-else>
                    <div class="text-left uppercase">
                      <span class="font-bold text-xl text-orange-600">SVO</span>
                      <span class="text-pink-600">→</span>
                      <span class="font-bold text-xl">{{
                        flight.airports.iata
                      }}</span>
                      <div v-if="showBlock">
                        <p class="font-normal text-slate-500 tracking-widest">
                          {{ flight.flight_type }}
                        </p>
                      </div>
                    </div>
                  </template>
                </td>
                <td class="">
                  <UButton
                    color="emerald"
                    variant="solid"
                    @click="selectFlight(flight)"
                  >
                    Select
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </UCard>

        <!-- Close Modal Button -->
        <UButton
          color="gray"
          variant="solid"
          class="mt-4"
          @click="isModalOpen = false"
        >
          Close
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isModalOpen = ref(false)
const selectedFlight = ref(null)
const { freighters, fetchFreighters } = useFreighters()

// Fetch flights when the component is mounted
onMounted(() => {
  fetchFreighters()
})

// Emit the selected flight back to the parent
const emit = defineEmits(['select-flight'])
const selectFlight = (flight) => {
  selectedFlight.value = flight
  emit('select-flight', flight, flight.flight_number)
  isModalOpen.value = false // Close modal after selection
}

// Clear the selected flight
const clearFlight = () => {
  selectedFlight.value = null
  emit('select-flight', null) // Emit null to indicate that the flight has been cleared
}
</script>

<style scoped>
.connection-flight-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.connection-flight-input {
  flex-grow: 1;
  padding: 0.35rem;
  border: 0.5px solid #4b5563; /* Light gray border */
  border-radius: 0.375rem; /* Slightly rounded corners */
  background-color: #0f172a; /* Light background */
  font-size: 1rem;
  color: #4b5563; /* Dark text */
  transition: border-color 0.3s ease;
  cursor: pointer;
}

.connection-flight-input:focus {
  border-color: #0ea5e9; /* Light blue border on focus */
}

.connection-flight-input[readonly] {
  background-color: #082f49; /* Light gray for readonly state */
}

.select-flight-button {
  padding: 0.75rem;
  border-radius: 0.375rem;
  color: #s0c4a6e; /* Dark text for button */
  background-color: #s0c4a6e;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.select-flight-button:hover {
  background-color: #cbd5e1; /* Light gray on hover */
}

.modal-window {
  background-color: rgba(
    15,
    23,
    42,
    0.8
  ); /* Dark background with transparency */
  backdrop-filter: blur(5px); /* Slight blur for modal backdrop */
  z-index: 50;
}

.modal-content {
  background-color: #1e293b; /* Dark gray background */
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 66%; /* Width of the modal */
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #ffffff; /* White text for title */
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  color: #ffffff; /* White text */
  padding: 0.5rem;
  text-align: left;
}

tbody td {
  padding: 0.75rem;
  border: 0.3px solid #64748b; /* Medium gray border */
  color: #e2e8f0; /* Light gray text for table content */
}

tbody tr:nth-child(even) {
  background-color: #1f2937; /* Slightly lighter row for contrast */
}

.btn-primary {
  background-color: #3b8s2f6; /* Blue button */
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2563eb; /* Darker blue on hover */
}

.btn-secondary {
  background-color: #94a3b8; /* Gray secondary button */
  color: #1e293b; /* Dark text */
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #64748b; /* Darker gray on hover */
}

.mt-4 {
  margin-top: 1rem;
}
</style>
