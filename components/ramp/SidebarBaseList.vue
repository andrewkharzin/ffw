<template>
  <div
    class="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="flex flex-col">
      <span class="font-bold text-gray-700 dark:text-red-400">
        {{ inbound_flight_number || 'No Inbound Flight' }}
      </span>
      <div class="">
        <!-- <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatDate(data) }}
        </span> -->
        <div class="flex items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(data) }}
          </span>
          <UBadge color="gray" variant="soft" class="ml-2">
            <!-- <Icon name="bxs:edit" class="" /> -->
            <NuxtImg
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="User Avatar"
              class="w-4 h-4 rounded-lg"
            />
            <span class="ml-2 text-xs dark:text-sky-400 font-sans font-normal"
              >@ {{ creatorUsername }}
            </span>
          </UBadge>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <!-- Profile Image -->
      <span
        :class="statusClass"
        class="px-2 py-1 rounded-lg uppercase text-xs font-semibold ml-4"
      >
        {{ status || 'Unknown' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, computed } from 'vue'

const props = defineProps({
  data: {
    type: String,
    required: true,
  },
  inbound_flight_number: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: true,
  },
})

const statusClass = computed(() => {
  switch (props.status) {
    case 'approved':
      return 'bg-green-400 text-gray-800'
    case 'new':
      return 'bg-sky-300 text-blue-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Fetch user avatar and username
const { fetchProfileByUserId, avatar_path, creator_username } = useRamp()

onMounted(async () => {
  console.log('User ID:', props.user_id) // Check the value of user_id
  if (props.user_id) {
    await fetchProfileByUserId(props.user_id)
  } else {
    console.error('No user ID provided.')
  }
})

const avatarUrl = computed(() => avatar_path.value)
const creatorUsername = computed(() => creator_username.value)
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
