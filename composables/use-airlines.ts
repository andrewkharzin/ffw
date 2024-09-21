import { useQuery, useQueryClient } from '@tanstack/vue-query'

export function useAirlines() {
  const supabase = useSupabaseClient()
  const queryClient = useQueryClient()

  const fetchAirlines = async () => {
    const { data, error } = await supabase.from('airlines').select()
    if (error) {
      console.error(`Error fetching airlines: ${error.message}`)
      throw new Error(`Error fetching airlines: ${error.message}`)
    }
    console.log('Fetched airlines data:', data) // Log fetched data
    return data
  }

  const queryOptions = {
    queryKey: ['airlines'],
    queryFn: fetchAirlines,
    staleTime: 0, // Данные будут считаться устаревшими немедленно
  }

  const { data: airlines, error, isLoading, refetch } = useQuery(queryOptions)

  const fetchAirlineByName = async (name: string) => {
    const { data, error } = await supabase
      .from('airlines')
      .select()
      .eq('name', name)
      .single()
    if (error) {
      console.error('Error fetching airline by name:', error)
      return null
    }
    return data
  }

  return {
    airlines,
    error,
    isLoading,
    refetch,
    fetchAirlineByName,
  }
}
