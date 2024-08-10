<script setup lang="ts">
import type { Database } from '@/types/supabase'
// compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Airline Detail' })

const { fetchAirlineByName } = useAirlines()
const { events } = useAirlineEvent()
// const airline = ref<Database | null>()
const airline = ref<Database['public']['Tables']['airlines']['Row'] | null>()
const event = ref<
  Database['public']['Tables']['airlines_realtime_events']['Row'] | null
>()

const route = useRoute()
const airlineId = route.params.airlineId || ''
const colorMode = useColorMode()

const links = [
  {
    label: 'Airlines',
    icon: 'i-heroicons-home',
    to: '/airlines',
  },
  {
    label: 'Details',
    icon: 'i-heroicons-table-cells',
  },
]

onMounted(async () => {
  const name = route.params.name as string
  airline.value = await fetchAirlineByName(name)
})

// Filter events for the specific airline
const filteredEvents = computed(() => {
  return events.value.filter((event) => event.airline_id === airline.value?.id)
})

// Example of handling a specific event if needed
const specificEvent = computed(() => {
  // For demonstration, we'll filter events to get a specific event.
  // You can adjust the condition to match your use case.
  return events.value.find((e) => e.id === event.value?.id) || null
})
</script>

<template>
  <LayoutsPageWrapper>
    <!-- Bread -->
    <UBreadcrumb :links="links" class="p-4" />
    <LayoutsPageSection>
      <!-- Page bar for airline detail page -->
      <div
        class="w-full p-4 h-15 bg-gray-500 dark:bg-slate-900 rounded-tl-lg rounded-br-lg"
      >
        <div class="flex items-center flex-wrap">
          <NuxtImg :src="airline?.logo" class="w-8 h-8" />
          <div class="ml-4">
            <h1
              class="font-sans font-black dark:text-gray-400 md:text-lg lg:text-xl sm:text-xs"
            >
              {{ airline?.name }}
            </h1>
            <p
              class="text-xs font-bold text-cyan-600 cursor-pointer hover:text-cyan-400 font-normal text-gray-400"
            >
              <AwesomeLink
                class="font-bold"
                :text="airline?.website"
                :href="airline?.website"
              />
              <!-- <a
                :href="airline?.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-bold text-cyan-600 cursor-pointer hover:text-cyan-400"
              >
                {{ airline?.website }}
              </a> -->
            </p>
          </div>
          <div class="ml-auto">
            <AirlinesNotificationBar :airlineId="airline?.id" />
          </div>
        </div>
      </div>

      <!-- End of page bar -->

      <div class="cards-grid">
        <div class="mt-5 flex-initial w-full">
          <AirlinesDetailsCardBaseInfo :airline="airline" />
        </div>
        <div class="mt-5">
          <AirlinesDetailsCardEvents
            :airline="airline"
            :events="filteredEvents"
          />
        </div>
        <div class="mt-5 w-full">
          <!-- <AirlinesDetailsCardAircrafts :airline="airline" /> -->
          <AirlinesDetailsCardAircratfs :airlineId="airline?.id" />
        </div>
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  padding: 10px;
}
</style>
