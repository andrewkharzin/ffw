<template>
  <div>
    <h3 class="ml-4 text-gray-800 dark:text-gray-300">{{ $t('Base Info') }}</h3>
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
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
import { ref, watch, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  created_at: {
    type: String,
    required: true,
  },
  inbound_flight_number: {
    type: String,
    required: false,
  },
  outbound_flight_number: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  user_id: {
    type: String,
    required: false,
  },
});

const tableData = ref([]);

const fieldClass = 'px-4 py-2 text-left font-light text-sm';
const valueClass = 'px-4 py-2 text-right font-bold font-mono dark:text-cyan-500 text-black';

watch(
  () => [
    props.data,
    props.inbound_flight_number,
    props.outbound_flight_number,
    props.id,
    props.status,
    props.user_id,
  ],
  () => {
    tableData.value = [
      { field: t('table.created_at'), value: props.data },
      { field: t('table.inbound_flight_number'), value: props.inbound_flight_number },
      { field: t('table.outbound_flight_number'), value: props.outbound_flight_number },
      { field: t('table.status'), value: props.status },
    ];
  },
  { immediate: true }
);
</script>
