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
            <h2 class="text-lg font-bold">Aircrafts</h2>
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark-20-solid"
              class="hidden sm:flex"
              @click="isOpen = false"
            />
          </div>
        </template>
        <div class="h-full overflow-y-auto">
          <AirlinesDetailsAircraftAirlineList
            :aircrafts="aircrafts"
            :airline="airline"
          />
        </div>
        <template #footer>
          <div class="h-8 flex items-center justify-center">
            <span class="text-sm text-gray-500">End of Aircrafts</span>
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Database } from '@/types/supabase'

const props = defineProps({
  aircrafts: {
    type: Array as () => Array<
      Database['public']['Tables']['aircrafts_register']['Row']
    >,
    required: true,
  },
})

const isOpen = ref(false)

defineExpose({
  open: () => (isOpen.value = true),
})
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
