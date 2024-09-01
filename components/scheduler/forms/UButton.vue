<template>
  <button :class="buttonClasses" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: 'gray',
  },
  variant: {
    type: String,
    default: 'solid',
  },
})

const buttonClasses = computed(() => {
  return [
    'px-4 py-2 rounded',
    props.variant === 'solid'
      ? `bg-${props.color}-500 text-white`
      : `border border-${props.color}-500 text-${props.color}-500`,
  ]
})
</script>

<style scoped>
/* Add any additional styles here */
</style>
