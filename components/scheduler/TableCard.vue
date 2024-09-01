<template>
  <div class="freighter-card">
    <div class="freighter-header">
      <div class="freighter-logo">
        <!-- Airline Logo (if available) -->
        <img :src="logoSrc" alt="Airline Logo" v-if="logoSrc" />
      </div>
      <div class="freighter-info">
        <div class="flight-number">
          <span>{{ freighter.flight_number }}</span>
        </div>
        <div class="flight-route">
          <span>{{ departureIata }}</span>
          <span>→</span>
          <span>{{ arrivalIata }}</span>
        </div>
        <div class="flight-type">{{ freighter.flight_type }}</div>
      </div>
      <div class="freighter-status">
        <span>{{ freighter.flight_handling_status }}</span>
      </div>
    </div>

    <div class="freighter-body">
      <div class="freighter-details">
        <div>
          <span>PSD:</span>
          <span>{{ freighter.flight_psd }}</span>
        </div>
        <div>
          <span>PST:</span>
          <span>{{ freighter.flight_pst }}</span>
        </div>
        <div>
          <span>PAYLOAD:</span>
          <span>{{ freighter.flight_payload }} кг</span>
        </div>
        <div>
          <span>HSTATUS:</span>
          <span>{{ freighter.flight_handling_status }}</span>
        </div>
      </div>
      <div class="freighter-footer">
        <span>CONNECTED: {{ connectedFlightNumber }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  freighter: any
}>()

// Computed properties to extract data
const departureIata = computed(() => props.freighter.departure_iata || 'N/A')
const arrivalIata = computed(() => props.freighter.arrival_iata || 'N/A')
const connectedFlightNumber = computed(() => props.freighter.connected_flight_number || 'N/A')
const logoSrc = computed(() => props.freighter.airline_logo || '')
</script>

<style scoped>
.freighter-card {
  background-color: #0f1d2c;
  color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  font-family: Arial, sans-serif;
  max-width: 350px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

.freighter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.freighter-logo img {
  max-width: 50px;
}

.freighter-info {
  flex-grow: 1;
  margin-left: 1rem;
}

.freighter-info .flight-number {
  font-size: 1.5rem;
  font-weight: bold;
}

.freighter-info .flight-route {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1.2rem;
}

.freighter-info .flight-type {
  font-size: 0.9rem;
  font-weight: normal;
  color: #b0bec5;
}

.freighter-status {
  color: #ff4081;
  font-size: 1rem;
  font-weight: bold;
}

.freighter-body {
  border-top: 1px solid #37474f;
  padding-top: 1rem;
}

.freighter-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
}

.freighter-details div span:first-child {
  color: #b0bec5;
  font-weight: bold;
  margin-right: 0.5rem;
}

.freighter-details div span:last-child {
  color: #ffffff;
}

.freighter-footer {
  margin-top: 1rem;
  color: #b0bec5;
  font-size: 0.8rem;
  text-align: right;
}
</style>
