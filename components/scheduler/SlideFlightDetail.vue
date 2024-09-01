<template>
  <USlideover v-model="isOpen" @update:model-value="updateIsOpen" prevent-close>
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Flight Details
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="close"
          />
        </div>
      </template>

      <div class="flex flex-col gap-2 p-4">
        <p v-if="flightDetails">Flight Number: {{ flightDetails.number }}</p>
        <p v-if="flightDetails">Airline: {{ flightDetails.airline.name }}</p>
        <p v-if="flightDetails">
          Aircraft: {{ flightDetails.aircraft.model }} ({{
            flightDetails.aircraft.reg
          }})
        </p>
        <p v-if="flightDetails">Status: {{ flightDetails.status }}</p>
        <!-- Add more details as needed -->
      </div>
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: boolean
  flightDetails: any
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
}>()

const isOpen = ref(props.modelValue)

const updateIsOpen = (value: boolean) => {
  isOpen.value = value
  emit('update:modelValue', value)
}

const close = () => {
  isOpen.value = false
  emit('update:modelValue', false)
  emit('close')
}
</script>