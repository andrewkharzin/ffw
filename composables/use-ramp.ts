import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export function useRamp() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const loading = ref(true)
  const username = ref('')
  const avatar_path = ref('')
  const creator_username = ref('')
  const airlineLogo = ref('')
  const rampChecks = ref([])

  const fetchRampChecksByAirline = async (airlineId) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('ramp_check')
        .select(
          `
          id,
          created_at,
          data,
          status,
          user_id,
          inbound_flight: flights!ramp_check_inbound_flight_id_fkey(flight_number, departure_airport, destination_airport, airline_id)
        `,
        )
        .eq('inbound_flight.airline_id', airlineId) // Ensure filtering by airlineId
        .not('inbound_flight', 'is', null) // Ensure that inbound_flight is not null

      if (error) {
        console.error('Error fetching ramp checks:', error.message)
      } else if (data) {
        console.log('Fetched ramp checks:', data)
        rampChecks.value = data
      }
    } catch (error) {
      console.error('Unexpected error fetching ramp checks:', error.message)
    } finally {
      loading.value = false
    }
  }

  const fetchData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        toast.error('Error fetching profile: ' + error.message)
      } else if (data) {
        avatar_path.value = data.avatar_url
        creator_username.value = data.username
      }
    } catch (error: any) {
      console.error('Unexpected error fetching profile:', error.message)
      toast.error('Unexpected error: ' + error.message)
    }
  }

  const deleteRampCheck = async (id: string, emit: (event: string) => void) => {
    try {
      const { error } = await supabase.from('ramp_check').delete().eq('id', id)

      if (error) {
        console.error('Error deleting ramp check:', error.message)
        toast.error('Error deleting ramp check: ' + error.message)
      } else {
        emit('ramp-check-deleted')
        toast.success('Ramp check deleted successfully')
      }
    } catch (err: any) {
      console.error('Unexpected error deleting ramp check:', err.message)
      toast.error('Unexpected error: ' + err.message)
    }
  }

  const fetchAirlineData = async (iataCode: string) => {
    try {
      const { data, error } = await supabase
        .from('airlines')
        .select('logo')
        .eq('iata', iataCode)
        .single()

      if (error) {
        console.error('Error fetching airline data:', error.message)
        toast.error('Error fetching airline data: ' + error.message)
      } else if (data) {
        airlineLogo.value = data.logo
      }
    } catch (error: any) {
      console.error('Unexpected error fetching airline data:', error.message)
      toast.error('Unexpected error: ' + error.message)
    }
  }

  // Function to fetch the profile data (avatar_url and username) by user_id
  const fetchProfileByUserId = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
        toast.error('Error fetching profile: ' + error.message)
      } else if (data) {
        avatar_path.value = data.avatar_url
        creator_username.value = data.username // Set the username here
      }
    } catch (error: any) {
      console.error('Unexpected error fetching profile:', error.message)
      toast.error('Unexpected error: ' + error.message)
    }
  }

  return {
    loading,
    username,
    avatar_path,
    creator_username,
    airlineLogo,
    fetchData,
    deleteRampCheck,
    fetchAirlineData,
    rampChecks, // Ramp checks data
    fetchRampChecksByAirline, // Function to fetch ramp checks
    fetchProfileByUserId,
  }
}
