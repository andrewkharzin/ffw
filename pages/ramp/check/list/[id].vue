<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { locale, setLocale } = useI18n()

// Define the layout for the page
definePageMeta({ layout: 'auth' })
useHead({ title: 'Detail of check' })

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Flights',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/ramp/check/list',
  },
  {
    label: 'Details',
    icon: 'i-heroicons-document-magnifying-glass',
  },
]

// Initialize Supabase client
const supabase = useSupabaseClient()
const route = useRoute()

const rampCheckData = ref(null)
const inboundFlightNumber = ref('')
const outboundFlightNumber = ref('')
const arrivalInfoData = ref(null)
const departureInfoData = ref(null) // New reference for departure info
const controlPointsData = ref(null)

async function fetchFlightNumber(flightId) {
  const { data, error } = await supabase
    .from('flights')
    .select('flight_number', 'departure_airport')
    .eq('id', flightId)
    .single()

  if (error) {
    console.error('Error fetching flight number:', error)
    return ''
  }

  return data.flight_number
}

async function fetchRampCheckData() {
  const { data, error } = await supabase
    .from('ramp_check')
    .select()
    .eq('id', route.params.id)
    .single()

  if (error) {
    console.error('Error fetching ramp check data:', error)
    return
  }

  rampCheckData.value = data

  // Fetch inbound flight number
  if (data.inbound_flight_id) {
    inboundFlightNumber.value = await fetchFlightNumber(data.inbound_flight_id)
  }

  // Fetch outbound flight number
  if (data.outbound_flight_id) {
    outboundFlightNumber.value = await fetchFlightNumber(
      data.outbound_flight_id,
    )
  }
}

async function fetchArrivalInfoData() {
  const { data: ramp_check_arrival, error } = await supabase
    .from('ramp_check_arrival')
    .select(
      `
      created_at,
      documents_time,
      offload_permition_time,
      offload_bulk_time_start,
      offload_bulk_time_end,
      offload_ld_forward_time_start,
      offload_ld_forward_time_end,
      offload_md_time_start,
      offload_md_time_end,
      offload_ld_aft_time_start,
      offload_ld_aft_time_end,
      id,
      ramp_check_id
    `,
    )
    .eq('ramp_check_id', route.params.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      console.warn('No arrival info data found for this ramp check.')
    } else {
      console.error('Error fetching arrival info data:', error)
    }
    return
  }

  arrivalInfoData.value = ramp_check_arrival
}

async function fetchDepartureInfoData() {
  const { data, error } = await supabase
    .from('ramp_check_departure')
    .select(
      `
      created_at,
      documents_time,
      onload_permition_time,
      onload_bulk_time_start,
      onload_bulk_time_end,
      onload_ld_forward_time_start,
      onload_ld_forward_time_end,
      onload_md_time_start,
      onload_md_time_end,
      onload_ld_aft_time_start,
      onload_ld_aft_time_end,
      id,
      ramp_check_id,
      ramp_stuff_stand_time
    `,
    )
    .eq('ramp_check_id', route.params.id)
    .single()

  if (error) {
    console.error('Error fetching departure info data:', error)
    return
  }

  departureInfoData.value = data
}

async function fetchControlPointsData() {
  const { data, error } = await supabase
    .from('ramp_check_control_points')
    .select(
      `
      created_at,
      stuff_ready,
      fuselage_checked,
      edges_of_hatches_checked,
      cargo_comp_checked,
      id,
      ramp_check_id
    `,
    )
    .eq('ramp_check_id', route.params.id)
    .single()

  if (error) {
    console.error('Error fetching control points data:', error)
    return
  }

  controlPointsData.value = data
}

onMounted(() => {
  fetchRampCheckData()
  fetchArrivalInfoData()
  fetchDepartureInfoData()
  fetchControlPointsData()
})
</script>

<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutPageHeader>
        <UBreadcrumb :links="links" />
      </LayoutPageHeader>
      <div class="mt-4">
        <header>
          <div class="grid grid-cols-2 gap-2">
            <AwesomeCard class="p-4 border-hidden dark:bg-slate-800 bg-white">
              <AwesomeCardTitle>
                <p class="text-sm text-tiny font-light ml-2">Flight info</p>
              </AwesomeCardTitle>
              <UDivider size="xs" class="dark:text-cyan-400" />

              <div class="flex flex-col">
                <div class="ml-2 mt-1 flex items-center col-span-3">
                  <Icon
                    name="fa-solid:plane-arrival"
                    size="15px"
                    class="mt-1 mr-2"
                  />
                  <span
                    class="text-sm dark:text-teal-500 text:text-cyan-600 font-bold"
                  >
                    {{ inboundFlightNumber }}
                  </span>
                </div>
                <div class="ml-2 mt-1 flex items-center col-span-3">
                  <Icon
                    name="fa-solid:plane-departure"
                    size="15px"
                    class="mt-1 mr-2"
                  />
                  <span
                    class="text-sm dark:text-teal-500 text:text-cyan-600 font-bold"
                  >
                    {{ outboundFlightNumber }}
                  </span>
                </div>
              </div>
            </AwesomeCard>
            <AwesomeCard class="p-4 border-hidden dark:bg-slate-800 bg-white">
              <AwesomeCardTitle>
                <p class="text-sm text-tiny font-light ml-2">Control Points</p>
              </AwesomeCardTitle>
              <UDivider size="xs" class="dark:text-cyan-400" />

              <div class="grid grid-cols-2 gap-1">
                <div>
                  <div v-if="controlPointsData" class="flex flex-col">
                    <div class="ml-2 mt-1 flex items-center col-span-3">
                      <Icon
                        name="fa6-solid:people-line"
                        size="15px"
                        class="mt-1 mr-2"
                      />
                      <p
                        class="text-xs font-light dark:text-gray-300 text-gray-800"
                      >
                        Personal ready?
                      </p>
                      <span
                        class="ml-4 text-sm dark:text-teal-500 text:text-cyan-600 font-bold"
                      >
                        <template
                          v-if="controlPointsData?.stuff_ready === true"
                        >
                          <Icon
                            name="fa6-solid:check"
                            size="18px"
                            class="font-bold text-green-500"
                          />
                        </template>
                        <template v-else>
                          <!-- Empty space for NO -->
                          <div>
                            <span> N/A </span>
                          </div>
                        </template>
                      </span>
                    </div>
                    <div class="ml-2 mt-1 flex items-center col-span-3">
                      <Icon
                        name="fxemoji:airplane"
                        size="15px"
                        class="mt-1 mr-2"
                      />
                      <p
                        class="text-xs font-light dark:text-gray-300 text-gray-800"
                      >
                        Fuselage checked?
                      </p>
                      <span
                        class="ml-4 text-sm dark:text-teal-500 text:text-cyan-600 font-bold"
                      >
                        <template
                          v-if="controlPointsData?.fuselage_checked === true"
                        >
                          <Icon
                            name="fa6-solid:check"
                            size="18px"
                            class="font-bold text-green-500"
                          />
                        </template>
                        <template v-else>
                          <!-- Empty space for NO -->

                          <div>
                            <span> N/A </span>
                          </div>
                        </template>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <div v-if="controlPointsData" class="flex flex-col">
                      <div class="ml-2 mt-1 flex items-center col-span-3">
                        <Icon
                          name="ic:round-rounded-corner"
                          size="15px"
                          class="mt-1 mr-2"
                        />
                        <p
                          class="text-xs font-light dark:text-gray-300 text-gray-800"
                        >
                          Edges of hatches_checked?
                        </p>
                        <span
                          class="ml-4 text-sm dark:text-teal-500 text:text-cyan-600 font-bold"
                        >
                          <template
                            v-if="
                              controlPointsData?.edges_of_hatches_checked ===
                              true
                            "
                          >
                            <Icon
                              name="fa6-solid:check"
                              size="18px"
                              class="font-bold text-green-500"
                            />
                          </template>
                          <template v-else>
                            <!-- Empty space for NO -->
                            <div>
                              <span> N/A </span>
                            </div>
                          </template>
                        </span>
                      </div>
                      <div class="ml-2 mt-1 flex items-center col-span-3">
                        <Icon
                          name="iconoir:corner-top-left"
                          size="15px"
                          class="mt-1 mr-2"
                        />
                        <p
                          class="text-xs font-light dark:text-gray-300 text-gray-800"
                        >
                          Compartments checked?
                        </p>
                        <span
                          class="ml-4 text-sm dark:text-teal-500 text:text-cyan-600 font-bold"
                        >
                          <template
                            v-if="controlPointsData?.fuselage_checked === true"
                          >
                            <Icon
                              name="fa6-solid:check"
                              size="18px"
                              class="font-bold text-green-500"
                            />
                          </template>
                          <template v-else>
                            <!-- Empty space for NO -->

                            <div>
                              <span> N/A </span>
                            </div>
                          </template>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AwesomeCard>

            <div class="flex flex-col">
              <!-- <span class="mt-1 text-sm dark:text-white text-gray-800">
              {{rampCheckData.data}}
              </span> -->
              <!-- <span class="text-sm dark:text-white text-gray-800">
                 <UBadge size="xs" :color="rampCheckData.status === 'approved' ? 'primary' : 'white'" variant="solid">
                    {{ rampCheckData.status }}
                  </UBadge>
              </span> -->
            </div>
          </div>
        </header>
      </div>

      <div class="mt-4 flex flex-col space-x-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-4 sm:grid-cols-1">
          <!-- <div class="container shadow-md border dark:border-gray-800/80 border-hidden rounded-lg p-2 bg-white dark:bg-slate-900/40">
            <RampCheckTablesBaseInfo
              v-if="rampCheckData"
              :data="rampCheckData.data"
              :inbound_flight_number="inboundFlightNumber"
              :outbound_flight_number="outboundFlightNumber"
              :id="rampCheckData.id"
              :status="rampCheckData.status"
              :user_id="rampCheckData.user_id"
            />
          </div> -->
          <div
            class="container shadow-md border dark:border-gray-800/80 border-hidden rounded-lg p-2 bg-white dark:bg-slate-900/40"
          >
            <RampCheckTablesArrivalInfo
              v-if="arrivalInfoData"
              :id="arrivalInfoData.id"
              :created_at="arrivalInfoData.created_at"
              :documents_time="arrivalInfoData.documents_time"
              :offload_permition_time="arrivalInfoData.offload_permition_time"
              :offload_bulk_time_start="arrivalInfoData.offload_bulk_time_start"
              :offload_bulk_time_end="arrivalInfoData.offload_bulk_time_end"
              :offload_ld_forward_time_start="
                arrivalInfoData.offload_ld_forward_time_start
              "
              :offload_ld_forward_time_end="
                arrivalInfoData.offload_ld_forward_time_end
              "
              :offload_md_time_start="arrivalInfoData.offload_md_time_start"
              :offload_md_time_end="arrivalInfoData.offload_md_time_end"
              :offload_ld_aft_time_start="
                arrivalInfoData.offload_ld_aft_time_start
              "
              :offload_ld_aft_time_end="arrivalInfoData.offload_ld_aft_time_end"
              :ramp_check_id="arrivalInfoData.ramp_check_id"
            />
          </div>
          <div
            class="container shadow-md border dark:border-gray-800/80 border-hidden rounded-lg p-2 bg-white dark:bg-slate-900/40"
          >
            <RampCheckTablesDeparture
              v-if="departureInfoData"
              :created_at="departureInfoData.created_at"
              :documents_time="departureInfoData.documents_time"
              :onload_permition_time="departureInfoData.onload_permition_time"
              :onload_bulk_time_start="departureInfoData.onload_bulk_time_start"
              :onload_bulk_time_end="departureInfoData.onload_bulk_time_end"
              :onload_ld_forward_time_start="
                departureInfoData.onload_ld_forward_time_start
              "
              :onload_ld_forward_time_end="
                departureInfoData.onload_ld_forward_time_end
              "
              :onload_md_time_start="departureInfoData.onload_md_time_start"
              :onload_md_time_end="departureInfoData.onload_md_time_end"
              :onload_ld_aft_time_start="
                departureInfoData.onload_ld_aft_time_start
              "
              :onload_ld_aft_time_end="departureInfoData.onload_ld_aft_time_end"
              :ramp_stuff_stand_time="departureInfoData.ramp_stuff_stand_time"
            />
          </div>
          <!-- <div class="container shadow-md border dark:border-gray-800/80 border-hidden rounded-lg p-2 bg-white dark:bg-slate-900/40">
            <RampCheckTablesControlPoints
              v-if="controlPointsData"
              :stuff_ready="controlPointsData.stuff_ready"
              :fuselage_checked="controlPointsData.fuselage_checked"
              :edges_of_hatches_checked="controlPointsData.edges_of_hatches_checked"
              :cargo_comp_checked="controlPointsData.cargo_comp_checked"
            />
          </div> -->
        </div>
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
/* Add your styles here if needed */
</style>
