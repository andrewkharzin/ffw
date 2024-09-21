<template>
  <div class="add-freighter-form">
    <form @submit.prevent="submitForm">
      <div>
        <label for="flight_number">Flight Number</label>
        <input v-model="form.flight_number" type="text" id="flight_number" />
      </div>
      <div>
        <label for="flight_type">Flight Type</label>
        <select v-model="form.flight_type" id="flight_type">
          <option value="Arrival">Arrival</option>
          <option value="Departure">Departure</option>
        </select>
      </div>
      <div>
        <label for="flight_route">Flight Route</label>
        <input
          v-model="form.flight_route"
          type="text"
          id="flight_route"
          required
        />
      </div>
      <div>
        <label for="flight_psd">Flight PSD (Date)</label>
        <input v-model="form.flight_psd" type="date" id="flight_psd" />
      </div>
      <div>
        <label for="flight_pst">Flight PST (Time)</label>
        <input v-model="form.flight_pst" type="time" id="flight_pst" />
      </div>
      <div>
        <label for="flight_payload">Flight Payload</label>
        <input v-model="form.flight_payload" type="text" id="flight_payload" />
      </div>
      <div>
        <label for="airline">Airline ID</label>
        <input v-model="form.airline" type="text" id="airline" />
      </div>
      <div>
        <label for="ac_register">Aircraft Register ID</label>
        <input v-model="form.ac_register" type="text" id="ac_register" />
      </div>
      <div>
        <label for="description">Description</label>
        <textarea v-model="form.description" id="description"></textarea>
      </div>
      <div>
        <label for="connection_id">Connection ID</label>
        <input v-model="form.connection_id" type="text" id="connection_id" />
      </div>
      <div>
        <button type="submit">Add Freighter Flight</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { addFreighterFlight, error } = useFreighters()

const flightNumber = ref('')
const flightType = ref('Inbound')
const airline = ref('')

// Add more fields as necessary, matching your table columns

const handleSubmit = () => {
  const newFreighterData = {
    flight_number: flightNumber.value,
    flight_type: flightType.value,
    airline: airline.value,
    // Add more fields here
  }

  addFreighterFlight(newFreighterData)
}
</script>

<style scoped>
.add-freighter-form {
  max-width: 600px;
  margin: 0 auto;
}
.add-freighter-form label {
  display: block;
  margin-bottom: 0.5rem;
}
.add-freighter-form input,
.add-freighter-form select,
.add-freighter-form textarea {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
.add-freighter-form button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}
.add-freighter-form button:hover {
  background-color: #0056b3;
}
</style>
