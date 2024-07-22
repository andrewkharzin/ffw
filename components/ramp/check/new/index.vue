<template>
  <div class="dark:bg-slate-900">
     <UCard class="dark:bg-slate-900 bg-slate-900 flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create Check
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen = false" />
          </div>
        </template>
        
        <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
          <UFormGroup label="Status" name="status">
            <UInput v-model="form.status" />
          </UFormGroup>
          
          <UFormGroup label="Inbound Flight ID" name="inbound_flight_id">
            <UInput v-model="form.inbound_flight_id" />
          </UFormGroup>
          
          <UFormGroup label="Outbound Flight ID" name="outbound_flight_id">
            <UInput v-model="form.outbound_flight_id" />
          </UFormGroup>
  
          <UButton type="submit">
            Create
          </UButton>
        </UForm>
        
      </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
// import { useSupabaseClient } from '@supabase/supabase-js';
// import AppBar from '@/components/AppBar.vue';


const schema = z.object({
  status: z.string().nonempty('Status is required'),
  inbound_flight_id: z.string().nonempty('Inbound Flight ID is required'),
  outbound_flight_id: z.string().nonempty('Outbound Flight ID is required')
});

type Schema = z.output<typeof schema>;

const form = reactive<Schema>({
  status: '',
  inbound_flight_id: '',
  outbound_flight_id: ''
});

const supabase = useSupabaseClient();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  await supabase
    .from('ramp_check')
    .insert({
      status: event.data.status,
      inbound_flight_id: event.data.inbound_flight_id,
      outbound_flight_id: event.data.outbound_flight_id
    });
  isOpen.value = false; // Close the slide-over after submitting
};
</script>

