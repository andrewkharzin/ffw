<template>
  <div>
    <h2>Arrival Information</h2>
    <table v-if="arrivalData.length > 0">
      <thead>
        <tr>
          <th>Created At</th>
          <th>Documents Time</th>
          <th>Offload Permission Time</th>
          <th>Offload Bulk Time Start</th>
          <th>Offload Bulk Time End</th>
          <th>Offload LD Forward Time Start</th>
          <th>Offload LD Forward Time End</th>
          <th>Offload MD Time Start</th>
          <th>Offload MD Time End</th>
          <th>Offload LD Aft Time Start</th>
          <th>Offload LD Aft Time End</th>
          <th>ID</th>
          <th>Ramp Check ID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in arrivalData" :key="item.id">
          <td>{{ item.created_at }}</td>
          <td>{{ item.documents_time }}</td>
          <td>{{ item.offload_permition_time }}</td>
          <td>{{ item.offload_bulk_time_start }}</td>
          <td>{{ item.offload_bulk_time_end }}</td>
          <td>{{ item.offload_ld_forward_time_start }}</td>
          <td>{{ item.offload_ld_forward_time_end }}</td>
          <td>{{ item.offload_md_time_start }}</td>
          <td>{{ item.offload_md_time_end }}</td>
          <td>{{ item.offload_ld_aft_time_start }}</td>
          <td>{{ item.offload_ld_aft_time_end }}</td>
          <td>{{ item.id }}</td>
          <td>{{ item.ramp_check_id }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No arrival info data available.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const supabase = useSupabaseClient()
const arrivalData = ref([])

async function fetchArrivalInfo() {
  try {
    const { data, error } = await supabase
      .from('ramp_check_arrival')
      .select('*') // Select all columns

    if (error) {
      throw new Error('Error fetching arrival info data')
    }

    arrivalData.value = data || []
  } catch (error) {
    console.error(error.message)
  }
}

onMounted(() => {
  fetchArrivalInfo()
})
</script>
