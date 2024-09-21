<template>
  <div class="dropdown" @click="toggleDropdown">
    <button class="relative w-full">
      <span class="flex items-center">
        <span v-if="selectedItem" class="badge">{{ selectedItem.iata }}</span>
        <span>{{
          selectedItem ? selectedItem.label : 'Select an Airline'
        }}</span>
      </span>
      <span class="absolute right-0 ml-3">
        <svg class="icon">...</svg>
      </span>
    </button>

    <ul v-if="isOpen" class="dropdown-menu">
      <li v-for="item in items" :key="item.value" @click="selectItem(item)">
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'

const isOpen = ref(false)
const selectedItem = ref(null)
const props = defineProps({
  items: Array,
})

const emit = defineEmits(['selectItem'])

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item) => {
  selectedItem.value = item
  isOpen.value = false
  emit('selectItem', item) // Emit the selected item to the parent
}
</script>

<style scoped>
/* Add styles for the dropdown */
</style>
