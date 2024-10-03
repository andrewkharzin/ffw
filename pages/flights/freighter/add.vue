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

                    <!-- Block to display set form values -->
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <p
                          v-if="form.flight_psd"
                          ref="flightPsdRef"
                          class="typewriter-effect"
                          @animationend="stopBlinkingCaret($refs.flightPsdRef)"
                        >
                          Flight PSD: {{ form.flight_psd }}
                        </p>
                      </div>

                      <p
                        v-if="form.flight_pst"
                        ref="flightPstRef"
                        class="typewriter-effect"
                        @animationend="stopBlinkingCaret($refs.flightPstRef)"
                      >
                        Flight PST: {{ form.flight_pst }}
                      </p>

                      <p
                        v-if="form.flight_number"
                        ref="flightNumberRef"
                        class="typewriter-effect"
                        @animationend="stopBlinkingCaret($refs.flightNumberRef)"
                      >
                        Flight Number: {{ form.flight_number }}
                      </p>

                      <p
                        v-if="form.flight_route"
                        ref="flightRouteRef"
                        class="typewriter-effect"
                        @animationend="stopBlinkingCaret($refs.flightRouteRef)"
                      >
                        Flight Route: {{ form.flight_route }}
                      </p>

                      <p
                        v-if="form.ac_register"
                        ref="acRegisterRef"
                        class="typewriter-effect"
                        @animationend="stopBlinkingCaret($refs.acRegisterRef)"
                      >
                        Aircraft Registration: {{ form.ac_register }}
                      </p>
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
  connection_flight_psd: '',
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

const handleSubmit = async () => {
  console.log('Submitting form:', form.value)
  try {
    alert('Freighter flight added successfully!')
  } catch (err) {
    console.error('Error adding freighter flight:', err)
    alert('Failed to add freighter flight.')
  }
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
</style>
