<template>
  <UModal :model-value="localIsOpen" @update:model-value="updateIsOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <h3 class="text-lg font-semibold">Parsed SCR Results</h3>
      </template>

      <div class="p-4">
        <table class="max-w-full divide-y divide-gray-200">
          <thead class="bg-slate-800">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Key
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Value
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(value, key) in parsedResults" :key="key">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ key }}
              </td>
              <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500">
                <template v-if="isComplexType(value)">
                  <pre class="whitespace-pre-wrap">{{
                    formatComplexValue(value)
                  }}</pre>
                </template>
                <template v-else>
                  {{ value }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <template #footer>
        <UButton color="gray" variant="solid" @click="closeModal">
          Close
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  parsedResults: Record<string, any>
}>()
const emit = defineEmits(['update:isOpen'])

const localIsOpen = ref(props.isOpen)

// Watch for changes in the prop and update the local variable
watch(
  () => props.isOpen,
  (newValue) => {
    localIsOpen.value = newValue
  }
)

// Emit an update event when the local variable changes
const updateIsOpen = (value: boolean) => {
  emit('update:isOpen', value)
}

function closeModal() {
  updateIsOpen(false)
}

// Helper function to determine if a value is complex (object or array)
function isComplexType(value: any): boolean {
  return typeof value === 'object' && value !== null
}

// Helper function to format complex values for display
function formatComplexValue(value: any): string {
  return JSON.stringify(value, null, 2)
}
</script>
