<template>
  <div class="card bg-slate-950/30">
    <!-- Replace IV with the dynamic IATA code -->
    <div class="card-left">
      <span>{{ row.airlines.iata }}</span>
    </div>

    <!-- Replace Invision with NuxtLink to flight number -->
    <div class="card-content">
      <NuxtLink :to="`/flights/freighter/${row.id}`" class="title-link">
        {{ row.flight_number }}
      </NuxtLink>

      <!-- Replace 3 issues with the flight details -->
      <p class="font-normal text-sm sm:text-sm text-slate-300">
        <UIcon name="paper-airplane" />{{ row.aircrafts_register.ac_code }}
        <span class="font-normal text-sm sm:text-sm text-pink-500 font-mono">
          {{ row.aircrafts_register.ac_registration_number }}
        </span>
      </p>
    </div>

    <!-- Menu icon remains the same -->
    <div class="menu-icon">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  row: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
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
  background: rgb(0,174,209);
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
