<!-- AirlinesNotificationBar.vue -->
<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  airlineId: {
    type: String,
    required: true,
  },
})

const items = [
  {
    name: 'messages',
    icon: 'i-heroicons-chat-bubble-oval-left',
    count: 3,
  },
  {
    name: 'notifications',
    icon: 'i-heroicons-bell',
    count: 0,
  },
]
</script>

<template>
  <div class="flex gap-3 items-center">
    <UChip v-for="{ name, icon, count } in items" v-if="count > 0" :key="name">
      <UButton :icon="icon" color="gray" />
    </UChip>

    <!-- Link to the Aircraft List page -->
    <NuxtLink
      :to="`/aircraft/list/${airlineId}`"
      class="text-blue-500 hover:underline"
    >
      <UButton color="gray" variant="ghost">Fleets</UButton>
    </NuxtLink>
    <!-- End of Aircraft List link -->
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
