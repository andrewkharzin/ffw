import { ref } from 'vue'
import type { Database } from '@/types/supabase'

export function useRampCheck() {
  const supabase = useSupabaseClient<Database>()
  const rampCheckCount = ref<number>(0)

  // Fetch flights associated with the airline ID
  const getFlightsByAirlineId = async (airlineId: string) => {
    console.log('Fetching flights for airline ID:', airlineId)
    const { data, error } = await supabase
      .from('flights')
      .select('id')
      .eq('airline_id', airlineId)

    if (error) {
      console.error('Error fetching flights:', error)
      return []
    } else {
      console.log('Flights fetched:', data)
      return data
    }
  }

  // Fetch ramp check count by airline ID
  const fetchRampCheckCount = async (airlineId: string) => {
    console.log('Fetching ramp check count for airline ID:', airlineId)
    const flightIds = (await getFlightsByAirlineId(airlineId)).map((f) => f.id)

    if (flightIds.length === 0) {
      console.warn('No flights found for airline ID:', airlineId)
      rampCheckCount.value = 0
      return
    }

    console.log('Flight IDs to check for ramp checks:', flightIds)

    const { count, error } = await supabase
      .from('ramp_check')
      .select('id', { count: 'exact' })
      .in('inbound_flight_id', flightIds)

    if (error) {
      console.error('Error fetching ramp check count:', error)
    } else {
      console.log('Ramp check count fetched:', count)
      rampCheckCount.value = count || 0
    }
  }

  return {
    rampCheckCount,
    fetchRampCheckCount,
  }
}
