<template>
  <LayoutsPageWrapper>
    <!-- Breadcrumb -->
    <UBreadcrumb :links="links" class="p-4" />

    <LayoutsPageSection>
      <div v-if="loading" class="p-4 dark:bg-slate-800 dark:text-white">
        Loading aircrafts...
      </div>

      <div v-if="error" class="p-4 dark:bg-red-800 dark:text-white">
        Error: {{ error }}
      </div>

      <div
        v-if="aircrafts.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <UCard
          v-for="aircraft in aircrafts"
          :key="aircraft.id"
          class="rounded-lg bg-slate-800 text-white"
        >
          <!-- Header -->
          <template #header>
            <div class="flex items-center justify-start">
              <!-- Иконка посередине слева -->
              <Icon name="emojione-monotone:airplane" class="mr-2" size="25" />
              <div>
                <!-- REG -->
                <p class="text-lg font-bold dark:text-teal-500">
                  {{ aircraft.ac_registration_number }}
                </p>
                <!-- Модель -->
                <p class="text-sm font-light text-gray-400">
                  {{ aircraft.ac_model }}
                </p>
              </div>
            </div>
          </template>

          <!-- Aircraft Image as Cover -->
          <template #default>
            <NuxtImg
              :src="aircraft.ac_ramp_image"
              alt="Aircraft Ramp Image"
              class="w-full h-auto object-fill"
            />
          </template>
          <!-- Footer -->
          <template #footer>
            <NuxtLink
              :to="`/aircraft/${aircraft.id}`"
              class="text-blue-500 hover:underline"
            >
              <UButton color="gray">Detail</UButton>
            </NuxtLink>
          </template>
        </UCard>
      </div>

      <div
        v-else-if="!loading && !aircrafts.length"
        class="p-4 dark:bg-slate-800 dark:text-white"
      >
        No aircrafts found for this airline.
      </div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Set up page metadata
definePageMeta({ layout: 'page' })
useHead({ title: 'Aircraft List' })

// Initialize color mode and breadcrumb links
const colorMode = useColorMode()

const links = [
  {
    label: 'Airlines',
    icon: 'i-heroicons-home',
    to: '/airlines',
  },
  {
    label: 'Aircrafts',
    icon: 'i-heroicons-table-cells',
  },
]

// Fetch aircrafts by airline ID
const route = useRoute()

const { aircrafts, loading, error, fetchAircrafts } = useRegisterByAirline()

onMounted(() => {
  if (route.params.id) {
    fetchAircrafts(route.params.id as string)
  }
})
</script>

<style scoped></style>
