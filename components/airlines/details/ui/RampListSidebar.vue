<template>
  <div>
    <USlideover v-model="isOpen">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <UButton
            color="gray"
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark-20-solid"
            class="flex sm:hidden absolute end-5 top-5 z-10"
            square
            padded
            @click="isOpen = false"
          />
          <div class="h-8 flex items-center justify-between">
            <h2 class="text-lg font-bold">Ramp Checks</h2>
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark-20-solid"
              class="hidden sm:flex"
              @click="isOpen = false"
            />
          </div>
          <!-- Date Filter -->
          <div class="mt-4 flex items-center space-x-2">
            <!-- <label
              for="dateFilter"
              class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >Filter by Date:</label
            > -->
            <UInput
              placeholder="Choose date"
              id="dateFilter"
              type="date"
              v-model="selectedDate"
            />
          </div>
        </template>
        <div class="h-full overflow-y-auto">
          <!-- Filtered Ramp Checks List -->
          <RampSidebarBaseList
            v-for="(rampCheck, index) in filteredRampChecks"
            :key="rampCheck.id"
            :user_id="rampCheck.user_id"
            :data="rampCheck.data"
            :inbound_flight_number="rampCheck.inbound_flight?.flight_number"
            :status="rampCheck.status"
          />
        </div>
        <template #footer>
          <div class="h-8 flex items-center justify-center">
            <span class="text-sm text-gray-500">End of Ramp Checks</span>
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Database } from '@/types/supabase'

const props = defineProps({
  rampChecks: {
    type: Array as () => Array<
      Database['public']['Tables']['ramp_check']['Row']
    >,
    required: true,
  },
})

const isOpen = ref(false)
const selectedDate = ref<string>('') // For the date filter

const filteredRampChecks = computed(() => {
  if (!selectedDate.value) {
    return props.rampChecks
  }
  return props.rampChecks.filter((rampCheck) => {
    return rampCheck.data === selectedDate.value
  })
})

defineExpose({
  open: () => (isOpen.value = true),
})
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
