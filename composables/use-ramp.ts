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

  const fetchData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error.message)
      } else if (data) {
        avatar_path.value = data.avatar_url
        creator_username.value = data.username
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error.message)
    }
  }

  const deleteRampCheck = async (id, emit) => {
    try {
      const { error } = await supabase.from('ramp_check').delete().eq('id', id)

      if (error) {
        console.error('Error deleting ramp check:', error.message)
      } else {
        emit('ramp-check-deleted')
        toast.success('Ramp check deleted successfully')
      }
    } catch (err) {
      console.error('Unexpected error deleting ramp check:', err.message)
      toast.error('Unexpected error: ' + err.message)
    }
  }

  const fetchAirlineData = async (iataCode) => {
    try {
      const { data, error } = await supabase
        .from('airlines')
        .select('logo')
        .eq('iata', iataCode)
        .single()

      if (error) {
        console.error('Error fetching airline data:', error.message)
      } else if (data) {
        airlineLogo.value = data.logo
      }
    } catch (error) {
      console.error('Unexpected error fetching airline data:', error.message)
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
  }
}
