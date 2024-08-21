<template>
  <div>
    <div class="tab-buttons">
      <button
        v-for="(item, index) in items"
        :key="index"
        :class="{ active: activeTab === index }"
        class="text-sm dark:text-gray-300"
        @click="activeTab = index"
      >
        <span :class="item.icon"></span> {{ item.label }}
      </button>
    </div>
    <div class="tab-content">
      <component :is="currentTabContent"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  defaultIndex: {
    type: Number,
    default: 0,
  },
})

const activeTab = ref(props.defaultIndex)

const currentTabContent = computed(() => {
  const currentItem = props.items[activeTab.value]
  return (
    currentItem.component || { template: `<div>${currentItem.content}</div>` }
  )
})
</script>

<style scoped>
.tab-buttons {
  display: flex;
  gap: 1rem;
}

.tab-content {
  margin-top: 1rem;
}

.active {
  font-weight: bold;
  border-bottom: 2px solid currentColor;
}
</style>
