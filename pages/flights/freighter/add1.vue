<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <UCard>
        <div class="add-freighter-form">
          <form @submit.prevent="handleSubmit">
            <div class="grid-container">
              <UFormGroup label="Flight Number" required>
                <UInput
                  id="flight_number"
                  v-model="form.flight_number"
                  placeholder="Enter flight number"
                  required
                />
              </UFormGroup>

              <UFormGroup label="Flight Type" required>
                <USelect id="flight_type" v-model="form.flight_type" required>
                  <option value="Arrival">Arrival</option>
                  <option value="Departure">Departure</option>
                </USelect>
              </UFormGroup>

              <UFormGroup label="Flight Route" required>
                <UInput
                  id="flight_route"
                  v-model="form.flight_route"
                  placeholder="Enter flight route"
                  required
                />
              </UFormGroup>

              <UFormGroup label="Flight PSD (Date)" required>
                <UInput
                  id="flight_psd"
                  v-model="form.flight_psd"
                  type="date"
                  required
                />
              </UFormGroup>

              <UFormGroup label="Flight PST (Time)" required>
                <UInput
                  id="flight_pst"
                  v-model="form.flight_pst"
                  type="time"
                  required
                />
              </UFormGroup>

              <UFormGroup label="Flight Payload">
                <UInput
                  id="flight_payload"
                  v-model="form.flight_payload"
                  placeholder="Enter payload"
                />
              </UFormGroup>
              <!-- Поле выбора авиакомпании -->
              <UFormGroup label="Airline">
                <div class="form-group">
                  <!-- Button to display selected airline with IATA code in a rounded circle -->
                  <button
                    type="button"
                    :disabled="isLoading"
                    class="relative w-full cursor-default rounded-md bg-slate-900/45 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    aria-haspopup="listbox"
                    aria-expanded="isDropdownOpen"
                    @click="isDropdownOpen = !isDropdownOpen"
                  >
                    <span class="flex items-center">
                      <!-- Show IATA code inside a circle -->
                      <span
                        v-if="selectedAirline"
                        class="p-2 h-8 w-8 border-2 flex-shrink-0 rounded-full border-pink-500 text-white flex items-center justify-center text-xs font-bold"
                      >
                        {{ selectedAirline.iata }}
                      </span>
                      <span
                        v-else
                        class="h-5 w-5 border-2 flex-shrink-0 rounded-full border-gray-500 text-white flex items-center justify-center text-xs"
                      >
                        ?
                      </span>
                      <span class="ml-3 block truncate">
                        {{
                          selectedAirline
                            ? selectedAirline.label
                            : 'Select an Airline'
                        }}
                      </span>
                    </span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"
                    >
                      <svg
                        class="h-5 w-5 text-gray-400"
                        viewBox="0 0 25 25"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>

                  <!-- Dropdown for selecting an airline -->
                  <ul
                    v-if="isDropdownOpen"
                    class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    role="listbox"
                  >
                    <li
                      v-for="item in items"
                      :key="item.value"
                      class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900"
                      role="option"
                      @click="selectAirline(item)"
                    >
                      <div class="flex items-center">
                        <!-- Airline IATA code in a circle -->
                        <span
                          class="h-5 w-5 flex-shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs"
                        >
                          {{ item.iata }}
                        </span>
                        <span class="ml-3 block truncate">{{
                          item.label
                        }}</span>
                      </div>
                      <!-- Selected checkmark -->
                      <span
                        v-if="form.airline === item.value"
                        class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
                      >
                        <svg
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    </li>
                  </ul>

                  <p v-if="isLoading" class="mt-2 text-gray-500">
                    Loading airlines...
                  </p>
                  <p v-if="error" class="mt-2 text-red-600">
                    Error loading airlines: {{ error.message }}
                  </p>
                </div>
                <!-- Display the selected airline name below the dropdown -->
                <div v-if="selectedAirline" class="mt-2 text-sm text-gray-900">
                  Selected Airline: {{ selectedAirline.label }}
                </div>
              </UFormGroup>

              <!-- Conditionally render ac_register form group when an airline is selected -->
              <UFormGroup v-if="selectedAirline" label="Aircraft Registration">
                <UInput
                  v-model="form.ac_register"
                  type="text"
                  size="lg"
                  placeholder="Enter aircraft registration"
                  @focus="isOpen = true"
                />
              </UFormGroup>

              <!-- Selected airline display -->
              <div v-if="selectedAirline" class="mt-2 text-sm text-gray-900">
                Selected Airline: {{ selectedAirline.label }}
              </div>

              <UFormGroup label="Description">
                <UTextarea
                  id="description"
                  v-model="form.description"
                  placeholder="Enter description"
                />
              </UFormGroup>

              <UFormGroup label="Connection ID">
                <UInput
                  id="connection_id"
                  v-model="form.connection_id"
                  placeholder="Enter connection ID"
                />
              </UFormGroup>
            </div>

            <div class="form-actions">
              <button type="submit">Add Freighter Flight</button>
            </div>
          </form>
        </div>
      </UCard>
      <UModal v-model="isOpen" prevent-close>
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Modal
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
            <UCard>
              <!-- Include the registerTable.vue component -->
              <SchedulerTablesAcregisters :aircrafts="aircrafts" />
            </UCard>
          </template>
        </UCard>
      </UModal>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Add Flight' })

const items = ref([
  /* Airline options */
])
const supabase = useSupabaseClient()
const aircrafts = ref([])
const selectedAirline = ref(null)
const isDropdownOpen = ref(false)
const isOpen = ref(false)

const form = ref({
  flight_number: '',
  flight_type: 'Arrival',
  flight_route: '',
  flight_psd: '',
  flight_pst: '',
  flight_payload: '',
  airline: '',
  ac_register: '',
  description: '',
  connection_id: '',
})

// Composable to fetch airlines
const { airlines, isLoading, error, fetchAirlines } = useAirlinesForFreighter()

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
  form.value.airline = item.value
  selectedAirline.value = item
  isDropdownOpen.value = false // Close dropdown after selection
}
// Function to open the modal and fetch aircrafts based on the selected airline's IATA
const openModal = () => {
  if (selectedAirline.value) {
    fetchAircrafts(selectedAirline.value.iata)
    isOpen.value = true
  } else {
    alert('Please select an airline first.')
  }
}
// Form submission handler
const handleSubmit = async () => {
  console.log('Submitting form:', form.value)
  try {
    // Add the submission logic here
    alert('Freighter flight added successfully!')
  } catch (err) {
    console.error('Error adding freighter flight:', err)
    alert('Failed to add freighter flight.')
  }
}
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
