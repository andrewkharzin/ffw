import { ref, watchEffect } from 'vue'
import type { Database } from '@/types/supabase'
import type { FFMResult } from '@/utils/parsers/FFM'
import { parseFFM } from '@/utils/parsers/FFM'

type FreightSchedule = Database['public']['Tables']['freight_schedules']['Row']
type FltMessage = Database['public']['Tables']['flt_messages']['Row']

export function useFreighterById(id: string) {
  const freighter = ref<
    | (FreightSchedule & {
        hasFFM: boolean
        hasCPM: boolean
        hasLDM: boolean
        hasFWB: boolean
        parsedFFM?: FFMResult | null
      })
    | null
  >(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const supabase = useSupabaseClient()

  const fetchFreighterById = async () => {
    loading.value = true
    error.value = null

    try {
      const { data: freighterData, error: fetchError } = await supabase
        .from('freight_schedules')
        .select(`
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
          aircrafts_register:ac_register(ac_registration_number, ac_code)
        `)
        .eq('id', id)
        .single()

      if (fetchError) {
        error.value = fetchError.message
        return
      }

      const { data: telexData, error: telexError } = await supabase
        .from('flt_messages')
        .select('message_type, msg_body')
        .eq('freighter_id', id)

      if (telexError) {
        error.value = telexError.message
        return
      }

      const hasFFM = telexData?.some((msg: FltMessage) => msg.message_type === 'FFM') ?? false
      const hasCPM = telexData?.some((msg: FltMessage) => msg.message_type === 'CPM') ?? false
      const hasLDM = telexData?.some((msg: FltMessage) => msg.message_type === 'LDM') ?? false
      const hasFWB = telexData?.some((msg: FltMessage) => msg.message_type === 'FWB') ?? false

      let parsedFFM: FFMResult | null = null
      if (hasFFM) {
        const ffmMessage = telexData.find((msg: FltMessage) => msg.message_type === 'FFM')
        if (ffmMessage?.msg_body) {
          parsedFFM = parseFFM(ffmMessage.msg_body)
        }
      }

      freighter.value = {
        ...freighterData,
        hasFFM,
        hasCPM,
        hasLDM,
        hasFWB,
        parsedFFM,
      }
    } catch (err) {
      console.error('Failed to fetch freighter details:', err)
      error.value = 'Failed to fetch freighter details. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    if (id) {
      fetchFreighterById()
    }
  })

  return {
    freighter,
    loading,
    error,
  }
}
