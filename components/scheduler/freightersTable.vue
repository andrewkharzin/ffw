<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { formatOnlyDate, formatOnlyTime } from '@/configs/date_util'
import Plane from '~/assets/images/plane_sch.svg'
import { generateFFMPdf } from '@/utils/generators/manifestv2'

// Define the message types you want to chec
const messageTypes = ['FFM', 'CPM', 'LDM', 'FWB'] as const
type MessageType = (typeof messageTypes)[number]

// Define a reactive variable for detecting small screens (iPhones)
const isSmallScreen = ref(false)

// Props
const props = defineProps<{
  freighters: any[]
  loading: boolean
  flt_messages: { message_type: MessageType }[]
}>()
generateFFMPdf()
// Columns
const columns = [
  {
    key: 'Date_request',
    label: 'Date Req',
    sortable: true,
    width: '10%', // Fixed width
  },
  {
    key: 'Airline_info',
    label: 'Airline',
    sortable: false,
    width: '40%', // Fixed width
  },
  {
    key: 'Date',
    label: 'Date',
    sortable: true,
    width: '10%', // Fixed width
  },
  // {
  //   key: 'flight_pst',
  //   label: 'Time',
  //   sortable: false,
  // },

  // {
  //   key: 'flight_number',
  //   label: 'Flight Number',
  //   sortable: true,
  // },
  {
    key: 'flight_route',
    label: 'Route',
    sortable: true,
    width: '30%', // Fixed width
  },
  // {
  //   key: 'flight_handling_status',
  //   label: 'Status',
  //   sortable: true,
  // },
  // {
  //   key: 'payload',
  //   label: 'Payload',
  //   sortable: false,
  // },
  // {
  //   key: 'actions',
  //   label: 'Actions',
  //   sortable: false,
  // },
]

const selectedColumns = ref(columns)
// const columnsTable = computed(
//   () => columns.filter((column) => selectedColumns.value.includes(column)),
//   // Remove 'Actions' column if it's a small screen
//   isSmallScreen.value ? columns.key !== 'actions' : true
// )

// Compute the columns for the table, conditionally hide 'Actions', 'Payload', and 'Flight Route' columns on small screens
const columnsTable = computed(
  () =>
    isSmallScreen.value
      ? columns.filter(
          (column) =>
            !['actions', 'payload', 'flight_route'].includes(column.key)
        ) // Exclude 'Actions', 'Payload', and 'Flight Route' columns for small screens
      : columns // Include all columns for larger screens
)

// Selected Rows
const selectedRows = ref([])
// Actions
const actions = [
  [
    {
      key: 'manifest',
      label: 'Manifest',
      icon: 'i-heroicons-check',
    },
  ],
  [
    {
      key: 'uncompleted',
      label: 'In Progress',
      icon: 'i-heroicons-arrow-path',
    },
  ],
]

function select(row) {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}

// Pagination (Example, can be adjusted)
const sort = ref({ column: 'id', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(10)
const pageTotal = computed(() => props.freighters.length)
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
)
// const logoSrc = computed(() => props.freighters.airlines.logo || '')

function getStatusColor(status: string): string {
  switch (status) {
    case 'New':
      return 'pink'
    case 'Canceled':
      return 'gray'
    case 'InPlan':
      return 'sky'
    case 'Completed':
      return 'emerald'
    default:
      return 'orange' // default color if status is not recognized
  }
}

// Reactivity for selected flight

// Modal Logic
const selectedFlight = ref(null) // добавляем реактивное состояние
const isOpen = ref(false)
const selectedConnection = ref(null)

function openConnectionModal(connectionFlight: any) {
  selectedConnection.value = connectionFlight
  isOpen.value = true
}

function closeConnectionModal() {
  isOpen.value = false
  selectedConnection.value = null
}

// Function to check if a message type exists for a freighter
function hasMessageType(
  row: (typeof props.freighters)[0],
  type: MessageType
): boolean {
  return row.flt_messages.some((msg) => msg.message_type === type)
}

// Correct usage of useState with a string key
const showBlock = useState('showBlock', () => true)

// Function to toggle the block visibility
const toggleBlockVisibility = (value: boolean) => {
  showBlock.value = value
}

const handleResize = () => {
  isSmallScreen.value = window.innerWidth <= 768 // Adjust the pixel value for your target screen size
}

// Add resize event listener to update screen size check
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <UCard
    class="w-full"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: {
        padding: '',
        base: 'divide-y divide-gray-200 dark:divide-gray-700',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <template #header>
      <div class="flex flex-row">
        <h2
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight text-left"
        >
          Freighters
        </h2>
        <!-- UToggle component with two-way binding for the toggle state -->
      </div>
      <div class="flex flex-row-reverse">
        <div>
          <span> Advanced View </span>
          <UToggle
            class=""
            color="primary"
            :model-value="showBlock"
            @update:model-value="toggleBlockVisibility"
          />
        </div>
      </div>
      <UButton
        v-if="selectedRows.length > 0"
        @click="generateFFMPdf(selectedRows[0].parsedFFM)"
      >
        Download FFM Report
      </UButton>
    </template>

    <!-- Table -->
    <UTable
      v-model="selectedRows"
      v-model:sort="sort"
      :rows="freighters"
      :columns="columnsTable"
      :loading="loading"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="{
        td: { base: 'text-left', style: { width: columns.width } },
        th: { base: 'text-left', style: { width: columns.width } },
        default: { checkbox: { color: 'gray' } },
      }"
      @select="select"
    >
      <template #Date_request-data="{ row }">
        <div>
          <p
            class="text-left text-md font-bold text-left dark:text-gray-300 text-sky-700"
          >
            {{ formatOnlyDate(row.flight_psd) }}
          </p>
        </div>
      </template>
      <template #Airline_info-data="{ row }">
        <div class="freighter-header">
          <!-- <div v-if="!isSmallScreen" class="freighter-logo">
            <img :src="row.airlines.logo" alt="Airline Logo" />
          </div> -->
          <div class="freighter-info">
            <div class="flex flex-col text-left">
              <div class="flex flex-row">
                <p
                  class="font-black text-pink-500 text-xl sm:text-md text-left"
                >
                  {{ row.airlines.iata }}
                  <span
                    class="font-bold font-mono text-gray-400 text-xl sm:text-md"
                  >
                    <NuxtLink :to="`/flights/freighter/${row.id}`">
                      {{ row.flight_number }}
                    </NuxtLink>
                  </span>
                </p>
                <p
                  v-if="showBlock"
                  class="font-bold text-xl sm:text-md text-teal-500"
                >
                  | {{ row.aircrafts_register.ac_code }}
                  <span
                    class="font-normal text-xl sm:text-md text-pink-500 font-mono"
                  >
                    <UBadge color="white" variant="solid">{{
                      row.aircrafts_register.ac_registration_number
                    }}</UBadge>
                  </span>
                </p>
              </div>
              <span
                v-if="showBlock"
                class="font-light text-gray-500 text-sm sm:text-xs"
                >{{ row.airlines.name }}</span
              >
            </div>
          </div>
        </div>
      </template>
      <template #Date-data="{ row }">
        <div class="freighter-header flex flex-col text-left">
          <div>
            <span
              v-if="showBlock"
              class="text-[0.6rem] text-tiny uppercase tracking-widest dark:text-gray-500"
              >Planning</span
            >
            <p class="font-bold text-gray-600 text-md sm:text-xs text-left">
              PSD:
              <span class="font-mono text-slate-400 text-left">{{
                formatOnlyDate(row.flight_psd)
              }}</span>
            </p>
            <p class="font-bold text-gray-600 text-md sm:text-xs text-left">
              PST:
              <span class="font-mono text-slate-400 sm:text-xs text-left">{{
                row.flight_pst
              }}</span>
            </p>
          </div>
          <div v-if="showBlock">
            <span
              className="text-[0.6rem] text-tiny uppercase tracking-widest dark:text-gray-500"
            >
              Scheduled
            </span>
            <div className="flex flex-row">
              <Icon v-if="!isSmallScreen" icon="icon-park-outline:schedule" />
              <p
                className="ml-1 font-normal text-pink-600 sm:text-xs sm:text-xs text-left"
              >
                ETA:
                <span className="font-mono text-slate-400 sm:text-xs text-left">
                  14:55 29/08/24
                </span>
              </p>
            </div>
            <div className="flex flex-row">
              <Icon v-if="!isSmallScreen" icon="mdi:airplane-schedule" />
              <p
                className="ml-1 font-normal text-pink-600 sm:text-xs text-left"
              >
                ATA:
                <span className="font-mono text-slate-400 sm:text-xs text-left">
                  15:01 29/08/24
                </span>
              </p>
            </div>
          </div>
        </div>
      </template>

      <template #flight_route-data="{ row }">
        <div class="freighter-header flex flex-col">
          <!-- Check if the flight is inbound -->
          <template v-if="row.flight_type === 'Inbound'">
            <div class="uppercase">
              <span class="font-bold md:text-xl sm:text-md text-left">{{
                row.airports.iata
              }}</span>
              <span class="text-pink-600">→</span>
              <span
                class="font-bold text-xl sm:text-md text-orange-600 text-left"
                >SVO</span
              >
              <!-- <div v-if="showBlock">
                <p
                  class="font-normal text-slate-400 sm:text-xs tracking-widest text-left"
                >
                  {{ row.flight_type }}
                </p>
              </div> -->
            </div>
          </template>

          <!-- If not inbound, consider it outbound -->
          <template v-else>
            <div class="text-left uppercase">
              <span class="font-bold text-xl sm:text-md text-orange-600"
                >SVO</span
              >
              <span class="text-pink-600">→</span>
              <span class="font-bold md:text-xl sm:text-md">{{
                row.airports.iata
              }}</span>
              <div v-if="showBlock">
                <p class="font-normal text-slate-500 tracking-widest">
                  {{ row.flight_type }}
                </p>
              </div>
            </div>
          </template>
          <div v-if="showBlock" class="flex flex-col">
            <span
              class="text-xs sm:text-xs text-tiny font-light uppercase tracking-widest text-sky-600"
              >Connection</span
            >
            <p
              class="mt-1 font-light uppercase text-xs text-gray-400 text-left"
            >
              <UButton
                v-if="
                  row.freight_schedules && row.freight_schedules.flight_number
                "
                size="xs"
                variant="soft"
                color="sky"
                @click.stop="openConnectionModal(row.freight_schedules)"
              >
                {{ row.freight_schedules.airlines.iata
                }}{{ row.freight_schedules.flight_number }}
              </UButton>
              <span v-else class="text-sm font-bold text-pink-400">NO</span>
            </p>
          </div>
        </div>
        <!-- Modal for Flight Details -->
        <UModal v-model="isOpen">
          <UCard
            :ui="{
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
          >
            <template #header>
              <div class="grid grid-cols-2 gap2">
                <div class="freighter-header">
                  <div class="freighter-logo">
                    <!-- Airline Logo (if available) -->
                    <img
                      :src="row.freight_schedules.airlines.logo"
                      alt="Airline Logo"
                    />
                  </div>
                  <div class="freighter-info">
                    <div class="flex flex-col">
                      <p class="font-bold text-pink-500 text-xl">
                        {{ row.freight_schedules.airlines.iata }}
                        <span class="font-bold text-gray-400 text-xl">{{
                          row.freight_schedules.flight_number
                        }}</span>
                      </p>
                      <span class="font-light text-gray-500 text-sm">{{
                        row.freight_schedules.airlines.name
                      }}</span>
                      <p class="font-bold text-sm text-gray-400">
                        {{ row.freight_schedules.aircrafts_register.ac_code }}
                        <span class="font-bold text-sm text-gray-400">{{
                          row.aircrafts_register.ac_registration_number
                        }}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <div class="uppercase">
                    <span class="font-bold text-xl text-left">{{
                      row.freight_schedules.airports.iata
                    }}</span>
                    <span class="text-pink-600">→</span>
                    <span class="font-bold text-xl text-orange-600 text-left"
                      >SVO</span
                    >
                    <p
                      class="font-normal text-slate-400 tracking-widest text-left"
                    >
                      {{ row.freight_schedules.flight_type }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
            <template #default>
              <div class="grid grid-cols-2 gap-2">
                <div class="freighter-header flex flex-col text-left">
                  <h3 class="font-light text-xs text-slate-500">
                    Planning time and date
                  </h3>
                  <p class="mt-2 font-bold text-gray-600 text-md text-left">
                    PSD:
                    <span class="font-mono text-slate-400 text-left">{{
                      formatOnlyDate(row.freight_schedules.flight_psd)
                    }}</span>
                  </p>
                  <p class="font-bold text-gray-600 text-md text-left">
                    PST:
                    <span class="font-mono text-slate-400 text-left">{{
                      row.freight_schedules.flight_pst
                    }}</span>
                  </p>
                </div>
                <div class="freighter-header flex flex-col text-left">
                  <h3 class="font-light text-xs text-slate-500">
                    Scheduled time and date
                  </h3>
                  <p class="mt-2 font-bold text-gray-600 text-md text-left">
                    PSD:
                    <span class="font-mono text-red-400 text-left">{{
                      formatOnlyDate(row.freight_schedules.flight_psd)
                    }}</span>
                  </p>
                  <p class="font-bold text-gray-600 text-md text-left">
                    PST:
                    <span class="font-mono text-red-400 text-left">{{
                      row.freight_schedules.flight_pst
                    }}</span>
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <UButton label="Close" @click="isOpen = false" />
            </template>
          </UCard>
        </UModal>
      </template>
      <template
        v-if="!isSmallScreen"
        #flight_handling_status-data="{ row }"
        class="w-1/4"
      >
        <UBadge
          size="lg"
          :label="row.flight_handling_status"
          :color="getStatusColor(row.flight_handling_status)"
          variant="subtle"
        />
      </template>

      <template v-if="!isSmallScreen" #actions-data="{ row }">
        <UButton
          v-if="row.flight_handling_status !== 'Completed'"
          icon="i-heroicons-check"
          size="2xs"
          color="emerald"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />

        <UButton
          v-else
          icon="i-heroicons-arrow-path"
          size="2xs"
          color="orange"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />
      </template>
      <template v-if="!isSmallScreen" #payload-data="{ row }">
        <div class="flex flex-col">
          <!-- Link to manifest generator -->
          <div class="flex flex-row p-2">
            <UCheckbox disabled label="FFM" :model-value="row.hasFFM" />
            <UCheckbox
              disabled
              label="CPM"
              :model-value="row.hasCPM"
              class="ml-2"
            />
          </div>
          <div v-if="showBlock" class="flex flex-row p-2">
            <UCheckbox disabled label="LDM" :model-value="row.hasLDM" />
            <UCheckbox
              disabled
              label="FWB"
              :model-value="row.hasFWB"
              class="ml-2"
            />
          </div>
          <div v-if="row.hasFFM && row.parsedFFM">
            <div v-if="showBlock" class="flex flex-row">
              <div class="">
                <p class="ml-2 font-bold font-mono">
                  ULD
                  <span class="text-xs text-red-500">{{
                    row.parsedFFM.totalUlds
                  }}</span>
                </p>
              </div>
              <div>
                <p class="ml-1 font-bold font-mono">
                  Pcs
                  <span class="text-xs text-red-500">{{
                    row.parsedFFM.totalPieces
                  }}</span>
                </p>
              </div>
              <div>
                <p class="ml-1 font-bold font-mono">
                  Kgs
                  <span class="text-xs text-red-500">{{
                    row.parsedFFM.totalWeight
                  }}</span>
                </p>
              </div>
              <div>
                <p class="ml-1 font-bold font-mono"></p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Showing
            <span class="font-medium">{{ pageFrom }}</span>
            to
            <span class="font-medium">{{ pageTo }}</span>
            of
            <span class="font-medium">{{ pageTotal }}</span>
            results
          </span>
        </div>

        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline',
              },
            },
          }"
        />
      </div>
    </template>
  </UCard>
</template>

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
  align-items: left;
  margin-bottom: 1rem;
}

.freighter-logo img {
  max-width: 50px;
}

.freighter-info {
  flex-grow: 1;
  /* margin-left: 1rem; */
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
