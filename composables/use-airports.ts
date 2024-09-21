import type { Database } from '@/types/supabase' // Import your Database type

type Airport = Database['public']['Tables']['airports']['Row'] // Define Airport type

export const useAirports = () => {
  const supabase = useSupabaseClient<Database>() // Correct the usage of useSupabaseClient

  // Fetch all airports
  const getAirports = async (): Promise<Airport[] | null> => {
    const { data, error } = await supabase.from('airports').select('*')
    console.log('Airports:', data)
    if (error) {
      console.error('Error fetching airports:', error)
      return null
    }

    return data as Airport[]
  }

  // Fetch a single airport by id
  const getAirportById = async (id: string): Promise<Airport | null> => {
    const { data, error } = await supabase
      .from('airports')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching airport:', error)
      return null
    }

    return data as Airport
  }

  // Create a new airport
  const createAirport = async (
    airport: Omit<Airport, 'id'>,
  ): Promise<Airport | null> => {
    const { data, error } = await supabase
      .from('airports')
      .insert([airport])
      .single()

    if (error) {
      console.error('Error creating airport:', error)
      return null
    }

    return data as Airport
  }

  // Update an airport
  const updateAirport = async (
    id: string,
    airport: Partial<Airport>,
  ): Promise<Airport | null> => {
    const { data, error } = await supabase
      .from('airports')
      .update(airport)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error updating airport:', error)
      return null
    }

    return data as Airport
  }

  // Delete an airport
  const deleteAirport = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('airports').delete().eq('id', id)

    if (error) {
      console.error('Error deleting airport:', error)
      return false
    }

    return true
  }

  return {
    getAirports,
    getAirportById,
    createAirport,
    updateAirport,
    deleteAirport,
  }
}
