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

// Fetch the ramp checks for the airline
const { rampChecks, loading, error, fetchRampChecksByAirline } = useRamp()

onMounted(() => {
  if (props.airlineId) {
    fetchRampChecksByAirline(props.airlineId)
  }
})

watch(
  () => props.airlineId,
  (newId) => {
    if (newId) {
      fetchRampChecksByAirline(newId)
    }
  }
)

// Unique key for transition to avoid duplicate entries
const transitionKey = computed(() => {
  return rampChecks.value.length > 0 ? rampChecks.value[0].id : 'no-ramp-checks'
})

// Reactive property for ping effect
const showPing = ref(false)

const rampSidebar = ref(null)

const openSidebar = () => {
  if (rampSidebar.value) {
    rampSidebar.value.open()
  }
}

// Trigger ping effect when new ramp checks are added
watch(
  () => rampChecks.value,
  (newRampChecks) => {
    if (newRampChecks.length > 0) {
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
        <Icon name="twemoji:clipboard" size="25px" />

        <!-- Ramp Checks Header -->
        <div class="relative flex items-center">
          <span class="text-xs text-tiny mr-8"> Ramp Checks </span>
          <!-- Badge for ramp check count with animation -->
          <span
            class="absolute right-0 flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500 text-white text-sm font-medium cursor-pointer"
            :class="{ 'animate-ping': showPing }"
            :style="{ opacity: showPing ? 0 : 1 }"
            @click="openSidebar"
          >
            {{ rampChecks.length }}
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
    <!-- Replace this with your ramp check list component -->
    <!-- <RampCheckList
      v-if="!loading && !error"
      :rampChecks="rampChecks"
    /> -->
    <template #footer>
      <div class="flex flex-row">Footer</div>
    </template>
  </UCard>
  <AirlinesDetailsUiRampListSidebar
    ref="rampSidebar"
    :rampChecks="rampChecks"
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
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
