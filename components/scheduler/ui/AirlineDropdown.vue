<template>
  <div class="form-group">
    <button
      type="button"
      :disabled="isLoading"
      class="relative w-full cursor-default rounded-md bg-slate-900/45 py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
      @click="isDropdownOpen = !isDropdownOpen"
    >
      <span class="flex items-center">
        <span
          v-if="selectedAirline"
          class="p-2 h-6 w-6 border-2 flex-shrink-0 rounded-tl-lg rounded-br-lg border-pink-500 text-white flex items-center justify-center text-xs font-bold"
        >
          {{ selectedAirline.iata }}
        </span>
        <span
          v-else
          class="h-5 w-5 border-2 flex-shrink-0 rounded-full border-gray-500 text-white flex items-center justify-center text-xs"
        >
          ?
        </span>
        <span class="ml-3 block truncate">
          {{ selectedAirline ? selectedAirline.label : 'Select an Airline' }}
        </span>
      </span>
      <span class="absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
        <svg
          class="h-5 w-5 text-gray-400"
          viewBox="0 0 25 25"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </button>

    <ul
      v-if="isDropdownOpen"
      class="absolute z-10 max-h-56 w-full overflow-auto rounded-md bg-slate-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
    >
      <li
        v-for="item in airlines"
        :key="item.value"
        class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-300"
        @click="selectAirline(item)"
      >
        <div class="flex items-center">
          <!-- <span>{{ item }}</span> -->
          <span
            class="p-2 h-6 w-6 border-2 flex-shrink-0 rounded-tl-lg rounded-br-lg border-pink-500 text-white flex items-center justify-center text-xs font-bold"
          >
            {{ item.iata }}
          </span>
          <span class="ml-3 block truncate">{{ item.name }}</span>
        </div>
        <span
          v-if="selectedAirline && selectedAirline.value === item.value"
          class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props and emitted events
const props = defineProps({
  selectedAirline: Object,
  airlines: Array,
  isLoading: Boolean,
  error: Object,
})

const emit = defineEmits(['select-airline'])

// State management for dropdown
const isDropdownOpen = ref(false)

// Functions to handle user actions
const selectAirline = (airline) => {
  emit('select-airline', airline)
  isDropdownOpen.value = false
}
</script>
