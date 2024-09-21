<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <div>
        <div class="add-freighter-form">
          <form @submit.prevent="handleSubmit">
            <div class="">
              <UCard>
                <template #header>
                  <div class="flex flex-col space-y-6">
                    <p class="text-sm font-light dark:text-gray-400">
                      Base information
                    </p>
                    <div class="grid grid-cols-4">
                      <!-- Display dynamic notification with a plane icon when connection flight is set -->
                      <!-- Display dynamic notification with flight number and plane icon -->
                      <p
                        v-if="form.connection_id"
                        class="typewriter-placeholder text-lg font-semibold text-sky-500"
                      >
                        Connection Set ✈️ -
                        <span
                          class="font-black font-mono text-xl dark:text-pink-600"
                        >
                          {{ form.connection_flight_number }}
                        </span>
                      </p>
                    </div>
                  </div>

                  <!-- Notification for Connection Flight success -->
                  <!-- <UNotification
                    v-if="showNotification"
                    description="Connection Flight was set successfully"
                    :id="1"
                    :timeout="3000"
                    title="Notification"
                  /> -->
                </template>
                <div class="grid grid-cols-4 gap-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex flex-col space-y-6">
                      <UFormGroup label="Flight PSD" required>
                        <UInput
                          id="flight_psd"
                          v-model="form.flight_psd"
                          type="date"
                          required
                        />
                      </UFormGroup>
                      <UFormGroup label="Flight PST" class="" required>
                        <UInput
                          v-model="form.flight_pst"
                          type="time"
                          required
                        />
                      </UFormGroup>
                    </div>
                    <div class="flex flex-col space-y-6">
                      <UFormGroup label="Flight Type" required>
                        <USelect
                          v-model="selectedFlightType"
                          :options="flightTypes"
                          required
                        />
                      </UFormGroup>
                      <UFormGroup label="Flight Number" class="" required>
                        <UInput
                          v-model="form.flight_number"
                          placeholder="Enter flight number"
                          required
                        />
                      </UFormGroup>
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <UFormGroup label="Airline" class="">
                      <SchedulerUiAirlineDropdown
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
                      class="mt-5"
                    >
                      <UInput
                        v-model="form.ac_register"
                        placeholder="Aircraft registration"
                        @focus="openModal"
                        class="slide-up"
                      />
                    </UFormGroup>
                  </div>
                  <div class="flex flex-col">
                    <UFormGroup label="Flight Route" required>
                      <UInput
                        id="flight_route"
                        v-model="form.flight_route"
                        placeholder="Enter flight route"
                        required
                      />
                      <!-- <SchedulerUiAirportDropdown /> -->
                    </UFormGroup>
                    <!-- <UFormGroup label="Connection flight" class="mt-5">
                      <UInput
                        id="connection_id"
                        :value="
                          form.connection_id
                            ? form.connection_id.flight_number
                            : ''
                        "
                        placeholder="Select connection flight"
                        readonly
                      />
                    </UFormGroup> -->

                    <!-- Include the child component -->
                    <UFormGroup label="Connection flight" class="mt-5">
                      <SchedulerUiConnectionFlight
                        @select-flight="updateConnectionId"
                      />
                    </UFormGroup>
                  </div>
                </div>
              </UCard>
              <UCard class="mt-4" background="slate-900/50">
                <template #header>
                  <p class="text-sm font-light dark:text-gray-400">
                    Airline/Aircraft information
                  </p>
                </template>
              </UCard>
            </div>

            <div class="form-actions mt-4">
              <UButton type="ghost" color="pink">Add Freighter Flight</UButton>
            </div>
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
// import { useSupabaseClient } from '@supabase/vue'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Add Flight' })

// Initialize state variables
const flightTypes = ['Arrival', 'Departure']
const selectedFlightType = ref(flightTypes[0])
const items = ref([])
const supabase = useSupabaseClient()
const selectedAirline = ref(null)
const isDropdownOpen = ref(false)
const isOpen = ref(false)
const date = ref(new Date())
// Add state for the notification
const showNotification = ref(false)

// Form state
const form = ref({
  flight_number: '',
  flight_type: '',
  flight_route: '',
  flight_psd: '',
  flight_pst: '',
  flight_payload: '',
  airline: '',
  ac_register: '',
  description: '',
  connection_id: null,
  connection_flight_number: '',
})

// Composable to fetch airlines
const {
  airlines,
  isLoading: isAirlinesLoading,
  error: airlinesError,
  fetchAirlines,
} = useAirlinesForFreighter()

// Composable for fetching aircrafts by IATA
const {
  aircrafts,
  loading: isAircraftsLoading,
  error: aircraftsError,
  fetchAircrafts,
} = useRegisterByIata()

// Fetch airlines on component mount
onMounted(() => {
  fetchAirlines() // Fetch airlines on mount

  // Update the items for the dropdown when airlines data is updated
  watch(airlines, (newAirlines) => {
    if (newAirlines) {
      items.value = newAirlines.map((airline) => ({
        label: `${airline.name} (${airline.iata})`,
        value: airline.id,
        iata: airline.iata, // Add the IATA code for display
      }))
    }
  })
})

// Function to handle airline selection
const selectAirline = (item: any) => {
  form.value.airline = item.value // Set airline ID in the form
  selectedAirline.value = item
  isDropdownOpen.value = false // Close dropdown after selection

  // Fetch aircrafts for the selected airline
  fetchAircrafts(item.value)
}

// Method to handle aircraft selection
const selectAircraft = (aircraft) => {
  form.value.ac_register = aircraft.ac_registration_number
  isOpen.value = false // Close the modal
  console.log('Selected Aircraft:', aircraft) // Debugging line
}

// Function to open the modal
const openModal = () => {
  if (selectedAirline.value) {
    fetchAircrafts(selectedAirline.value.iata) // Fetch aircrafts for the selected airline
    isOpen.value = true // Open the modal
  } else {
    console.log('No airline selected') // Debugging line
  }
}

// Update form connection_id when flight is selected
// Function to update form connection_id when flight is selected
const updateConnectionId = (flight, flightNumber) => {
  // Only trigger notification if a valid connection flight is selected
  if (flight) {
    form.value.connection_id = flight
    form.value.connection_flight_number = flightNumber

    // Show the notification after setting connection flight
    showNotification.value = true

    // Auto-hide the notification after 3 seconds
    setTimeout(() => {
      showNotification.value = false
    }, 1200)
  } else {
    form.value.connection_id = null
    form.value.connection_flight_number = ''
    // Do not trigger the notification when reset or no flight is selected
    showNotification.value = false
  }
}

// Form submission handler
const handleSubmit = async () => {
  console.log('Submitting form:', form.value)
  try {
    // Add your submission logic here
    alert('Freighter flight added successfully!')
  } catch (err) {
    console.error('Error adding freighter flight:', err)
    alert('Failed to add freighter flight.')
  }
}
</script>

<style scoped>
/* Slide-in animation */
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

/* Typewriter effect for placeholder */
@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.typewriter-placeholder {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 0.15em solid;
  animation: typewriter 4s steps(40, end) 1s 1 normal both,
    blink-caret 500ms steps(40, end) infinite;
}

/* Blinking caret effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: currentColor;
  }
}
</style>
