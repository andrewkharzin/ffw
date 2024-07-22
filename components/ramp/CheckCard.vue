<template>
  <div>
    <div class="px-4 py-4 bg-white dark:bg-slate-900 dark:bg-gray-800 shadow rounded-lg w-full  hover:shadow-slate-700/50 mx-auto mb-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex">

         
            <img v-if="airlineLogo" :src="airlineLogo" class="w-10 h-10 mt-5 rounded-full p-2 border border-slate-500" />
            <span v-else>{{ extractIATACode(check.inboundFlight.flight_number) }}</span>
             
           
         
          
          
          <div class="ml-2 mt-0.5 col-span-2 flex items-center space-x-2 ">
             <div class="">

         
              <span class="flex items-center text-sm font-bold leading-snug text-teal-600 dark:text-gray-200/70">
                <Icon name="carbon:arrival"  size="15px" class="mr-1 text-gray-200" />
                {{ check.inboundFlight.flight_number }}
              </span>
              <span class="flex items-center text-sm font-bold leading-snug text-pink-600 dark:text-pink-600/70">
                <Icon name="guidance:arrival"  size="15px" class="mr-1 text-gray-200" />
                {{ check.outboundFlight.flight_number }}
              </span>
               
             </div>


              
          </div>
          <UDivider size="xs" orientation="vertical" class="ml-4 py-2" />
          <div class="flex flex-col">
            <div class="ml-0 p-2 grid grid-cols-2 gap-2">
              <UIcon name="i-heroicons-calendar-days" size="10px" class="mt-1" />
              <span class="ml-2 text-md font-sans font-light dark:text-cyan-600 text-slate-800">{{ convertDateFormat(check.data)}}</span>
            </div>
            <UDivider size="xs"  class="ml-2" />
            <div class="ml-0 p-2">
              
                <span class="uppercase text-ssm font-mono dark:text-gray-300">
                  <UBadge size="xs" :color="check.status === 'approved' ? 'primary' : 'white'" variant="solid">
                    {{ check.status }}
                  </UBadge>
                </span>
            </div>
          </div>
             
        </div>
        <div class="flex flex-row-reverse mt-4">
          
    
          
        </div>
        
      </div>
     
    
    <Disclosure>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <DisclosureButton class="w-14 h-10 rounded-lg ">
          <div class="">
            <div class="">
              <div class="" v-if="check.inboundFlight">

                 <UButton
                      icon="i-heroicons-ellipsis-horizontal"
                      size="md"
                      color="cyan"
                      square
                      variant="ghost"
                    />
                
          
              </div>
            </div>
          </div>
        </DisclosureButton>
        <div class="mt-2 flex flex-row-reverse">
          <NuxtLink :to="`/ramp/check/list/${check.id}`">
             <Icon name="quill:paper" class="hover:text-teal-500 ml-4 text-gray-400" size="25px" />
            </NuxtLink>
         
         <!-- <NuxtLink :to="`/ramp/check/list/${check.id}`">
             <Icon name="mdi:paper-roll" class="ml-4 text-gray-400" size="25px" />
            </NuxtLink> -->
        </div>
        
        
      </div>
      
      <DisclosurePanel class="mt-5 text-gray-500">
        <div class="flex flex-col space-y-2">
          <p class="text-gray-300 text-base dark:text-gray-300 flex items-center">
            <Icon name="uiw:date" class="dark:text-white text-slate-900" size="18px" />
            <span class="ml-2 text-sm font-light hover:text-cyan-600 cursor-pointer">
            {{ check.data }}</span>
          </p>
          <p class="text-gray-300 text-base dark:text-gray-300 flex items-center" v-if="check.inboundFlight">
            <Icon name="carbon:arrival" class="dark:text-white text-slate-900" size="20px"/>
            <p class="ml-2 text-sm font-light text-gray-400">{{ check.inboundFlight.flight_number }} |
              <span class="text-sm text-tiny font-mono font-bold text-pink-500">{{ check.inboundFlight.departure_airport }}</span>
            </p>
          </p>
          <p class="text-gray-300 text-base dark:text-gray-300 flex items-center" v-if="check.outboundFlight">
            <Icon name="guidance:arrival" class="dark:text-white text-slate-900" size="20px" />
            <p class="ml-2 text-sm font-light text-gray-400">{{ check.outboundFlight.flight_number }} |
              <span class="text-sm text-tiny font-mono font-bold text-pink-500">{{ check.outboundFlight.destination_airport }}</span>
            </p>
          </p>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="text-tiny text-sm text-gray-300">Status:
                <span v-if="check.status === 'new'" class="ml-2 uppercase text-sm text-green-300 font-mono">New</span>
                <!-- <Icon v-else-if="check.status === 'approved'" name="mdi:check-outline" color="#4dff00" size="15px" class="ml-2 text-teal-500" /> -->
                <span v-else-if="check.status === 'approved'" class="ml-2 uppercase text-sm text-teal-400 font-mono">Approved</span>

              </p>
            </div>
            
          </div>
        </div>
        <div class="flex justify-between items-start mt-5">
          
           <NuxtImg v-if="avatar_path" :src="avatar_path" class="rounded-full w-8 h-8" />
          <div class="flex flex-col">
            <p class="text-ssm italic text-tiny text-gray-400">Checked By
            
          </p>
          <span class="text-sm text-slate-600">{{ creator_username }}</span>
          </div>
          <div class="text-gray-500 dark:text-gray-400 font-light">2 Revise</div>
        </div>
        <div class="flex flex-row-reverse mt-4">
          <!-- Add delete button here -->
           <button 
           v-if="isCurrentUserCreator"
           @click="showDeleteConfirmation(check.id)">
            <Icon name="mdi:delete-outline" class="text-red-600 font-bold" size="25px" />
          </button>
          <RampCheckCustomToast ref="customToast">
          <template #message>
              Are you sure to delete?
            </template>
            <template #buttons>
              <button
                class="px-4 py-2 bg-red-500 text-white rounded mr-2"
                @click="deleteRampCheck(check.id); customToast.close();"
              >
                Yes

              </button>
              <button
                class="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                @click="customToast.close()"
              >
                No
              </button>
            </template>
          </RampCheckCustomToast>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
    
  </div>

</template>

<script setup>
import { defineProps, computed, ref, defineEmits } from 'vue';
import { formatDate } from '@/configs/date_util';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@headlessui/vue'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import ConfirmationToastContent from '@/components/ramp/check/ConfirmationToastContent.vue';

const customToast = ref(null);

const airlineLogo = ref('');


const showDeleteConfirmation = (checkId) => {
  customToast.value.open();
};



const props = defineProps({
  check: {
    type: Object,
    required: true,
  },
});

const supabase = useSupabaseClient()

const colorMode = useColorMode();


const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_path = ref('')
const creator_username = ref('');



loading.value = true

const user = useSupabaseUser()
const emit = defineEmits(['ramp-check-deleted']); // Define emitted event

const isCurrentUserCreator = computed(() => {
  return props.check.user_id === user.value?.id;
});


const fetchData = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('avatar_url, username')
      .eq('id', props.check.user_id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else if (data) {
      avatar_path.value = data.avatar_url;
      creator_username.value = data.username;
    }
  } catch (error) {
    console.error('Unexpected error fetching profile:', error.message);
  }
};

onMounted(() => {
  fetchData();
});

const deleteRampCheck = async (id) => {
  try {
    const { error } = await supabase
      .from('ramp_check')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ramp check:', error.message);
    } else {
      // Emit an event to inform the parent component that a ramp check was deleted
      emit('ramp-check-deleted'); // Emit the event here
      toast.success('Ramp check deleted successfully');
    }
  } catch (err) {
    console.error('Unexpected error deleting ramp check:', err.message);
    toast.error('Unexpected error: ' + error.message);
  }
};

async function fetchAirlineData(iataCode) {
  try {
    const { data, error } = await supabase
      .from('airlines')
      .select('logo')
      .eq('iata', iataCode)
      .single();

    if (error) {
      console.error('Error fetching airline data:', error.message);
    } else if (data) {
      airlineLogo.value = data.logo;
    }
  } catch (error) {
    console.error('Unexpected error fetching airline data:', error.message);
  }
}


function extractIATACode(flightNumber) {
  const iataCode = flightNumber.split(/[0-9]/)[0];
  fetchAirlineData(iataCode);
  return iataCode;
}

function convertDateFormat(dateString) {
  const [year, month, day] = dateString.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  const formattedDay = parseInt(day, 10);
  const formattedYear = year.slice(-2);

  return `${formattedDay}${formattedMonth}${formattedYear}`;
}




</script>
