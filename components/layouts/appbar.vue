<template>
  <header
    class="bg-gray-200 dark:bg-slate-900 p-4 flex justify-between items-center"
  >
    <div class="flex space-x-4">
      <USelect
        v-model="selectedStatus"
        :options="statusOptions"
        @update:model-value="applyFilters"
      />
      <USelect
        v-model="selectedAirline"
        :options="airlineOptions"
        class="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800"
        placeholder="Filter by Airline"
        @change="applyFilters"
      />
    </div>
    <UButton
      icon="i-heroicons-plus-circle"
      size="sm"
      color="cyan"
      variant="solid"
      :trailing="false"
      @click="$emit('open-slide-over')"
    />
  </header>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['update-filters'])
const supabase = useSupabaseClient()

const airlines = ref([])
const selectedStatus = ref('')
const selectedAirline = ref('')

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Approved', value: 'approved' },
]

const props = defineProps({
  airlineOptions: {
    type: Array as PropType<Array<{ label: string; value: string }>>,
    required: true,
  },
})

const applyFilters = () => {
  const filters = {
    status: selectedStatus.value,
    airline: selectedAirline.value,
  }
  emit('update-filters', filters)
}

watch([selectedStatus, selectedAirline], () => {
  applyFilters()
})
</script>
