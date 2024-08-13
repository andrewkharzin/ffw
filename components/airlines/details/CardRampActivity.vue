<template>
  <UCard class="hover:shadow-lg rounded-sm w-full">
    <template #header>
      <div class="relative flex items-center space-x-4 dark:text-slate-400">
        <!-- Icon -->
        <Icon name="oi:task" size="25px" />

        <!-- Ramp Check Header -->
        <div class="relative flex items-center">
          <span class="text-xs text-tiny mr-8">Ramp Checks</span>
          <!-- Badge for ramp check count with animation -->
          <span
            class="absolute right-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer"
            :class="{ 'animate-ping': showPing }"
            :style="{ opacity: showPing ? 0 : 1 }"
          >
            {{ rampCheckCount }}
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
    <template #default>
      <div class="text-center p-4">
        <p>Total Ramp Checks: {{ rampCheckCount }}</p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'

// Props: Airline ID
const props = defineProps<{ airlineId: string }>()

// Use the composable
const { rampCheckCount, fetchRampCheckCount } = useRampCheck()

// Reactive property for ping effect
const showPing = ref(false)

// Fetch data when the component is mounted
onMounted(() => {
  console.log('Component mounted, airlineId:', props.airlineId) // Debug airlineId value
  if (props.airlineId) {
    fetchRampCheckCount(props.airlineId)
  }
})

// Watch for changes in ramp check count to trigger ping effect
watch(rampCheckCount, (newCount) => {
  if (newCount > 0) {
    showPing.value = true
    setTimeout(() => {
      showPing.value = false
    }, 1000) // Hide after 1 second
  }
})
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
