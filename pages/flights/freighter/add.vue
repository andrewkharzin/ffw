<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutsPageHeader>
        <UBreadcrumb :links="links" class="p-4" />
      </LayoutsPageHeader>
      <div class="p-4 md:p-8">
        <div class="add-freighter-form">
          <form @submit.prevent="handleSubmit">
            <div>
              <UCard>
                <template #header>
                  <div class="flex flex-col space-y-4 md:space-y-6">
                    <p class="text-sm font-light dark:text-gray-400">
                      Base information
                    </p>
                    <!-- Success message -->
                    <span v-if="successMessage" class="success-message">{{
                      successMessage
                    }}</span>

                    <!-- Error message -->
                    <span v-if="error" class="error-message">{{ error }}</span>

                    <!-- Block to display set form values -->
                    <div class="grid grid-cols-2 gap-2">
                      <div class="flex flex-col">
                        <p
                          v-if="form.flight_psd"
                          ref="flightPsdRef"
                          class="typewriter-effect text-sm font-light"
                          @animationend="stopBlinkingCaret($refs.flightPsdRef)"
                        >
                          Flight PSD: {{ form.flight_psd }}
                        </p>
                        <p
                          v-if="form.flight_pst"
                          ref="flightPstRef"
                          class="typewriter-effect text-sm font-light"
                          @animationend="stopBlinkingCaret($refs.flightPstRef)"
                        >
                          Flight PST: {{ form.flight_pst }}
                        </p>
                        <p
                          v-if="form.flight_route"
                          ref="flightRouteRef"
                          class="typewriter-effect text-sm font-light"
                          @animationend="
                            stopBlinkingCaret($refs.flightRouteRef)
                          "
                        >
                          Flight Route: {{ form.flight_route }}
                        </p>
                      </div>
                      <div class="flex flex-col">
                        <p
                          v-if="form.flight_number"
                          ref="flightNumberRef"
                          class="typewriter-effect text-sm font-light"
                          @animationend="
                            stopBlinkingCaret($refs.flightNumberRef)
                          "
                        >
                          Flight Number: {{ form.flight_number }}
                        </p>
                        <p
                          v-if="form.ac_register"
                          ref="acRegisterRef"
                          class="typewriter-effect text-sm font-light"
                          @animationend="stopBlinkingCaret($refs.acRegisterRef)"
                        >
                          Aircraft Registration: {{ form.ac_register }}
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="form.connection_id"
                      class="grid grid-cols-1 md:grid-cols-4"
                    >
                      <p
                        class="typewriter-placeholder text-lg font-semibold text-sky-500"
                      >
                        Connection Set ✈️ -
                        <span
                          class="font-black font-mono text-xl dark:text-pink-600"
                        >
                          {{ form.connection_flight_number }}
                        </span>
                        <br />
                      </p>
                    </div>
                  </div>
                </template>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col space-y-4 md:space-y-6">
                      <UFormGroup label="Flight PSD" required>
                        <UInput
                          id="flight_psd"
                          v-model="form.flight_psd"
                          type="date"
                          required
                        />
                      </UFormGroup>
                      <UFormGroup label="Flight PST" required>
                        <UInput
                          v-model="form.flight_pst"
                          type="time"
                          required
                        />
                      </UFormGroup>
                    </div>
                    <div class="flex flex-col space-y-4 md:space-y-6">
                      <UFormGroup label="Flight Type" required>
                        <USelect
                          v-model="selectedFlightType"
                          :options="flightTypes"
                          required
                        />
                      </UFormGroup>
                      <UFormGroup label="Flight Number" required>
                        <UInput
                          v-model="form.flight_number"
                          placeholder="Enter flight number"
                          required
                        />
                      </UFormGroup>
                    </div>
                  </div>

                  <div class="flex flex-col space-y-4 md:space-y-6">
                    <UFormGroup label="Airline">
                      <SchedulerUiAirlineDropdown
                        v-model="newFreighterData.airline"
                        :selected-airline="selectedAirline"
                        :airlines="airlines"
                        :is-loading="isLoading"
                        :error="error"
                        @select-airline="selectAirline"
                      />
                    </UFormGroup>
                    <UFormGroup
                      v-if="selectedAirline"
                      label="Aircraft Registration"
                    >
                      <UInput
                        v-model="form.ac_register"
                        placeholder="Aircraft registration"
                        @focus="openModal"
                        class="slide-up"
                      />
                    </UFormGroup>
                  </div>

                  <div class="flex flex-col space-y-4 md:space-y-6">
                    <UFormGroup label="Flight Route" required>
                      <UInput
                        id="flight_route"
                        v-model="form.flight_route"
                        placeholder="Enter flight route"
                      />
                    </UFormGroup>
                    <UFormGroup label="Connection flight">
                      <SchedulerUiConnectionFlight
                        @select-flight="updateConnectionId"
                      />
                    </UFormGroup>
                  </div>
                </div>
                <UButton
                  class="mt-5"
                  type="ghost"
                  color="sky"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner"></span>
                  <span v-if="!loading">Add Flight</span>
                </UButton>
              </UCard>
            </div>

            <!-- Success message Toast Modal -->
            <div v-if="showToast" class="toast-modal">
              <UCard>
                <p>Flight added successfully!</p>
                <!-- <button @click="goToFlights">Flights</button> -->
                <button @click="addAnotherFlight">Add More</button>
              </UCard>
            </div>

            <!-- Error message -->
            <span v-if="error" class="error-message">{{ error }}</span>

            <div class="form-actions mt-4"></div>
          </form>
        </div>
      </div>

      <!-- Aircraft Registration Modal -->
      <UModal v-model="isOpen" prevent-close>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Select Aircraft Registration
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpen = false"
              />
            </div>
          </template>
          <template #default>
            <SchedulerTablesAcRegisters
              :aircrafts="aircrafts"
              @select="selectAircraft"
            />
          </template>
        </UCard>
      </UModal>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { format } from 'date-fns'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Add Flight' })

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'flights',
    icon: 'i-heroicons-table-cells',
    to: '/flights',
  },
  {
    label: 'freighters',
    icon: 'i-heroicons-table-cells',
    to: '/flights/freighters',
  },
  {
    label: 'New',
    icon: 'i-heroicons-table-cells',
    to: '/flights/freighters/add',
  },
]

const flightTypes = ['Inbound', 'Outbound']
const selectedFlightType = ref(flightTypes[0])
const items = ref([])
const selectedAirline = ref(null)
const isDropdownOpen = ref(false)
const isOpen = ref(false)
const showNotification = ref(false)
const showToast = ref(false) // For showing the toast modal
const successMessage = ref('')

// Define the router instance for redirection
const router = useRouter()

const form = ref({
  flight_number: '',
  flight_type: '',
  flight_route: '',
  flight_psd: '',
  flight_pst: '',
  airline: '',
  ac_register: '',
  connection_id: null,
  connection_flight_number: '',
  connection_flight_psd: '',
})

// Airline fetching logic (from your composable)
const { airlines, isLoading, fetchAirlines } = useAirlinesForFreighter()

// Fetch aircrafts
const { aircrafts, fetchAircrafts } = useRegisterByIata()

onMounted(() => {
  fetchAirlines()

  watch(airlines, (newAirlines) => {
    if (newAirlines) {
      items.value = newAirlines.map((airline) => ({
        label: `${airline.name} (${airline.iata})`,
        value: airline.id,
        iata: airline.iata,
      }))
    }
  })
})

const selectAirline = (item) => {
  console.log('Selected Airline Item:', item)
  newFreighterData.value.airline = item.iata // Adjust this if needed
  selectedAirline.value = item
  isDropdownOpen.value = false

  console.log('Fetching Aircrafts for IATA code:', item.iata)
  fetchAircrafts(item.iata)
}

const selectAircraft = (aircraft) => {
  form.value.ac_register = aircraft.ac_registration_number
  isOpen.value = false
}

const openModal = () => {
  if (selectedAirline.value) {
    fetchAircrafts(selectedAirline.value.iata)
    isOpen.value = true
  }
}

const updateConnectionId = (flight, flightNumber, flightPsd) => {
  if (flight) {
    form.value.connection_id = flight
    form.value.connection_flight_number = flightNumber
    form.value.connection_flight_psd = flightPsd
    showNotification.value = true
    setTimeout(() => (showNotification.value = false), 1200)
  } else {
    form.value.connection_id = null
    form.value.connection_flight_number = ''
    form.value.connection_flight_psd = ''
  }
}

const { addFreighterFlight, loading } = useFreighters()

const newFreighterData = ref({
  flight_number: form.value.flight_number, // Flight number (string)
  flight_route: form.value.flight_route, // Route for the flight (string or array, depending on how you store it)
  airline: '', // Airline code or name (string)
  ac_register: '', // Aircraft registration (string)
  flight_type: 'Inbound', // Flight type ('Inbound' or 'Outbound')
  flight_psd: '', // Planned Start Date (datetime string)
  flight_pst: '', // Planned Start Time (datetime string)
  connection_id: null, // Connection ID if applicable (nullable, possibly a number or string)
  flight_handling_status: '', // Handling status (string, can be values like 'scheduled', 'on-ground', 'departed', etc.)
  airports: [], // Array of airport IATA codes in the flight route
  aircrafts_register: '', // Aircraft registration details (string or object, depending on your schema)
  freighter_schedules: [], // Nested freighter schedules (optional, depending on your use case)
})

const handleSubmit = async () => {
  try {
    // Debugging: log form data before submission
    console.log('Form data before submit:', form.value)

    // Populate newFreighterData with form values
    newFreighterData.value = {
      flight_number: form.value.flight_number,
      flight_route: form.value.flight_route,
      // airline: form.value.airline, // Ensure this is correct

      airline: selectedAirline.value?.iata || '', // Ensure this is correct
      ac_register: form.value.ac_register,
      flight_type: selectedFlightType.value,
      flight_psd: form.value.flight_psd,
      flight_pst: form.value.flight_pst,
      connection_id: form.value.connection_id,
    }

    // Log the populated newFreighterData for debugging
    console.log('newFreighterData:', newFreighterData.value)

    // Extract IATA code and aircraft registration number
    const iataCode = newFreighterData.value.airline
    const aircraftRegistrationNumber = newFreighterData.value.ac_register

    // Проверка IATA-кода
    if (!iataCode) {
      throw new Error('IATA code is required to fetch the airline.')
    }

    // Check for the presence of the aircraft registration number
    if (!aircraftRegistrationNumber) {
      throw new Error('Aircraft registration number is required.')
    }

    // If all checks are passed, proceed to add the freighter flight
    await addFreighterFlight(newFreighterData.value)

    // Show the success toast modal after submission
    showToast.value = true
  } catch (err) {
    console.error('Failed to add freighter flight:', err)
    err.value = 'Failed to add freighter flight. Please try again later.'
  } finally {
    loading.value = false
  }
}

const goToFlights = () => {
  // Redirect the user to the /flights/freighters page
  router.push('/flights/freighters')
}

const addAnotherFlight = () => {
  // Clear the form and hide the toast modal
  resetForm()
  showToast.value = false
}

const resetForm = () => {
  // Reset form fields here
  successMessage.value = ''
}

const formatConnectionDate = (date) => {
  return format(new Date(date), 'yyyy-MM-dd') // Adjust the date format if necessary
}

const formatConnectionTime = (date) => {
  return format(new Date(date), 'HH:mm') // Adjust the time format if necessary
}

const stopBlinkingCaret = (elementRef) => {
  nextTick(() => {
    // Set a timeout to match the length of the typewriter animation and the initial delay
    setTimeout(() => {
      if (elementRef && elementRef.classList) {
        elementRef.classList.add('hide-caret') // Hide the blinking caret
        elementRef.classList.add('flash-background') // Trigger the background flash effect
      }
    }, 1000) // Total duration: 2s animation + 1s delay
  })
}
</script>

<style scoped>
@keyframes slideRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slideRight 0.5s ease-out;
}
.typewriter-placeholder {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 0.15em solid;
  animation: typewriter 2s steps(40, end) 1s 1 normal both,
    blink-caret 500ms steps(40, end) infinite;
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: currentColor;
  }
}

@keyframes flash-background {
  0% {
    background-color: yellow;
  }
  100% {
    background-color: transparent;
  }
}

.typewriter-effect {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 0.15em solid;
  animation: typewriter 2s steps(40, end) 1s 1 normal both,
    blink-caret 500ms steps(40, end) infinite;
}

.typewriter-effect.hide-caret {
  border-right: none;
}

.typewriter-effect.flash-background {
  animation: flash-background 0.5s ease-in-out forwards;
}

.success-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Toast Modal Styles */
.toast-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  text-align: center;
  z-index: 1000;
}

.toast-modal button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.toast-modal button:hover {
  background-color: #0056b3;
}
</style>
