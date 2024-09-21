import { ref } from 'vue'

export function useAirlinesForFreighter() {
  const supabase = useSupabaseClient()

  const airlines = ref(null) // Список авиакомпаний
  const isLoading = ref(false) // Статус загрузки
  const error = ref(null) // Ошибка

  // Функция для получения всех авиакомпаний
  const fetchAirlines = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('airlines')
        .select()

      if (fetchError) {
        console.error('Error fetching airlines:', fetchError)
        error.value = fetchError
        return
      }

      airlines.value = data
      console.log('Fetched airlines:', data)
    } catch (err) {
      console.error('Unexpected error:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  // Функция для получения авиакомпании по названию (или любому другому параметру)
  const fetchAirlineByName = async (name: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('airlines')
        .select()
        .eq('name', name)
        .single()

      if (fetchError) {
        console.error('Error fetching airline by name:', fetchError)
        error.value = fetchError
        return null
      }

      console.log(`Fetched airline by name (${name}):`, data)
      return data
    } catch (err) {
      console.error('Unexpected error:', err)
      error.value = err
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    airlines, // Возвращает список авиакомпаний
    isLoading, // Статус загрузки
    error, // Ошибка, если есть
    fetchAirlines, // Функция для получения всех авиакомпаний
    fetchAirlineByName, // Функция для получения авиакомпании по имени
  }
}
