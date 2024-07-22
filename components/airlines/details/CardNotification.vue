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
  <UCard class="hover:shadow-lg rounded-tl-3xl rounded-br-3xl">
    <template #header>
      <div class="flex flex-row space-x-4 dark:text-slate-400">
        <Icon name="tabler:notification" size="25px"/>
        <span class="text-sm text-tiny">Notifications</span>
      </div>
    </template>
    <div class="grid grid-cols-2 gap-2">
      <div class="text-sm font-sans">Content</div>
    </div>
    <template #footer>
      <div class="flex flex-row">Footer</div>
    </template>
  </UCard>
</template>
