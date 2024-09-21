import { ref } from 'vue'

export const useRegisterByIata = () => {
  const supabase = useSupabaseClient()
  const aircrafts = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAircrafts = async (airlineIata: string) => {
    if (!airlineIata) {
      error.value = 'Airline IATA code is required.'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('aircrafts_register')
        .select('*')
        .eq('ac_airline_iata', airlineIata)

      if (fetchError) throw fetchError

      aircrafts.value = data || []
      console.log("Register by IATA", data)
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    aircrafts,
    loading,
    error,
    fetchAircrafts,
  }
}
