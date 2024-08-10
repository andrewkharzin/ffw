<!-- components/AircraftsList.vue -->
<script setup lang="ts">
// Import necessary functions and types
import { defineProps } from 'vue'
import type { Database } from '@/types/supabase'

// Define the props for the component
const props = defineProps({
  aircrafts: {
    type: Array as () => Array<
      Database['public']['Tables']['aircrafts_register']['Row']
    >,
    required: true,
  },
  airline: {
    type: Array as () => Array<Database['public']['Tables']['airlines']['Row']>,
    required: true,
  },
})
</script>

<template>
  <div class="">
    <table class="min-w-full dark:bg-slate-800">
      <thead class="bg-slate-900 uppercase text-sm text-tiny text-left">
        <tr>
          <th class="text-[0.7rem] py-2 px-2 border-b border-gray-600">Reg</th>
          <th class="text-[0.7rem] py-2 px-2 border-b border-gray-600">
            Model
          </th>
          <th class="text-[0.7rem] py-2 px-2 border-b border-gray-600">
            Image
          </th>
        </tr>
      </thead>
      <tbody class="mt-10">
        <tr
          v-for="aircraft in aircrafts"
          :key="aircraft.id"
          class="hover:bg-slate-900/50"
        >
          <td
            class="text-[0.8rem] px-2 border-b border-slate-600 font-mono font-bold text-teal-600"
          >
            <NuxtLink
              :to="`/aircraft/${aircraft.id}`"
              class="text-red-600 hover:underline"
            >
              {{ aircraft.ac_registration_number }}
            </NuxtLink>
          </td>
          <td class="text-[0.8rem] py-2 px-2 border-b border-slate-600">
            {{ aircraft.ac_model }}
          </td>
          <td class="text-[0.8rem] py-2 px-2 border-b border-slate-600">
            <img
              v-if="aircraft.ac_ramp_image"
              :src="aircraft.ac_ramp_image"
              alt="Ramp Image"
              class="w-full h-8 rounded"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
img {
  max-height: 80px;
  object-fit: cover;
}
</style>
