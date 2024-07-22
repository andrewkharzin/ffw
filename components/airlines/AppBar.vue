<template>
  <header
    class="mx-4 bg-gray-200 dark:bg-slate-900 p-4 flex justify-between items-center rounded-md"
  >
    <div class="flex space-x-4">
      <AirlinesFilterSelect />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

const emit = defineEmits(['update-filters'])
const supabase = useSupabaseClient()

const airlines = ref([])
const selectedStatus = ref('')
const selectedAirline = ref('')
</script>
