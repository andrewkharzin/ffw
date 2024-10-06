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

  const successMessage = ref('')
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
      console.log('API res.', freightersWithMessages)
      freighters.value = freightersWithMessages
      console.log('Freighters with messages state updated:', freighters.value)
    } catch (err) {
      console.error('Failed to fetch freight schedules:', err)
      error.value = 'Failed to fetch freight schedules. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  const deleteFreighterFlight = async (freighterId: string) => {
    loading.value = true
    error.value = null
    successMessage.value = ''

    const supabase = useSupabaseClient()

    try {
      const { error: deleteError } = await supabase
        .from('freight_schedules')
        .delete()
        .eq('id', freighterId)

      if (deleteError) {
        throw new Error(deleteError.message)
      }

      // Refresh the freighter list after deletion
      await fetchFreighters()

      successMessage.value = 'Freighter flight deleted successfully!'
    } catch (err) {
      console.error('Failed to delete freighter flight:', err)
      error.value = 'Failed to delete freighter flight. Please try again later.'
    } finally {
      loading.value = false
    }
  }


  const addFreighterFlight = async (
    newFreighterData: Partial<FreightSchedule>,
  ) => {
    loading.value = true
    error.value = null
    successMessage.value = '' // Reset the success message

    const supabase = useSupabaseClient()
    const router = useRouter()

    try {
      console.log('New freighter data being inserted:', newFreighterData) // Log the data

      // Check and extract the connection_id if available
      const connection = newFreighterData.connection_id
      const connectionId =
        connection && typeof connection === 'object' ? connection.id : null
      newFreighterData.connection_id = connectionId // Set connection_id as UUID or null

      // Check the IATA code before making the query
      const iataCode = newFreighterData.airline // Ensure this is the correct property
      console.log('IATA Code before validation:', iataCode)

      if (!iataCode) {
        throw new Error('IATA code is required to fetch the airline.')
      }

      // Fetch the airline ID based on the provided IATA code
      const { data: airlineData, error: airlineError } = await supabase
        .from('airlines')
        .select('id')
        .eq('iata', iataCode.trim()) // Trim any extra spaces
        .single() // Expect a single result

      // Handle airline fetch errors
      if (airlineError) {
        console.error('Airline fetch error:', airlineError)
        throw new Error(`Error fetching airline: ${airlineError.message}`)
      }

      if (!airlineData) {
        throw new Error('Airline not found for the provided IATA code.')
      }

      // Fetch the aircraft registration ID (assuming you have an aircraft registration number or code)
      const acRegistrationNumber = newFreighterData.ac_register // Example: assuming this is passed
      if (!acRegistrationNumber) {
        throw new Error('Aircraft registration number is required.')
      }

      const { data: aircraftData, error: aircraftError } = await supabase
        .from('aircrafts_register')
        .select('id')
        .eq('ac_registration_number', acRegistrationNumber.trim()) // Use registration number or other criteria
        .single() // Expect a single result

      // Handle aircraft fetch errors
      if (aircraftError) {
        console.error('Aircraft fetch error:', aircraftError)
        throw new Error(`Error fetching aircraft: ${aircraftError.message}`)
      }

      if (!aircraftData) {
        throw new Error(
          'Aircraft not found for the provided registration number.',
        )
      }

      // Fetch the flight route (airport) ID
      const flightRouteIata = newFreighterData.flight_route
      if (!flightRouteIata) {
        throw new Error('Flight route (IATA) is required.')
      }

      const { data: airportData, error: airportError } = await supabase
        .from('airports')
        .select('id')
        .eq('iata', flightRouteIata.trim())
        .single() // Expect a single result

      // Handle airport fetch errors
      if (airportError) {
        console.error('Airport fetch error:', airportError)
        throw new Error(
          `Error fetching flight route (airport): ${airportError.message}`,
        )
      }

      if (!airportData) {
        throw new Error('Airport not found for the provided IATA code.')
      }

      // Prepare the newFreighterData object with IDs
      const freighterDataToInsert = {
        ...newFreighterData,
        airline: airlineData.id, // Set the airline ID
        ac_register: aircraftData.id,
        flight_route: airportData.id, // Set the flight route (airport) ID
      }

      // Insert the new freighter flight into the freight_schedules table
      const { data, error: insertError } = await supabase
        .from('freight_schedules')
        .insert([freighterDataToInsert])

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Refresh the freighter list after adding
      await fetchFreighters()

      console.log('Freighter flight added successfully:', data)

      console.log('Freighter flight added successfully:', data)
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
    deleteFreighterFlight, // Expose the delete function
  }
}
