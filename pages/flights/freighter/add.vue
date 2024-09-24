<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
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
                    <div class="grid grid-cols-1 md:grid-cols-4">
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
                        required
                      />
                    </UFormGroup>
                    <UFormGroup label="Connection flight">
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
useHead({ title: 'Add Flight' })

const flightTypes = ['Arrival', 'Departure']
const selectedFlightType = ref(flightTypes[0])
const items = ref([])
const selectedAirline = ref(null)
const isDropdownOpen = ref(false)
const isOpen = ref(false)
const showNotification = ref(false)

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
})

// Airline fetching logic (from your composable)
const { airlines, isLoading, error, fetchAirlines } = useAirlinesForFreighter()

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
  form.value.airline = item.value
  selectedAirline.value = item
  isDropdownOpen.value = false
  fetchAircrafts(item.value)
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

const updateConnectionId = (flight, flightNumber) => {
  if (flight) {
    form.value.connection_id = flight
    form.value.connection_flight_number = flightNumber
    showNotification.value = true
    setTimeout(() => (showNotification.value = false), 1200)
  } else {
    form.value.connection_id = null
    form.value.connection_flight_number = ''
  }
}

const handleSubmit = async () => {
  console.log('Submitting form:', form.value)
  try {
    alert('Freighter flight added successfully!')
  } catch (err) {
    console.error('Error adding freighter flight:', err)
    alert('Failed to add freighter flight.')
  }
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
  animation: typewriter 2s steps(40, end) 1s 1 normal both,
    blink-caret 500ms steps(40, end) infinite;
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
</style>
