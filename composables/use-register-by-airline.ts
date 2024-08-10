// composables/use-register-by-airline.ts
import { ref } from 'vue'
import type { Database } from '@/types/supabase'

export const useRegisterByAirline = () => {
  const supabase = useSupabaseClient()
  const aircrafts = ref<
    Database['public']['Tables']['aircrafts_register']['Row'][]
  >([])
  const aircraft = ref<
    Database['public']['Tables']['aircrafts_register']['Row'] | null
  >(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAircrafts = async (airlineId: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('aircrafts_register')
        .select('*')
        .eq('airline_id', airlineId)

      if (fetchError) throw fetchError

      aircrafts.value = data
      console.log('Register', data)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchAircraftById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('aircrafts_register')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      aircraft.value = data
      console.log('Aircraft', data)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    aircrafts,
    aircraft,
    loading,
    error,
    fetchAircrafts,
    fetchAircraftById,
  }
}
