<template>
  <!-- Custom Table Implementation -->
  <table class="custom-table">
    <thead>
      <tr>
        <th
          v-for="column in columns"
          :key="column.key"
          class="text-xs text-tiny font-normal dark:text-gray-400"
        >
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="aircraft in aircrafts"
        :key="aircraft.id"
        :class="{
          'dark:bg-gray-400':
            selectedRegistration?.ac_registration_number ===
            aircraft.ac_registration_number,
        }"
        @click="handleSelect(aircraft)"
      >
        <td
          class="hover:text-lg hover:dark:text-pink-600 text-sm font-mono font-bold dark:text-gray-400"
        >
          {{ aircraft.ac_registration_number }}
        </td>
        <td class="text-sm text-tiny font-normal dark:text-gray-400">
          {{ aircraft.ac_code }}
        </td>
        <td class="text-sm text-tiny font-normal dark:text-gray-400">
          {{ aircraft.ac_airline_iata }}
        </td>
        <td class="text-xs text-tiny font-normal dark:text-gray-400">
          {{ aircraft.ac_model }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define the props to receive the aircraft data
const props = defineProps<{
  aircrafts: Array<{
    ac_registration_number: string
    ac_code: string
    ac_airline_iata: string
    ac_model: string
  }>
}>()

// Define columns for the table
const columns = [
  { key: 'ac_registration_number', label: 'Registration' },
  { key: 'ac_code', label: 'Type' },
  { key: 'ac_airline_iata', label: 'Airline' },
  { key: 'ac_model', label: 'Model' },
]

// Initialize selected registration as null
const selectedRegistration = ref(null)

// Function to handle row selection

const emit = defineEmits<{
  (event: 'select', aircraft: any): void
}>()

const handleSelect = (aircraft) => {
  emit('select', aircraft) // Emit selected aircraft
}
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th,
.custom-table td {
  padding: 10px;
  border: 0.3px dotted #1f2937;
  text-align: left;
}

.custom-table tbody tr {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-table tbody tr:hover {
  background: linear-gradient(
    90deg,
    rgba(5, 44, 84, 0.75) 0%,
    rgba(16, 16, 102, 0.65) 54%,
    rgba(7, 57, 83, 0.48) 100%
  );
  color: #fff; /* Optional: change text color on hover for better visibility */
  transform: scale(1.15); /* Slightly increase the size of the row */
}

.custom-table tbody tr.selected-row {
  background-color: #d3e4f1;
}

.custom-table tbody tr {
  transition: transform 0.4s ease, color 0.4s ease, font-size 0.4s ease;
}

.custom-table tbody tr:hover {
  font-size: 1.5em; /* Плавное увеличение размера текста */
}
</style>
