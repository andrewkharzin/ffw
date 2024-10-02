<template>
  <div class="card bg-slate-950/30">
    <div class="card-content">
      <div class="freighter-header flex flex-col text-left">
        <div>
          <!-- ETA Section -->
          <div class="flex flex-row">
            <Icon v-if="!isSmallScreen" icon="icon-park-outline:schedule" />
            <p class="ml-1 font-normal text-pink-600 sm:text-xs text-left">
              ETA:
              <span class="font-mono text-slate-400 sm:text-xs text-left">
                {{ eta }}
              </span>
            </p>
          </div>

          <!-- ATA Section -->
          <div class="flex flex-row">
            <Icon v-if="!isSmallScreen" icon="mdi:airplane-schedule" />
            <p class="ml-1 font-normal text-pink-600 sm:text-xs text-left">
              ATA:
              <span class="font-mono text-slate-400 sm:text-xs text-left">
                {{ ata }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// Props passed to the component
const props = defineProps({
  eta: {
    type: String,
    required: true,
  },
  ata: {
    type: String,
    required: true,
  },
  isSmallScreen: {
    type: Boolean,
    required: true,
  },
})
</script>

<style scoped>
/* Optional additional styling if needed */
.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  height: 50px;
  border-radius: 8px;
  padding: 10px;
  color: white;
}

.card-left {
  background: rgb(0, 174, 209);
  width: 40px;
  height: 100%;
  display: flex;
  border: #ec4899;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.card-left span {
  font-weight: bold;
  font-size: 18px;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  padding-left: 10px;
}

.title-link {
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.ml-2 {
  margin-left: 8px;
}

.font-normal {
  font-weight: normal;
}

.text-xl {
  font-size: 1.25rem;
}

.sm\\:text-md {
  font-size: 1rem;
}

.text-teal-500 {
  color: #14b8a6;
}

.text-pink-500 {
  color: #ec4899;
}

.font-mono {
  font-family: monospace;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 20px;
}

.dot {
  background-color: #a9a9a9;
  border-radius: 50%;
  width: 4px;
  height: 4px;
}
</style>
