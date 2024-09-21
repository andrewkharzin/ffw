<template>
  <div>
    <!-- Debugging: Showing modal status -->
    <p v-if="isVisible">Modal is open</p>

    <UModal :open="isVisible" prevent-close @update:open="updateVisible">
      <UCard>
        <USelect
          v-model="selectedAircraft"
          :options="aircraftOptions"
          label="Select Aircraft"
          @change="onSelect"
        >
          <template #default="{ option }">
            {{ option.label }} ({{ option.value }})
          </template>
        </USelect>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  airlineId: String,
})

const emit = defineEmits(['select', 'update:isVisible'])

const aircraftOptions = ref([])
const selectedAircraft = ref('')

watch(
  () => props.airlineId,
  async (newAirlineId) => {
    if (newAirlineId) {
      console.log('Fetching aircraft for airline:', newAirlineId) // Debugging line
      const { aircrafts } = useRegisterByIata(newAirlineId)
      aircraftOptions.value = aircrafts.value.map((ac) => ({
        label: ac.ac_registration_number,
        value: ac.id,
      }))
    }
  }
)

const updateVisible = (value) => {
  console.log('Modal visibility updated:', value) // Debugging line
  emit('update:isVisible', value)
}

const onSelect = () => {
  console.log('Aircraft selected:', selectedAircraft.value) // Debugging line
  emit('select', selectedAircraft.value)
}
</script>
