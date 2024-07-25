<template>
  <div class="p-4">
    <UInput
      v-model="unNumber"
      @input="filterUnList"
      type="number"
      placeholder="Enter UN Number"
      class="p-2 border rounded w-full"
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
