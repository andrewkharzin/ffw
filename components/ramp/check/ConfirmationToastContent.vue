<!-- ConfirmationToastContent.vue -->
<template>
  <div class="flex justify-center items-center gap-2">
    <button
      class="toastify-delete-button btn px-4 py-2 bg-red-500 text-white rounded"
      @click="emit('yes')"
    >
      Yes
    </button>
    <button
      class="toastify-cancel-button btn px-4 py-2 bg-gray-300 text-gray-800 rounded"
      @click="emit('no')"
    >
      No
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['yes', 'no']);
</script>
