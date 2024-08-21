<template>
  <UCard class="w-full" :ui="cardUi">
    <!-- Header -->
    <template #header>
      <h2
        class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
      >
        Flights
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
      <template #status-data="{ row }">
        <UBadge
          size="xs"
          :label="row.status"
          :color="statusColor(row.status)"
          variant="subtle"
        />
      </template>

      <template #airline-data="{ row }">
        {{ row.airline.name }}
      </template>

      <template #aircraft-reg-data="{ row }">
        {{ row.aircraft.reg }}
      </template>

      <template #departure-scheduledTime-local-data="{ row }">
        {{ row.departure.scheduledTime.local }}
      </template>

      <template #arrival-scheduledTime-local-data="{ row }">
        {{ row.arrival.scheduledTime.local }}
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
  <pre>{{ paginatedFlights }}</pre>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  flightsData: any[]
  filterType: string
}>()

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

// Data and Computed properties
// const columns = [
//   { key: 'airlineInfo', label: 'Airline Info', sortable: false },
//   { key: 'aircraftReg', label: 'Aircraft Registration', sortable: true },
//   { key: 'departureTime', label: 'Departure Time', sortable: true },
//   { key: 'arrivalTime', label: 'Arrival Time', sortable: true },
//   { key: 'status', label: 'Status', sortable: false },
//   { key: 'terminal', label: 'Terminal', sortable: false },
//   { key: 'gate', label: 'Gate', sortable: false },
// ]

const columns = [
  { key: 'airline', label: 'Airline Info', sortable: false },
  { key: 'aircraft.reg', label: 'Aircraft Registration', sortable: true },
  {
    key: 'departure.scheduledTime.local',
    label: 'Departure Time',
    sortable: true,
  },
  { key: 'arrival.scheduledTime.local', label: 'Arrival Time', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'departure.terminal', label: 'Terminal', sortable: false },
  { key: 'departure.gate', label: 'Gate', sortable: false },
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
const pageCount = ref(10)
const pageTotal = ref(0)
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
  return props.flightsData
    .filter((flight: any) => {
      return (
        statusFilter.value.length === 0 ||
        statusFilter.value.includes(flight.status)
      )
    })
    .slice((page.value - 1) * pageCount.value, page.value * pageCount.value)
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
