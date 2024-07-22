<script setup lang="ts">
const props = defineProps({
  links: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <nav class="flex space-x-4">
    <template v-for="(group, groupIndex) in props.links" :key="groupIndex">
      <div v-for="(link, linkIndex) in group" :key="linkIndex">
        <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
      </div>
    </template>
  </nav>
</template>
