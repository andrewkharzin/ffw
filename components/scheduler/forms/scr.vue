<template>
  <div class="scr-form">
    <!-- Textarea for pasting the SCR telex -->
    <textarea
      v-model="scrTelex"
      class="w-full p-2 border rounded mb-4"
      rows="10"
      placeholder="Paste SCR telex message here..."
    ></textarea>

    <!-- Button to parse the SCR telex and show the result in a modal -->
    <UButton @click="parseTelex" color="sky" variant="solid">
      Parse and Show Result
    </UButton>

    <!-- Modal to display parsed SCR result -->
    <UModal v-if="showModal" @close="showModal = false">
      <template #title> Parsed SCR Message </template>
      <template #body>
        <div v-if="parsedResult">
          <h3>Season Code: {{ parsedResult.seasonCode }}</h3>
          <h4>Schedule Date: {{ parsedResult.scheduleDate }}</h4>
          <h4>Airport Code: {{ parsedResult.airportCode }}</h4>
          <div v-for="(flight, index) in parsedResult.flights" :key="index">
            <hr />
            <h5>Flight {{ index + 1 }}</h5>
            <p><strong>Flight Number:</strong> {{ flight.flightNumber }}</p>
            <p><strong>Flight Type:</strong> {{ flight.flightType }}</p>
            <p><strong>Start Date:</strong> {{ flight.startDate }}</p>
            <p><strong>End Date:</strong> {{ flight.endDate }}</p>
            <p><strong>Timing:</strong> {{ flight.timing }}</p>
            <p><strong>Aircraft Type:</strong> {{ flight.aircraftType }}</p>
            <p><strong>Route:</strong> {{ flight.route }}</p>
            <p><strong>UTC Time:</strong> {{ flight.utcTime }}</p>
            <p><strong>Service Info:</strong> {{ flight.serviceInfo }}</p>
          </div>
          <hr />
          <p>
            <strong>Supplementary Info:</strong>
            {{ parsedResult.supplementaryInfo }}
          </p>
          <p><strong>General Info:</strong> {{ parsedResult.generalInfo }}</p>
        </div>
        <div v-else>
          <p>No SCR message parsed yet.</p>
        </div>
      </template>
      <template #footer>
        <UButton @click="showModal = false" color="gray" variant="solid">
          Close
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { parseSCRMessage } from '@/utils/SCR.ts' // Assuming the parser function is in the same directory

// Local state
const scrTelex = ref('')
const showModal = ref(false)
const parsedResult = ref(null)

// Function to parse the SCR telex and show the result in the modal
function parseTelex() {
  try {
    parsedResult.value = parseSCRMessage(scrTelex.value)
    showModal.value = true
  } catch (error) {
    console.error('Failed to parse SCR message:', error)
    alert('Failed to parse SCR message. Please check the format.')
  }
}
</script>

<style scoped>
.scr-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
