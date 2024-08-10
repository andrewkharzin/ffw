<template>
  <LayoutsPageWrapper>
    <!-- Bread -->
    <UBreadcrumb :links="links" class="p-4" />
    <LayoutsPageSection>
      <div v-if="aircraft" class="p-4 dark:bg-slate-900/30 dark:text-white">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <h1 class="text-2xl font-bold mb-4">
              {{ aircraft.ac_registration_number }}
            </h1>
            <p class="mb-4">Model: {{ aircraft.ac_model }}</p>
          </div>
          <div>
            <div v-if="aircraft.ac_ramp_image" class="">
              <img
                :src="aircraft.ac_ramp_image"
                alt="Ramp Image"
                class="w-full h-auto rounded p-4"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="p-4 dark:bg-slate-800 dark:text-white">Loading...</div>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Aircraft Detail' })

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

const route = useRoute()
const { aircraft, loading, error, fetchAircraftById } = useRegisterByAirline()

onMounted(() => {
  if (route.params.id) {
    fetchAircraftById(route.params.id as string)
  }
})
</script>

<style scoped>
</style>