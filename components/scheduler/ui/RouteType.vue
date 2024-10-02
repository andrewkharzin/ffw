<template>
  <div class="card bg-slate-950/30">
    <div class="card-content">
      <div class="freighter-header flex flex-col">
        <!-- Check if the flight is inbound -->
        <template v-if="row.flight_type === 'Inbound'">
          <div class="uppercase">
            <span class="font-bold md:text-xl sm:text-md text-left">
              {{ row.airports.iata }}
            </span>
            <span class="text-pink-600">→</span>
            <span
              class="font-bold text-xl sm:text-md text-orange-600 text-left"
            >
              SVO
            </span>
          </div>
        </template>

        <!-- If not inbound, consider it outbound -->
        <template v-else>
          <div class="text-left uppercase">
            <span class="font-bold text-xl sm:text-md text-orange-600"
              >SVO</span
            >
            <span class="text-pink-600">→</span>
            <span class="font-bold md:text-xl sm:text-md">{{
              row.airports.iata
            }}</span>
            <div v-if="showBlock">
              <p class="font-normal text-slate-500 tracking-widest">
                {{ row.flight_type }}
              </p>
            </div>
          </div>
        </template>

        <!-- Display connection details if showBlock is true -->
        <div v-if="showBlock" class="flex flex-col">
          <span
            class="text-xs sm:text-xs text-tiny font-light uppercase tracking-widest text-sky-600"
          >
            Connection
          </span>
          <p class="mt-1 font-light uppercase text-xs text-gray-400 text-left">
            <UButton
              v-if="
                row.freight_schedules && row.freight_schedules.flight_number
              "
              size="xs"
              variant="soft"
              color="sky"
              @click.stop="openConnectionModal(row.freight_schedules)"
            >
              {{ row.freight_schedules.airlines.iata
              }}{{ row.freight_schedules.flight_number }}
            </UButton>
            <span v-else class="text-sm font-bold text-pink-400">NO</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

// Props passed to the component
const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  showBlock: {
    type: Boolean,
    default: false,
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
