<template>
  <UCard class="w-full" :ui="cardUi">
    <!-- Header -->
    <template #header>
      <h2
        class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
      >
        Flights
        {{ isArrival ? 'Arrivals' : 'Departures' }} at SVO
      </h2>
    </template>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search..."
      />
      <USelectMenu
        v-model="selectedStatus"
        :options="statusOptions"
        multiple
        placeholder="Status"
        class="w-40"
      />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Rows per page:</span>
        <USelect
          v-model="pageCount"
          :options="[3, 5, 10, 20, 30, 40]"
          class="me-2 w-20"
          size="xs"
        />
      </div>

      <div class="flex gap-1.5 items-center">
        <UDropdown
          v-if="selectedRows.length > 1"
          :items="actions"
          :ui="{ width: 'w-36' }"
        >
          <UButton
            icon="i-heroicons-chevron-down"
            trailing
            color="gray"
            size="xs"
            >Mark as</UButton
          >
        </UDropdown>

        <!-- UTC/Local Toggle -->
        <!-- <UToggle
          color="primary"
          :model-value="isUtc"
          class="time-format-toggle"
          @update:model-value="(val) => (isUtc = val)"
        /> -->

        <USelectMenu v-model="selectedColumns" :options="columns" multiple>
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs"
            >Columns</UButton
          >
        </USelectMenu>
        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          size="xs"
          :disabled="!isFilterActive"
          @click="resetFilters"
          >Reset</UButton
        >
      </div>
    </div>

    <!-- Table -->
    <UTable
      v-model="selectedRows"
      v-model:sort="sort"
      :rows="paginatedFlights"
      :columns="columnsTable"
      :loading="loading"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="tableUi"
      @select="select"
    >
      <template #expand="{ row }">
        <div class="p-4">
          <p>text</p>
        </div>
      </template>
      <template #status-data="{ row }">
        <UBadge
          size="xs"
          :label="row.status"
          :color="statusColor(row.status)"
          variant="subtle"
        />
      </template>

      <template #airline-data="{ row }">
        <div class="flex items-center space-x-3">
          <!-- IATA Code inside a circle -->
          <div
            class="flex items-center justify-center w-8 h-auto border border-gray-200 rounded-tl-lg rounded-br-lg bg-slate-900 text-gray-200 text-sm font-bold p-2"
          >
            {{ row.airline.iata }}
          </div>

          <!-- Flight Number and Airline Name -->
          <div class="flex flex-col">
            <!-- Flight Number (top right) -->
            <div class="dark:text-green-400 text-sm font-semibold">
              {{ row.number }}
            </div>
            <!-- Airline Name (below flight number) -->
            <div class="text-gray-300 font-bold text-xs">
              {{ row.airline.name }}
            </div>
          </div>
        </div>
      </template>

      <template #aircraft.reg-data="{ row }">
        <div class="flex flex-col">
          <p class="font-bold text-md font-mono text-slate-300">
            {{ row.aircraft.reg }}
          </p>
          <span class="text-tiny text-xs">{{ row.aircraft.model }}</span>
        </div>
      </template>
      <!-- Departure Time Custom Rendering -->

      <template #departure.scheduledTime.local-data="{ row }">
        <div class="flex flex-col">
          <!-- <p class="text-md font-semibold text-sky-100 font-mono">
            {{ formatAndLogTime(row.departure.scheduledTime.local) }}
          </p> -->
          <p class="text-md font-semibold text-red-300 font-mono">
            {{
              row.departure?.scheduledTime?.local
                ? formatAndLogTime(row.departure.scheduledTime.local)
                : 'N/A'
            }}
          </p>
        </div>
      </template>

      <!-- Arrival Time Custom Rendering -->
      <template #arrival.scheduledTime.local-data="{ row }">
        <div>
          <p class="text-md font-semibold text-red-300 font-mono">
            {{
              row.arrival?.scheduledTime?.local
                ? formatAndLogTime(row.arrival.scheduledTime.local)
                : 'N/A'
            }}
          </p>
        </div>
      </template>
      <template #movement.airport.iata-data="{ row }">
        <div v-if="row.movement && row.movement.airport" class="flex flex-col">
          <span class="text-xs font-bold font-mono">
            {{ row.movement.airport.iata }}
          </span>
          <span class="text-xs font-bold font-mono">
            {{ row.movement.airport.icao }}
          </span>
        </div>
        <div v-else class="flex flex-col">
          <span class="text-xs font-bold font-mono text-gray-500">N/A</span>
          <span class="text-xs font-bold font-mono text-gray-500">N/A</span>
        </div>
      </template>
      <!-- isCargo Column -->
      <template #isCargo-data="{ row }">
        <div>
          <UIcon
            :name="
              row.isCargo ? 'emojione:airplane' : 'emojione-monotone:airplane'
            "
          />
        </div>
      </template>

      <template #gate-data="{ row }">
        {{ row.gate }}
      </template>
      <template #actions-data="{ row }">
        <UButton
          v-if="row.status !== 'Departed'"
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
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Showing <span class="font-medium">{{ pageFrom }}</span> to
            <span class="font-medium">{{ pageTo }}</span> of
            <span class="font-medium">{{ pageTotal }}</span> results
          </span>
        </div>
        <UPagination
          v-model="page"
          :page-count="Math.ceil(pageTotal / pageCount)"
          :total="pageTotal"
          :ui="paginationUi"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { formatInTimeZone } from 'date-fns-tz'
import { enUS } from 'date-fns/locale'

const props = defineProps<{
  flightsData: any[]
  filterType: string
}>()

const isUtc = ref(false)
const isArrival = ref(false) // Default to showing departures

const toggleFlightType = () => {
  isArrival.value = !isArrival.value
  fetchFlights(isArrival.value ? 'ARRIVAL' : 'DEPARTURE') // Fetch either arrival or departure data
}

const formatAndLogTime = (timeString: string) => {
  console.log('Time String:', timeString)

  const date = new Date(timeString)
  const formatString = 'dd/MM | HH:mm '
  const timeZone = isUtc.value
    ? 'UTC'
    : Intl.DateTimeFormat().resolvedOptions().timeZone

  return formatInTimeZone(date, timeZone, formatString)
}

// UI configurations
const cardUi = {
  base: '',
  ring: '',
  divide: 'divide-y divide-gray-200 dark:divide-gray-700',
  header: { padding: 'px-4 py-5' },
  body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
  footer: { padding: 'p-4' },
}

const tableUi = {
  td: { base: 'max-w-[0] truncate' },
  default: { checkbox: { color: 'gray' } },
}

const paginationUi = {
  wrapper: 'flex items-center gap-1',
  rounded: '!rounded-full min-w-[32px] justify-center',
  default: { activeButton: { variant: 'outline' } },
}

const columns = [
  { key: 'airline', label: 'Airline', sortable: false },
  {
    key: 'aircraft.reg',
    label: 'Registration',
    sortable: false,
  },
  {
    key: 'departures.movement.scheduledTime.local',
    label: 'Dep/Time',
    sortable: true,
  },
  { key: 'movement.scheduledTime.local', label: 'Arr/Time', sortable: true },
  { key: 'movement.airport.iata', label: 'Arr/Iata', sortable: false },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'isCargo', label: 'Freighter', sortable: false },
  { key: 'departure.terminal', label: 'Terminal', sortable: false },
  // { key: 'departure.gate', label: 'Gate', sortable: false },
]

const selectedColumns = ref(columns)

// const columnsTable = computed(() =>
//   columns.filter((column) => selectedColumns.value.includes(column))
// )
const columnsTable = computed(() =>
  columns.filter((column) =>
    selectedColumns.value.some((selected) => selected.key === column.key)
  )
)

const selectedRows = ref<any[]>([])
function select(row: any) {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) selectedRows.value.push(row)
  else selectedRows.value.splice(index, 1)
}

const actions = [
  [{ key: 'completed', label: 'Completed', icon: 'i-heroicons-check' }],
  [
    {
      key: 'uncompleted',
      label: 'In Progress',
      icon: 'i-heroicons-arrow-path',
    },
  ],
]

const statusOptions = [
  { key: 'departed', label: 'Departed', value: 'Departed' },
  { key: 'scheduled', label: 'Scheduled', value: 'Scheduled' },
  { key: 'checkIn', label: 'CheckIn', value: 'CheckIn' },
  { key: 'canceled', label: 'Canceled', value: 'Canceled' },
]

const search = ref('')
const selectedStatus = ref<any[]>([])
const statusFilter = computed(() =>
  selectedStatus.value.length > 0
    ? selectedStatus.value.map((status) => status.value)
    : []
)

const isFilterActive = computed(
  () => search.value !== '' || selectedStatus.value.length > 0
)

const sort = ref({ column: 'airlineInfo', direction: 'asc' as const })
const page = ref(1)
const pageCount = ref(50)
// Automatically set pageTotal based on filtered flights
const pageTotal = computed(() => filteredFlights.value.length)

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
)

// Use the useRapid composable
const {
  flightsData,
  loading,
  error,
  fetchFlights,
  pageTotal: apiPageTotal,
} = useRapid()

watch([search, statusFilter, page, pageCount], async () => {
  await fetchFlights('SVO') // Fetch flights data based on IATA code
  pageTotal.value = apiPageTotal.value
})

const paginatedFlights = computed(() => {
  return filteredFlights.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value
  )
})

// Automatically calculated based on filtered flights
const filteredFlights = computed(() => {
  const searchTerm = search.value.toLowerCase().trim()
  return props.flightsData.filter((flight: any) => {
    return (
      flight.number.toLowerCase().includes(searchTerm) &&
      (statusFilter.value.length === 0 ||
        statusFilter.value.includes(flight.status))
    )
  })
})

const resetFilters = () => {
  search.value = ''
  selectedStatus.value = []
}

const statusColor = (status: string) => {
  switch (status) {
    case 'Departed':
      return 'emerald'
    case 'Scheduled':
      return 'orange'
    default:
      return 'gray'
  }
}

// console.log('Flights Data:', props.flightsData)
// console.log('Filter Type:', props.filterType)
// console.log('Filtered Flights:', paginatedFlights.value)
console.log('Flight Data Structure:', props.flightsData[0])
</script>

