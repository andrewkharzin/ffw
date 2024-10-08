<script setup lang="ts">
import { Icon } from '@iconify/vue'
// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Flights' })

// Use color mode
const colorMode = useColorMode()
// Dynamically set background image using TypeScript
// const backgroundImage = '~/assets/images/covers/cargo_fplane.jpg'

// // Computed style object
// const backgroundStyle = computed(() => ({
//   backgroundImage: `url(${backgroundImage})`,
// }))

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
          <template #header>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <h3
                  class="font-bold text-2xl dark:text-pink-500 hover:text-pink-400"
                >
                  Flights
                </h3>
                <p class="text-gray-400 text-sm tracking-widest">Scheduled</p>
              </div>
              <div class="mt-2">
                <div v-if="carouselItems.length > 0">
                  <SchedulerCustomCarousel
                    :items="carouselItems"
                    autoplay
                    autoplay-speed="5000"
                  />
                </div>
                <p v-else class="text-xs text-tiny">
                  No flight data available.
                </p>
              </div>
            </div>
          </template>
          <template #default>
            <div class="grid grid-cols-2">
              <div class="flex justify-between items-center">
                <!-- Iconify icon -->
                <NuxtLink to="/flights/regular"> </NuxtLink>
              </div>
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
          <template #default>
            <div class="grid grid-cols-2">
              <div class="flex justify-between items-center">
                <!-- Iconify icon -->
              </div>
            </div>
          </template>
        </UCard>
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<style scoped>
.absolute.inset-0 {
  background-size: cover;
  background-position: center;
}
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
