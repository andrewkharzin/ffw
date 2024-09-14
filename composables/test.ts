import { ref, watch } from 'vue'
import type { Database } from '@/types/supabase'
type FreightSchedule = Database['public']['Tables']['freight_schedules']['Row']
type FltMessage = Database['public']['Tables']['flt_messages']['Row']

export function useFreighters() {
  const freighters = ref<FreightSchedule[]>([]) // Use the imported type
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedFlightType = ref<'Inbound' | 'Outbound'>('Inbound') // New state for selecting flight type

  const fetchFreighters = async () => {
    loading.value = true
    error.value = null

    const supabase = useSupabaseClient()

    try {
      const { data, error: supabaseError } = await supabase
        .from('freight_schedules')
        .select(
          `
          id,
          flight_psd,
          flight_pst,
          flight_number,
          flight_route,
          airline,
          ac_register,
          flight_type,
          connection_id,
          flight_handling_status,
          airports:flight_route(iata),
          airlines:airline(logo, iata, name),
          aircrafts_register:ac_register(ac_registration_number, ac_code),
          freight_schedules:connection_id(
          flight_number,
          flight_psd,
          flight_pst,
          flight_route,
          airline,
          ac_register, airports:flight_route(iata),
          airlines:airline(logo, iata, name),
          aircrafts_register:ac_register(ac_registration_number, ac_code),
          )
        `,
        )
        .eq('flight_type', selectedFlightType.value) // Filter based on the selected flight type

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }


      freighters.value = data || []
      console.log('Freighters state updated:', freighters.value)
    } catch (err) {
      console.error('Failed to fetch freight schedules:', err)
      error.value = 'Failed to fetch freight schedules. Please try again later.'
    } finally {
      loading.value = false
    }
  }


  // Watch for changes in selectedFlightType and refetch freighters
  watch(selectedFlightType, fetchFreighters)

  return {
    freighters,
    loading,
    error,
    fetchFreighters,
    selectedFlightType, // Export the flight type selection
  }
}

// New composable for fetching flt_messages by freighter_id
export function useTelexes(freighterId: string) {
  const telexes = ref<FltMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTelexes = async () => {
    loading.value = true
    error.value = null

    const supabase = useSupabaseClient()

    try {
      const { data, error: supabaseError } = await supabase
        .from('flt_messages')
        .select('*')
        .eq('freighter_id', freighterId)

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      telexes.value = data || []
      console.log("Telexes", data)
      console.log('Telexes state updated:', telexes.value)
    } catch (err) {
      console.error('Failed to fetch telexes:', err)
      error.value = 'Failed to fetch telexes. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  return {
    telexes,
    loading,
    error,
    fetchTelexes,
  }
}
