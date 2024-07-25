<template>
  <transition name="slide-fade" mode="out-in">
    <ul :key="transitionKey">
      <li v-if="!latestEvent">
        <div class="text-xs dark:text-slate-400 text-tiny">
          No recent events
        </div>
      </li>
      <li v-else>
        <div class="flex items-start space-x-3 border-l border-sky-500">
          <img
            v-if="latestEvent.user?.avatar_url"
            :src="latestEvent.user.avatar_url"
            alt="avatar"
            class="w-4 h-4 ml-2 rounded-full"
          />
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-light text-[0.7rem] subpixel-antialiased">
                @{{ latestEvent.user?.username }}
              </span>
              <Icon name="mdi:event-clock" size="12px" />
              <span class="text-sm text-gray-500 subpixel-antialiased">
                {{ latestEvent.event_date }}
              </span>
            </div>
            <div class="text-sm text-[0.5rem] dark:text-slate-600">
              {{ latestEvent.event_type }}
            </div>
            <div
              class="text-sm font-normal text-[0.4rem] text-gray-700 dark:text-slate-400 subpixel-antialiased cursor-pointer hover:dark:text-slate-200"
            >
              <NuxtLink to="/">
                <p class="truncate text-clip md:text-clip">
                  {{ latestEvent.event_title }}
                </p>
              </NuxtLink>
              <div class="text-xs text-gray-500 dark:text-slate-600 mt-1">
                {{ timeAgo }}
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
})

const latestEvent = computed(() => {
  if (props.events.length === 0) return null
  return props.events.reduce((latest, current) =>
    new Date(current.event_timestamp) > new Date(latest.event_timestamp)
      ? current
      : latest
  )
})

const timeAgo = computed(() => {
  if (!latestEvent.value) return ''
  return formatDistanceToNow(new Date(latestEvent.value.event_timestamp), {
    addSuffix: true,
  })
})

const transitionKey = computed(() => {
  return latestEvent.value ? latestEvent.value.event_timestamp : 'no-events'
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
  .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}
.slide-enter,
  .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>
