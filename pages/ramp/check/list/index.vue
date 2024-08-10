<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutsPageHeader>
        <UBreadcrumb :links="links" />
      </LayoutsPageHeader>

      <div>
        <LayoutsAppbar
          class="mt-5"
          :airline-options="airlineOptions"
          @open-slide-over="isOpen = true"
          @update-filters="updateFilters"
        />

        <USlideover v-model="isOpen" prevent-close class="dark:bg-slate-900">
          <UCard
            class="dark:bg-slate-900 bg-white flex flex-col flex-1"
            :ui="{
              body: { base: 'flex-1' },
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                >
                  Create Check
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

            <UForm
              :schema="schema"
              :state="form"
              class="space-y-4"
              @submit="onSubmit"
            >
              <!-- Status field with select component -->
              <UFormGroup label="Status" name="status">
                <USelect
                  v-model="form.status"
                  :options="statusOptions"
                  class="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                />
              </UFormGroup>

              <UFormGroup label="Date" name="data">
                <UPopover :popper="{ placement: 'bottom-start' }">
                  <UButton
                    icon="i-heroicons-calendar-days-20-solid"
                    :label="format(date, 'd MMM, yyy')"
                  />

                  <template #panel="{ close }">
                    <!-- <UiDatePicker v-model="form.data" is-required @close="close" /> -->
                    <DatePicker v-model="form.data" show-button-bar />
                  </template>
                </UPopover>
              </UFormGroup>

              <!-- Updated UFormGroup to use USelect for flight selection with options -->
              <UFormGroup label="Inbound Flight" name="inbound_flight_id">
                <USelect
                  v-model="form.inbound_flight_id"
                  :options="flightOptions"
                  class="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                />
              </UFormGroup>

              <!-- Updated UFormGroup to use USelect for flight selection with options -->
              <UFormGroup label="Outbound Flight" name="outbound_flight_id">
                <USelect
                  v-model="form.outbound_flight_id"
                  :options="flightOptions"
                  class="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
                />
              </UFormGroup>

              <UButton type="submit"> Create </UButton>
            </UForm>
          </UCard>
        </USlideover>

        <div
          class="p-4 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 justify-center"
        >
          <RampCheckCard
            v-for="check in filteredRampChecks"
            :key="check.id"
            :check="check"
            @ramp-check-deleted="fetchRampChecks"
          />
        </div>
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { format } from 'date-fns'

// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css';

const query: QueryBuilderParams = { path: '/ramp/check/list' }

// compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Check List' })

const date = ref(new Date())

const colorMode = useColorMode()

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Flights',
    icon: 'i-heroicons-square-3-stack-3d',
  },
]

const formattedDate = computed(() => {
  return format(date.value, 'd MMM, yyy')
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const userId = computed(() => user.value?.id || null)
const isOpen = ref(false) // Ensure isOpen is defined

const rampChecks = ref([])
const filteredRampChecks = ref([])
const flights = ref([])
const airlines = ref([])

// Status options and selected status state
const selectedStatus = ref('') // State to store selected status filter
const statusOptions = [
  { label: 'All', value: '' }, // Option to show all records
  { label: 'New', value: 'new' },
  { label: 'Approved', value: 'approved' },
]

// Function to fetch ramp checks
const fetchRampChecks = async () => {
  try {
    const { data, error } = await supabase.from('ramp_check').select(`
        id,
        data,
        status,
        created_at,
        inbound_flight_id,
        outbound_flight_id,
        inboundFlight:inbound_flight_id (
          flight_number,
          departure_airport,
          airline_id
        ),
        outboundFlight:outbound_flight_id (
          flight_number,
          destination_airport,
          airline_id
        ),
        user_id,
        user:profiles (avatar_url, username)`)
    if (error) {
      console.error('Error fetching ramp checks:', error.message)
    } else {
      rampChecks.value = data.map((check) => ({
        ...check,
        creator_avatar_url: check.user.avatar_url,
      }))
      applyFilters()
    }
  } catch (error) {
    console.error('Unexpected error fetching ramp checks:', error.message)
  }
}

// Fetch flights
const fetchFlights = async () => {
  try {
    const { data, error } = await supabase
      .from('flights')
      .select('id, flight_number')
    if (error) {
      console.error('Error fetching flights:', error.message)
    } else {
      console.log('Fetched flights:', data) // Added console log to debug fetched flight data
      flights.value = data
    }
  } catch (error) {
    console.error('Unexpected error fetching flights:', error.message)
  }
}

const fetchAirlines = async () => {
  try {
    const { data, error } = await supabase.from('airlines').select('id, iata')
    if (error) {
      console.error('Error fetching airlines:', error.message)
    } else {
      airlines.value = data
    }
  } catch (error) {
    console.error('Unexpected error fetching airlines:', error.message)
  }
}

const flightOptions = computed(() =>
  flights.value.map((flight) => ({
    label: flight.flight_number,
    value: flight.id,
  })),
)

// const airlineOptions = computed(() =>
//   airlines.value.map(airline => ({
//     label: airline.iata,
//     value: airline.id,
//   }))
// );

const airlineOptions = computed(() => [
  { label: 'All', value: null }, // Add this line
  ...airlines.value.map((airline) => ({
    label: airline.iata,
    value: airline.id,
  })),
])

const schema = z.object({
  data: z.date().nullable(),
  status: z.enum(['new', 'approved']).default('new'),
  inbound_flight_id: z.string().nonempty('Inbound Flight ID is required'),
  outbound_flight_id: z.string().nonempty('Outbound Flight ID is required'),
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({
  data: null,
  status: 'new',
  inbound_flight_id: '',
  outbound_flight_id: '',
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    event.data.data = date.value
    const { data, error } = await supabase.from('ramp_check').insert({
      data: event.data.data,
      status: event.data.status,
      inbound_flight_id: event.data.inbound_flight_id,
      outbound_flight_id: event.data.outbound_flight_id,
      user_id: userId.value,
    })
    if (error) {
      console.error('Error inserting ramp check:', error.message)
    } else {
      isOpen.value = false
      fetchRampChecks()
      toast.success('Check Draft added successfully')
      form.data = null
      form.status = 'new'
      form.inbound_flight_id = ''
      form.outbound_flight_id = ''
      date.value = new Date()
    }
  } catch (error) {
    console.error('Unexpected error:', error.message)
  }
}

const { data: realtimeData, subscription } = supabase
  .channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'ramp_check' },
    (payload) => {
      console.log('Change received!', payload)
      fetchRampChecks()
    },
  )
  .subscribe()

onMounted(() => {
  fetchRampChecks()
  fetchFlights()
  fetchAirlines()
})
onUnmounted(() => {
  supabase.removeChannel(subscription)
})

const filters = ref({
  date: null,
  status: null,
  airline: null,
})

const applyFilters = () => {
  filteredRampChecks.value = rampChecks.value.filter((check) => {
    const matchesStatus =
      !filters.value.status || check.status === filters.value.status
    const matchesAirline =
      !filters.value.airline ||
      check.inboundFlight.airline_id === filters.value.airline ||
      check.outboundFlight.airline_id === filters.value.airline

    console.log(
      `Check ID: ${check.id}, Matches Status: ${matchesStatus}, Matches Airline: ${matchesAirline}`,
    )

    return matchesStatus && matchesAirline
  })

  console.log('Filtered Ramp Checks:', filteredRampChecks.value)
}

const updateFilters = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters }
  applyFilters()
}

const onFilterChange = (filterType, value) => {
  if (filterType === 'airline') {
    selectedAirline.value = value // This will handle the "All" case as well
  }
  applyFilters() // Reapply filters after any change
}
</script>
