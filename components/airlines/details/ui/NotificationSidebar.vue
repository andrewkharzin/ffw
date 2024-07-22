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
            <h2 class="text-lg font-bold">Notifications</h2>
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
          <ul>
            <li v-for="event in events" :key="event.id" class="p-4">
              <div class="flex items-start space-x-3 border-l border-sky-500">
                <img
                  v-if="event.user?.avatar_url"
                  :src="event.user.avatar_url"
                  alt="avatar"
                  class="w-4 h-4 ml-2 rounded-full"
                />
                <div>
                  <div class="flex items-center space-x-2">
                    <span class="font-light text-[0.7rem] subpixel-antialiased"
                      >@{{ event.user?.username }}</span
                    >
                    <Icon name="mdi:event-clock" size="12px" />
                    <span class="text-sm text-gray-500 subpixel-antialiased">{{
                      event.event_date
                    }}</span>
                  </div>
                  <div
                    class="text-sm text-[0.6rem] dark:text-slate-400 dark:text-gray-300"
                  >
                    {{ event.event_type }}
                  </div>
                  <div
                    class="text-sm font-normal text-[0.5rem] text-gray-700 dark:text-slate-400 subpixel-antialiased cursor-pointer hover:dark:text-slate-200"
                  >
                    <NuxtLink
                      :to="`/airlines/airline-${event.airline_name}/notification/${event.id}`"
                    >
                      {{ event.event_title }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <template #footer>
          <div class="h-8 flex items-center justify-center">
            <span class="text-sm text-gray-500">End of Notifications</span>
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  events: {
    type: Array,
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
