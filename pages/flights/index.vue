<script setup lang="ts">
import { Icon } from '@iconify/vue'
// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Flights' })

// Use color mode
const colorMode = useColorMode()

// Breadcrumb links
const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Flights',
    icon: 'i-heroicons-table-cells',
  },
  {
    label: 'Regular',
    icon: 'mdi:invoice-text-scheduled',
  },
]

// Initialize useRapid composable
const { flightsData, fetchFlights, loading, error } = useRapid()

// Fetch flights data for a specific IATA code
fetchFlights('SVO')

// Prepare items for the carousel based on airline IATA codes
const carouselItems = computed(() => {
  const iataCodes = new Set<string>()

  flightsData.value?.arrivals?.forEach((flight) => {
    flight.airline?.iata && iataCodes.add(flight.airline.iata)
  })

  flightsData.value?.departures?.forEach((flight) => {
    flight.airline?.iata && iataCodes.add(flight.airline.iata)
  })

  return Array.from(iataCodes)
})
</script>

<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutsPageHeadSheduled>
        <UBreadcrumb :links="links" class="p-4" />
      </LayoutsPageHeadSheduled>

      <div class="airlines-grid mt-2">
        <UCard class="bg-gray-900 text-pink-500 rounded-lg p-4">
          <template #header> </template>
          <template #default>
            <div class="grid grid-cols-2">
              <div class="flex justify-between items-center">
                <!-- ICON -->
                <Icon icon="emojione:airplane" />
                <!-- Iconify icon -->
                <NuxtLink to="/flights/regular">
                  <h3
                    class="font-bold text-2xl dark:text-pink-500 hover:text-pink-400"
                  >
                    Flights
                  </h3>
                  <p class="text-gray-400 text-sm tracking-widest">Scheduled</p>
                </NuxtLink>
              </div>
              <div class="mt-2">
                <div v-if="carouselItems.length > 0">
                  <SchedulerCustomCarousel
                    :items="carouselItems"
                    autoplay
                    autoplaySpeed="5000"
                  />
                </div>
                <p v-else class="text-xs text-tiny">
                  No flight data available.
                </p>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="mt-20">
              <p class="font-light text-tiny text-gray-400">
                STATION
                <span class="font-bold font-sans text-pink-400">SVO</span>
              </p>
            </div>
          </template>
        </UCard>
        <UCard class="bg-gray-900 text-pink-500 rounded-lg p-4">
          <template #header>
            <div class="grid grid-cols-2">
              <div class="flex justify-between items-center">
                <!-- <Button icon="emojione-monotone:airplane"></Button> -->
                <NuxtLink to="/flights/freighters">
                  <h3
                    class="font-bold text-2xl dark:text-pink-500 hover:text-pink-400"
                  >
                    Freighters
                  </h3>
                  <p class="text-gray-400 text-sm tracking-widest">Planning</p>
                </NuxtLink>
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
.airlines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* Add media query for smaller screens */
@media (max-width: 640px) {
  .airlines-grid {
    grid-template-columns: 1fr; /* Single column layout on small screens */
  }
}
</style>
