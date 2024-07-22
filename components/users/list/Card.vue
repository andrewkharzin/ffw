<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  followers: {
    type: Number,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
})

const profileImage = computed(() => props.avatarUrl || '/default-avatar.png')
</script>

<template>
  <div class="flex flex-col">
    <div
      class="bg-gray-900 border border-gray-900 shadow-lg rounded-3xl p-4 m-4"
    >
      <div class="flex-none sm:flex">
        <div class="relative h-32 w-32 sm:mb-0 mb-3">
          <NuxtImg
            :src="profileImage"
            alt="User Image"
            class="w-32 h-32 object-cover rounded-2xl"
          />
          <!-- <a href="#" class="absolute -right-2 bottom-2 -ml-3 text-white p-1 text-xs bg-green-400 hover:bg-green-500 font-medium tracking-wider rounded-full transition ease-in duration-300">
          </a> -->
        </div>
        <div class="flex-auto sm:ml-5 justify-evenly">
          <div class="flex items-center justify-between sm:mt-2">
            <div class="flex items-center">
              <div class="flex flex-col">
                <div
                  class="w-full text-lg flex-none text-lg text-gray-200 font-bold leading-none"
                >
                  {{ name }}
                </div>
                <div class="flex-auto text-gray-400 my-1">
                  <span class="mr-3 text-xs font-medium">{{ role }}</span
                  ><span
                    class="text-xs mr-3 border-r border-gray-600 max-h-0"
                  ></span
                  ><span>{{ location }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center">
            <div class="grid grid-cols-2 gap-2 pt-2 text-sm text-gray-400">
              <div class="text-ssm flex-1 inline-flex items-center">
                <Icon
                  name="mingcute:user-follow-fill"
                  size="20px"
                  class="mr-2"
                />
                <p class="">{{ followers }} Followers</p>
              </div>

              <div class="p-2">
                <UButton size="sm" class="text-sm" color="black" variant="solid"
                  >FOLLOW</UButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
