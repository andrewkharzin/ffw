<script setup lang="ts">
// compiler micro
import { defineProps } from 'vue'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Airlines' })

const colorMode = useColorMode()

const { airlines } = useAirlines() // Use the composable to fetch airlines data

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Airlines',
    icon: 'arcticons:united-airlines',
  },
]

const props = defineProps({
  airline: {
    type: Object as () => {
      id: string
      iata: string | null
      icao: string | null
      name: string | null
      aircraft_id: string | null
      logo: string | null
      awb_code: string | null
      callsign: string | null
      website: string | null
    },
    required: true,
  },
})
</script>

<template>
  <UCard class="hover:shadow-lg rounded-tl-3xl rounded-br-3xl">
    <template #header>
      <div class="flex flex-row space-x-4">
        <NuxtImg
          v-if="airline.logo"
          :src="airline.logo"
          alt="Logo"
          class="mt-4 w-[35px] h-[35px] border border-gray-600/65 rounded-tl-lg rounded-br-lg p-1"
        />
        <div class="flex flex-col space-y-2">
          <h3
            class="mt-2 text-md font-bold dark:text-gray-400 text-cyan-600 cursor-pointer hover:dark:text-gray-600"
          >
            <NuxtLink
              :to="`/airlines/airline-${encodeURIComponent(airline.name)}`"
            >
              {{ airline.name }}
            </NuxtLink>
          </h3>
          <p>
            <!-- <Icon name="emojione-monotone:airplane" /> -->
            <span
              class="text-xs font-extralight uppercase text-tiny dark:text-gray-400 text-gray-700 subpixel-antialiased"
            >
              {{ airline.handling }}
            </span>
          </p>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-2">
      <div class="font-sans">
        <p class="text-[0.6rem] font-normal text-gray-400">
          IATA:
          <span class="text-[0.6rem] font-bold text-cyan-600">{{
            airline.iata
          }}</span>
        </p>
        <p class="text-[0.6rem] font-normal text-gray-400">
          ICAO:
          <span class="text-[0.6rem] font-bold text-cyan-600">{{
            airline.icao
          }}</span>
        </p>
      </div>
      <div>
        <p class="text-[0.6rem] font-normal text-gray-400">
          CALLSIGN:
          <span class="text-[0.6rem] font-bold text-cyan-600">{{
            airline.callsign
          }}</span>
        </p>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row">
        <div class="basis-1/2">
          <p class="mt-1 text-xs font-extralight text-gray-400/55 font-mono">
            AWB:
            <span class="text-md font-bold text-teal-400 font-mono">{{
              airline.awb_code
            }}</span>
          </p>
        </div>
        <div class="justify-end">
          <p class="text-xs font-extralight text-red-400/55 font-mono">
            FTI
            <span class="text-md font-bold text-teal-400 font-mono">
              <UBadge color="white" variant="solid">76%</UBadge>
              <!-- <UMeter :value="76" indicator /> -->
            </span>
          </p>
        </div>
      </div>
    </template>
  </UCard>
</template>
