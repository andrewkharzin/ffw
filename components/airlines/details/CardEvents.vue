<!-- eslint-disable vue/require-toggle-inside-transition -->
<script setup lang="ts">
// Import necessary functions and types
import { defineProps } from 'vue'
import type { Database } from '@/types/supabase.ts'

// Define the props for the component
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
  events: {
    type: Array as () => Array<
      Database['public']['Tables']['airlines_realtime_events']['Row']
    >,
    required: true,
  },
  user: {
    type: Object as () => Record<
      string,
      Database['public']['Tables']['profiles']['Row']
    >,
    required: true,
  },
})

// Compute the count of events
const eventCount = computed(() => props.events.length)
// Compute the most recent event
// const latestEvent = computed(() => {
//   if (props.events.length === 0) return null
//   return props.events.reduce((latest, current) =>
//     new Date(current.event_timestamp) > new Date(latest.event_timestamp)
//       ? current
//       : latest,
//   )
// })

const latestEvent = computed(() => {
  if (props.events.length === 0) return null
  return props.events.reduce((latest, current) =>
    new Date(current.event_timestamp) > new Date(latest.event_timestamp)
      ? current
      : latest,
  )
})

// Unique key for transition to avoid duplicate entries
const transitionKey = computed(() => {
  return latestEvent.value ? latestEvent.value.event_timestamp : 'no-events'
})
// Reactive property for ping effect
const showPing = ref(false)

const notificationSidebar = ref(null)

const openSidebar = () => {
  if (notificationSidebar.value) {
    notificationSidebar.value.open()
  }
}

// Trigger ping effect when a new event is added
watch(
  () => props.events,
  (newEvents) => {
    if (newEvents.length > 0) {
      showPing.value = true
      setTimeout(() => {
        showPing.value = false
      }, 2000) // Hide after 5 seconds
    }
  },
  { immediate: true },
)
</script>

<template>
  <UCard class="hover:shadow-lg rounded-tl-3xl rounded-br-3xl w-full">
    <template #header>
      <div class="relative flex items-center space-x-4 dark:text-slate-400">
        <!-- Icon -->
        <Icon name="carbon:event" size="25px" />

        <!-- Event Header -->
        <div class="relative flex items-center">
          <span class="text-xs text-tiny mr-8"> Events </span>
          <!-- Badge for event count with animation -->
          <span
            class="absolute right-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer"
            :class="{ 'animate-ping': showPing }"
            :style="{ opacity: showPing ? 0 : 1 }"
            @click="openSidebar"
          >
            {{ eventCount }}
          </span>
        </div>

        <!-- Ping Effect -->
        <div
          v-if="showPing"
          class="absolute top-0 right-0 flex items-center justify-center w-6 h-6"
        >
          <span class="relative flex h-6 w-6">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-6 w-6 bg-sky-500"
            ></span>
          </span>
        </div>
      </div>
    </template>
    <AirlinesDetailsUiEventNotify :events="events" />
    <template #footer>
      <div class="flex flex-row">Footer</div>
    </template>
  </UCard>
  <AirlinesDetailsUiNotificationSidebar
    ref="notificationSidebar"
    :events="events"
  />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
