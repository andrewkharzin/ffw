<template>
  <UModal v-model="isOpen">
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
        <pre class="whitespace-pre-wrap">{{ parsedResults }}</pre>
      </div>

      <template #footer>
        <UButton @click="closeModal" color="gray" variant="solid">
          Close
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

// Define props to receive parsed results and modal state
const props = defineProps({
  parsedResults: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
})

// Emit event to close the modal
const closeModal = () => {
  props.isOpen = false
}
</script>
