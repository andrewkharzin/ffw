import { ref } from 'vue'

export function useRapid() {
  const flightsData = ref<any[]>([]) // This will store the fetched flights data
  const loading = ref(false) // To handle loading state
  const error = ref<string | null>(null) // To handle any errors
  const pageTotal = ref(0) // To handle the total number of pages

  const fetchFlights = async (iataCode: string) => {
    console.log('Fetching flights for IATA code:', iataCode) // Log IATA code
    const url = `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${iataCode}?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '7d1a941f06msh29874c6d06f5f6ep12d1d0jsn2fae8bf64af4', // Replace with your actual RapidAPI key
        'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
      },
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const text = await response.text()
      console.log('API response text:', text) // Log the raw response text

      try {
        const result = JSON.parse(text)
        console.log('API response JSON:', result) // Log the parsed JSON
        if (result.departures) {
          flightsData.value = result.departures // Store departures data
          pageTotal.value = result.departures.length // Update the total number of pages
          console.log('Flights data:', flightsData.value) // Log the flights data
        } else {
          console.log('No departures data found in the API response.')
        }
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError)
        error.value = 'Failed to parse flight data. Please try again later.'
      }
    } catch (err) {
      console.error('Error fetching flights data:', err)
      error.value = 'Failed to fetch flight data. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  return {
    flightsData,
    loading,
    error,
    pageTotal,
    fetchFlights,
  }
}
