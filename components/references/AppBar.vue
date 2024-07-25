<template>
  <header
    class="mx-4 bg-gray-200 dark:bg-slate-900 p-4 flex justify-between items-center rounded-md"
  >
    <div class="flex space-x-4">
      <ReferencesUiUnFilter @filter="handleFilter" />
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['filter'])

const handleFilter = (unNumber) => {
  console.log('Filter event received with value:', unNumber)
  // Emit the event to the parent or handle the filter logic here
  emit('filter', unNumber)
}
</script>

<style scoped>
header {
  background-color: #f3f4f6; /* light gray for light mode */
}
.dark header {
  background-color: #1f2937; /* dark slate for dark mode */
}
</style>
