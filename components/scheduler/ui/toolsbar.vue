<template>
  <header
    class="mx-4 bg-gray-200 dark:bg-slate-900 p-4 flex justify-between items-center rounded-md"
  >
    <div class="flex space-x-4">
      <!-- Button for display modal window -->
      <UButton
        color="sky"
        variant="soft"
        size="sm"
        @click="$emit('openParserModal')"
      >
        VDA|SCR
      </UButton>
      <!-- Button for test FFM Parser here -->
      <!-- Button for test FFM Parser -->
      <UButton
        color="emerald"
        variant="soft"
        size="sm"
        @click="$emit('testFFMParser')"
      >
        Test FFM Parser
      </UButton>
    </div>
    <div class="flex space-x-4">
      <!-- Flight type switcher -->
      <UButton
        :color="selectedFlightType === 'Inbound' ? 'sky' : 'gray'"
        variant="solid"
        size="sm"
        @click="$emit('selectFlightType', 'Inbound')"
      >
        Inbound
      </UButton>
      <UButton
        :color="selectedFlightType === 'Outbound' ? 'sky' : 'gray'"
        variant="solid"
        class="ml-2"
        size="sm"
        @click="$emit('selectFlightType', 'Outbound')"
      >
        Outbound
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedFlightType: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'openParserModal',
  'selectFlightType',
  'testFFMParser',
])
</script>
