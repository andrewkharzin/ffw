<script setup lang="ts">
// compiler micro
import { defineProps } from 'vue'

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
    },
    required: true,
  },
})
</script>

<template>
  <UCard class="hover:shadow-lg rounded-sm w-full">
    <template #header>
      <div class="flex flex-row space-x-4 dark:text-slate-400">
        <Icon name="material-symbols:info-outline" size="25px" />
        <span>Info</span>
      </div>
      <div class="flex flex-row space-x-4">
        <div class="flex flex-col space-y-2">
          <!-- <h3
            class="mt-2 text-md font-bold dark:text-gray-400 text-cyan-600 cursor-pointer hover:dark:text-gray-600"
          >
            {{ airline?.name }}
          </h3>
          <p>

            <span
              class="text-xs font-extralight uppercase text-tiny dark:text-gray-400 text-gray-700 subpixel-antialiased"
            >
              {{ airline?.handling }}
            </span>
          </p> -->
        </div>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-2">
      <div class="text-sm font-sans">
        <p class="mt-10 font-normal text-gray-400">
          IATA:
          <span class="font-bold text-cyan-600">{{ airline?.iata }}</span>
        </p>
        <p class="font-normal text-gray-400">
          ICAO:
          <span class="font-bold text-cyan-600">{{ airline?.icao }}</span>
        </p>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row">
        <div class="basis-1/2">
          <p class="mt-1 text-xs font-extralight text-gray-400/55 font-mono">
            AWB:
            <span class="text-md font-bold text-teal-400 font-mono">{{
              airline?.awb_code
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
