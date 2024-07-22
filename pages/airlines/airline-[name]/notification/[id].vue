<!-- pages/events/[id].vue -->
<template>
  <LayoutsPageWrapper>
    <UBreadcrumb :links="links" class="p-4" />
    <LayoutsPageSection>
      <UCard v-if="event">
        <template #header>
          <div v-if="event.user" class="flex items-center space-x-3">
            <img
              :src="event.user.avatar_url"
              alt="User Avatar"
              class="w-10 h-10 rounded-full"
            />
            <div class="flex flex-col">
              <div class="flex items-center space-x-2">
                <span class="font-normal text-md subpixel-antialiased">
                  @{{ event.user.username }}
                </span>
              </div>
            </div>
          </div>
        </template>
        <article class="text-wrap">
          <h2 class="text-lg font-bold dark:text-gray-300">
            {{ event.event_title }}
          </h2>
          <p class="mt-10 text-lg font-normal dark:text-gray-400">
            {{ event.event_description }}
          </p>
        </article>

        <template #footer>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <UBadge color="yellow" variant="solid" class="mt-4">
                {{ event.event_type }}
              </UBadge>
              <p class="mt-4 text-md font-bold dark:text-gray-200 uppercase">
                {{ formatDate(event.event_date) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <Icon
                name="mdi:bookmark-outline"
                size="24px"
                class="cursor-pointer"
              />
              <Icon
                name="mdi:heart-outline"
                size="24px"
                class="cursor-pointer"
              />
            </div>
          </div>
        </template>
      </UCard>
    </LayoutsPageSection>
  </LayoutsPageWrapper>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { formatDate } from '@/configs/date_util'

// compiler micro
definePageMeta({ layout: 'page' })
useHead({ title: 'Notification Detail' })

const colorMode = useColorMode()

const links = [
  {
    label: 'Airlines',
    icon: 'i-heroicons-home',
    to: '/airlines',
  },
  {
    label: 'Details',
    icon: 'i-heroicons-table-cells',
  },
]

const route = useRoute()
const { event, fetchEventById } = useAirlineEvent()

onMounted(async () => {
  const eventId = route.params.id
  await fetchEventById(eventId)
})
</script>

<style scoped>
/* Add your styles here */
</style>
