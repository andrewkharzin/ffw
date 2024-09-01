<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <!-- Button for display modal window -->
      <div class="mb-4">
        <UButton
          color="emerald"
          variant="solid"
          @click="isOpen = true"
          size="sm"
        >
          Test SCR Parser
        </UButton>
      </div>
      <!-- Flight type switcher -->
      <div class="flex justify-between mb-4">
        <div>
          <UButton
            :color="selectedFlightType === 'Inbound' ? 'sky' : 'gray'"
            variant="solid"
            @click="selectFlightType('Inbound')"
            size="sm"
          >
            Inbound
          </UButton>
          <UButton
            :color="selectedFlightType === 'Outbound' ? 'sky' : 'gray'"
            variant="solid"
            class="ml-2"
            @click="selectFlightType('Outbound')"
            size="sm"
          >
            Outbound
          </UButton>
        </div>
      </div>

      <!-- Freighters Table -->
      <SchedulerFreightersTable :freighters="freighters" :loading="loading" />
      <!-- Modal for SCR Parser -->
      <UModal v-model="isOpen">
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <h3 class="text-lg font-semibold">SCR Parser Test</h3>
          </template>

          <div class="p-4">
            <textarea
              v-model="scrTelex"
              class="w-full p-2 border rounded mb-4"
              rows="10"
              placeholder="Paste SCR telex message here..."
            ></textarea>
            <UButton color="sky" variant="solid" @click="testSCRParser">
              Parse Message
            </UButton>
          </div>

          <template #footer>
            <UButton @click="isOpen = false" color="gray" variant="solid">
              Close
            </UButton>
          </template>
        </UCard>
      </UModal>
      <!-- Modal to Display Parsed Results -->
      <SchedulerFormsParsedResultsModal
        :parsedResults="parsedResults"
        :isOpen="isResultsModalOpen"
      />
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { parseSCRMessage } from '@/utils/SCR'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Freighters' })

const { freighters, loading, error, fetchFreighters, selectedFlightType } =
  useFreighters()

// Function to select the flight type
function selectFlightType(type: 'Inbound' | 'Outbound') {
  selectedFlightType.value = type
}

// Modal visibility state
const isOpen = ref(false)
const isResultsModalOpen = ref(false)
const parsedResults = ref('')

// State management for SCR message input
const scrTelex = ref('')

// Test SCR Parser
function testSCRParser() {
  try {
    const parsedData = parseSCRMessage(scrTelex.value)
    console.log('Parsed SCR Message:', parsedData)
    alert('Parsed data logged to console.') // Optional: Display an alert
  } catch (error) {
    console.error('Failed to parse SCR message:', error)
    alert('Failed to parse SCR message. Please check the format.')
  }
}

onMounted(() => {
  fetchFreighters()
})
</script>
