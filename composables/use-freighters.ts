import { ref, watch } from 'vue'
import type { Database } from '@/types/supabase'
import { parseFFM } from '@/utils/parsers/FFM' // Import your FFM parser
import type { FFMResult } from '@/utils/parsers/FFM'

type FreightSchedule = Database['public']['Tables']['freight_schedules']['Row']
type FltMessage = Database['public']['Tables']['flt_messages']['Row']

export function useFreighters() {
  const freighters = ref<
    (FreightSchedule & {
      hasFFM: boolean
      hasCPM: boolean
      hasLDM: boolean
      hasFWB: boolean
      parsedFFM?: FFMResult | null // Add parsed FFM data here
    })[]
  >([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedFlightType = ref<'Inbound' | 'Outbound'>('Inbound')

  const fetchFreighters = async () => {
    loading.value = true
    error.value = null

    const supabase = useSupabaseClient()

    try {
      // Fetch freight schedules
      const { data: freightData, error: supabaseError } = await supabase
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
          freighter_schedules:connection_id(flight_number, flight_psd, flight_pst, flight_route, airlines:airline(logo, iata, name))
        `,
        )
        .eq('flight_type', selectedFlightType.value)

      if (supabaseError) {
        throw new Error(supabaseError.message)
      }

      // Loop through freight schedules and fetch related flt_messages for each
      const freightersWithMessages = await Promise.all(
        (freightData || []).map(async (freighter) => {
          const { data: telexData, error: telexError } = await supabase
            .from('flt_messages')
            .select('message_type, msg_body')
            .eq('freighter_id', freighter.id)

          if (telexError) {
            console.error(
              'Error fetching messages for freighter:',
              freighter.id,
            )
            return {
              ...freighter,
              hasFFM: false,
              hasCPM: false,
              hasLDM: false,
              hasFWB: false,
            }
          }

          // Check if FFM, CPM, LDM, and FWB messages exist
          const hasFFM =
            telexData?.some((msg: FltMessage) => msg.message_type === 'FFM') ??
            false
          const hasCPM =
            telexData?.some((msg: FltMessage) => msg.message_type === 'CPM') ??
            false
          const hasLDM =
            telexData?.some((msg: FltMessage) => msg.message_type === 'LDM') ??
            false
          const hasFWB =
            telexData?.some((msg: FltMessage) => msg.message_type === 'FWB') ??
            false

          // Parse FFM message if it exists
          let parsedFFM: FFMResult | null = null
          if (hasFFM) {
            const ffmMessage = telexData.find(
              (msg: FltMessage) => msg.message_type === 'FFM',
            )
            if (ffmMessage?.msg_body) {
              parsedFFM = parseFFM(ffmMessage.msg_body)
            }
          }

          return { ...freighter, hasFFM, hasCPM, hasLDM, hasFWB, parsedFFM }
        }),
      )
      console.log("API res.", freightersWithMessages)
      freighters.value = freightersWithMessages
      console.log('Freighters with messages state updated:', freighters.value)
    } catch (err) {
      console.error('Failed to fetch freight schedules:', err)
      error.value = 'Failed to fetch freight schedules. Please try again later.'
    } finally {
      loading.value = false
    }
  }
  // Function to add a new freighter flight
  const addFreighterFlight = async (newFreighterData: Partial<FreightSchedule>) => {
    loading.value = true
    error.value = null

    const supabase = useSupabaseClient()

    try {
      const { data, error: insertError } = await supabase
        .from('freight_schedules')
        .insert([newFreighterData])

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Refresh the freighter list after adding
      await fetchFreighters()
    } catch (err) {
      console.error('Failed to add freighter flight:', err)
      error.value = 'Failed to add freighter flight. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  watch(selectedFlightType, fetchFreighters)

  return {
    freighters,
    loading,
    error,
    fetchFreighters,
    selectedFlightType,
    addFreighterFlight,
  }
}
