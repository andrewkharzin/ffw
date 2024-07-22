<template>
  <div>
    <h3 class="ml-4 text-gray-800 dark:text-gray-300">{{ $t('Arrival activity') }}</h3>
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="">
        <tr>
          <th scope="col" class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
            <span class="sr-only">{{ $t('field') }}</span> <!-- Visually hide this text -->
          </th>
          <th scope="col" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span class="sr-only">{{ $t('value') }}</span> <!-- Visually hide this text -->
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-slate-900/70 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(row, index) in tableData" :key="index">
          <td :class="fieldClass">{{ row.field }}</td>
          <td :class="valueClass">{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="tableData.length === 0">{{ $t('no_data') }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();

const props = defineProps({
  created_at: {
    type: String,
    required: true,
  },
  documents_time: {
    type: String,
    required: false,
  },
  offload_permition_time: {
    type: String,
    required: false,
  },
  offload_bulk_time_start: {
    type: String,
    required: false,
  },
  offload_bulk_time_end: {
    type: String,
    required: false,
  },
  offload_ld_forward_time_start: {
    type: String,
    required: false,
  },
  offload_ld_forward_time_end: {
    type: String,
    required: false,
  },
  offload_md_time_start: {
    type: String,
    required: false,
  },
  offload_md_time_end: {
    type: String,
    required: false,
  },
  offload_ld_aft_time_start: {
    type: String,
    required: false,
  },
  offload_ld_aft_time_end: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  ramp_check_id: {
    type: String,
    required: false,
  },
});

const tableData = ref([]);

const fieldClass = 'px-4 py-2 text-left font-light  text-sm';
const valueClass = 'px-4 py-2 text-right font-bold font-mono dark:text-cyan-500 text-black';

// Utility function to remove seconds from time string
const formatTimeWithoutSeconds = (timeString) => {
  if (!timeString) return '';
  const [time, seconds] = timeString.split(':');
  return `${time}:${seconds ? seconds.slice(0, 2) : ''}`;
};

watch(
  () => [
    props.created_at,
    props.documents_time,
    props.offload_permition_time,
    props.offload_bulk_time_start,
    props.offload_bulk_time_end,
    props.offload_ld_forward_time_start,
    props.offload_ld_forward_time_end,
    props.offload_md_time_start,
    props.offload_md_time_end,
    props.offload_ld_aft_time_start,
    props.offload_ld_aft_time_end,
    props.id,
    props.ramp_check_id,
  ],
  () => {
    tableData.value = [
       { field: t('table.documents_time'), value: props.documents_time },
      { field: t('table.offload_permition_time'), value: formatTimeWithoutSeconds(props.offload_permition_time) },
      { field: t('table.offload_bulk_time_start'), value: formatTimeWithoutSeconds(props.offload_bulk_time_start) },
      { field: t('table.offload_bulk_time_end'), value: formatTimeWithoutSeconds(props.offload_bulk_time_end) },
      { field: t('table.offload_ld_forward_time_start'), value: formatTimeWithoutSeconds(props.offload_ld_forward_time_start) },
      { field: t('table.offload_ld_forward_time_end'), value: formatTimeWithoutSeconds(props.offload_ld_forward_time_end) },
      { field: t('table.offload_md_time_start'), value: formatTimeWithoutSeconds(props.offload_md_time_start) },
      { field: t('table.offload_md_time_end'), value: formatTimeWithoutSeconds(props.offload_md_time_end) },
      { field: t('table.offload_ld_aft_time_start'), value: formatTimeWithoutSeconds(props.offload_ld_aft_time_start) },
      { field: t('table.offload_ld_aft_time_end'), value: formatTimeWithoutSeconds(props.offload_ld_aft_time_end) },
    
    
    ];
    console.log('Table Data Updated:', tableData.value);
  },
  { immediate: true }
);

console.log('Props in ArrivalInfo:', props);
</script>
