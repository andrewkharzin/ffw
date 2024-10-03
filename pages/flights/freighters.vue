<template>
  <LayoutsPageWrapper>
    <LayoutsPageSection>
      <LayoutsPageHeader>
        <UBreadcrumb :links="links" class="p-4" />
      </LayoutsPageHeader>
      <!-- <SchedulerUiToolsbar /> -->
      <!-- Scheduler Toolbar -->
      <SchedulerUiToolsbar
        :selectedFlightType="selectedFlightType"
        @openParserModal="isOpen = true"
        @selectFlightType="selectFlightType"
        @testFFMParser="testFFMParser"
        @addFlight="navigateToAddFlight"
      />
      <!-- Freighters Table -->
      <div class="mt-4">
        <SchedulerFreightersTable :freighters="freighters" :loading="loading" />
      </div>
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
            <UButton color="gray" variant="solid" @click="isOpen = false">
              Close
            </UButton>
          </template>
        </UCard>
      </UModal>

      <!-- Modal to Display Parsed Results -->
      <SchedulerFormsParsedResultsModal
        :isOpen="isResultsModalOpen"
        :parsedResults="parsedResults"
        @update:isOpen="isResultsModalOpen = $event"
      />
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { parseSCRMessage } from '@/utils/SCR'
// import { parseSCRMessagev2 } from '@/utils/parsers/SCRV2'
import { parseFFM } from '@/utils/parsers/FFM'

// Compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Freighters' })

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'flights',
    icon: 'i-heroicons-table-cells',
    to: '/flights',
  },
  {
    label: 'freighters',
    icon: 'i-heroicons-table-cells',
    to: '/flights/freighters',
  },
]

const { freighters, loading, error, fetchFreighters, selectedFlightType } =
  useFreighters()

// Function to select the flight type
function selectFlightType(type: 'Inbound' | 'Outbound') {
  selectedFlightType.value = type
}

// Modal visibility states
const isOpen = ref(false) // Controls the SCR parser modal
const isResultsModalOpen = ref(false) // Controls the parsed results modal
const parsedResults = ref('') // Stores the parsed results

// State management for SCR message input
const scrTelex = ref('')

// Test SCR Parser and show parsed results in a modal
function testSCRParser() {
  try {
    const parsedData = parseSCRMessage(scrTelex.value)
    parsedResults.value = parsedData // Store parsed results
    isOpen.value = false // Close the parser modal
    isResultsModalOpen.value = true // Open the results modal
  } catch (error) {
    console.error('Failed to parse SCR message:', error)
    alert('Failed to parse SCR message. Please check the format.')
  }
}

// Test FFM Parser and show results in a modal or console
// function testFFMParser() {

//   try {
//     const parsedData = parseFFM(message)
//     console.log(parsedData) // Output parsed data to console or store it for display
//     parsedResults.value = parsedData // Store parsed results
//     isResultsModalOpen.value = true // Open the results modal to display
//   } catch (error) {
//     console.error('Failed to parse FFM message:', error)
//     alert('Failed to parse FFM message. Please check the format.')
//   }
// }

onMounted(() => {
  fetchFreighters()
})

const router = useRouter()

function navigateToAddFlight() {
  router.push('/flights/freighter/add')
}
</script>
