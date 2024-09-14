<template>
  <div>
    <h2>FFM Data</h2>
    <table>
      <thead>
        <tr>
          <th>AWB</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Pieces</th>
          <th>Weight</th>
          <th>Volume</th>
          <th>ULDs</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in ffmData" :key="entry.awb">
          <td>{{ entry.awb }}</td>
          <td>{{ entry.origin }}</td>
          <td>{{ entry.destination }}</td>
          <td>{{ entry.pieces }}</td>
          <td>{{ entry.weight }}</td>
          <td>{{ entry.volume }}</td>
          <td>{{ entry.uld }}</td>
          <td>{{ entry.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  ffmData: {
    type: Array,
    default: () => [],
  },
})

// Log ffmData when the component is mounted
onMounted(() => {
  console.log('Component mounted, ffmData:', props.ffmData)
})

// Watch for changes in ffmData and log them
watchEffect(() => {
  console.log('ffmData changed:', props.ffmData)
})
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
