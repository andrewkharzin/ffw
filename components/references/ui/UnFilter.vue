<template>
  <div class="p-4">
    <input
      v-model="unNumber"
      placeholder="Enter UN Number"
      class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-slate-700 focus:border-slate-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-700 dark:focus:border-slate-700"
      @input="filterUnList"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const unNumber = ref(null)
const emit = defineEmits(['filter'])

const filterUnList = () => {
  emit('filter', unNumber.value)
}
</script>

<style scoped>
.u-input {
  border: 1px solid #cbd5e1; /* Border color to match the theme */
  padding: 0.5rem;
  border-radius: 0.375rem; /* Border radius */
}
</style>
