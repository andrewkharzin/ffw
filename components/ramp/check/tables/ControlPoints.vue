<template>
  <div>
    <h3 class="ml-4 text-gray-800 dark:text-gray-300">{{ $t('Control Points') }}</h3>
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
import { ref, watch } from 'vue';
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  created_at: {
    type: String,
    required: true,
  },
  stuff_ready: {
    type: Boolean,
    required: true,
  },
  fuselage_checked: {
    type: Boolean,
    required: true,
  },
  edges_of_hatches_checked: {
    type: Boolean,
    required: true,
  },
  cargo_comp_checked: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  ramp_check_id: {
    type: String,
    required: true,
  },
});

const tableData = ref([]);

const fieldClass = 'px-4 py-2 text-left font-light text-sm';
const valueClass = 'px-4 py-2 text-right font-bold font-mono dark:text-cyan-500 text-black';

// Watch for changes in the props and update tableData accordingly
watch(
  () => [
    props.created_at,
    props.stuff_ready,
    props.fuselage_checked,
    props.edges_of_hatches_checked,
    props.cargo_comp_checked,
    props.id,
    props.ramp_check_id,
  ],
  () => {
    tableData.value = [
      { field: t('table.created_at'), value: props.created_at },
      { field: t('table.stuff_ready'), value: props.stuff_ready ? t('yes') : t('no') },
      { field: t('table.fuselage_checked'), value: props.fuselage_checked ? t('yes') : t('no') },
      { field: t('table.edges_of_hatches_checked'), value: props.edges_of_hatches_checked ? t('yes') : t('no') },
      { field: t('table.cargo_comp_checked'), value: props.cargo_comp_checked ? t('yes') : t('no') },
      { field: t('table.id'), value: props.id },
      { field: t('table.ramp_check_id'), value: props.ramp_check_id },
    ];
    console.log('Table Data Updated:', tableData.value);
  },
  { immediate: true }
);

console.log('Props in ControlPoints:', props);
</script>
