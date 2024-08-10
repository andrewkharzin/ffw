<!-- components/AirlineAircrafts.vue -->
<script setup lang="ts">
// Import necessary functions and types
import { ref, onMounted, watch, computed } from 'vue'
import { defineProps } from 'vue'

// Define the props for the component
const props = defineProps({
  airlineId: {
    type: String,
    required: true,
  },
})

// Fetch the aircrafts for the airline
const { aircrafts, loading, error, fetchAircrafts } = useRegisterByAirline()

onMounted(() => {
  if (props.airlineId) {
    fetchAircrafts(props.airlineId)
  }
})

watch(
  () => props.airlineId,
  (newId) => {
    if (newId) {
      fetchAircrafts(newId)
    }
  }
)

// Unique key for transition to avoid duplicate entries
const transitionKey = computed(() => {
  return aircrafts.value.length > 0 ? aircrafts.value[0].id : 'no-aircrafts'
})

// Reactive property for ping effect
const showPing = ref(false)

const fleetSidebar = ref(null)

const openSidebar = () => {
  if (fleetSidebar.value) {
    fleetSidebar.value.open()
  }
}

// Trigger ping effect when new aircrafts are added
watch(
  () => aircrafts.value,
  (newAircrafts) => {
    if (newAircrafts.length > 0) {
      showPing.value = true
      setTimeout(() => {
        showPing.value = false
      }, 1000) // Hide after 1 second
    }
  },
  { immediate: true }
)
</script>

<template>
  <UCard class="hover:shadow-lg rounded-sm w-full">
    <template #header>
      <div class="relative flex items-center space-x-4 dark:text-slate-400">
        <!-- Icon -->
        <Icon name="twemoji:airplane" size="25px" />

        <!-- Aircrafts Header -->
        <div class="relative flex items-center">
          <span class="text-xs text-tiny mr-8"> Aircrafts </span>
          <!-- Badge for aircraft count with animation -->
          <span
            class="absolute right-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer"
            :class="{ 'animate-ping': showPing }"
            :style="{ opacity: showPing ? 0 : 1 }"
            @click="openSidebar"
          >
            {{ aircrafts.length }}
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
    <div v-if="loading" class="">Loading...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <!-- <AirlinesDetailsAircraftAirlineList
      v-if="!loading && !error"
      :aircrafts="aircrafts"
    /> -->
    <template #footer>
      <div class="flex flex-row">Footer</div>
    </template>
  </UCard>
  <AirlinesDetailsUiFleetSidebar ref="fleetSidebar" :aircrafts="aircrafts" />
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
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
