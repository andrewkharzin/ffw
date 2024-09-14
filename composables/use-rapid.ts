import { ref } from 'vue'

export function useRapid() {
  const flightsData = ref<{ arrivals: any[]; departures: any[] }>({
    arrivals: [],
    departures: [],
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pageTotal = ref(0)

  const fetchFlights = async (iataCode: string) => {
    console.log('Fetching flights for IATA code:', iataCode)

    // Construct URL based on the provided IATA code
    const url = `https://api.magicapi.dev/api/v1/aedbx/aerodatabox/flights/airports/Iata/${iataCode}?offsetMinutes=-120&durationMinutes=720&direction=Both&withLeg=false&withCancelled=true&withCodeshared=true&withCargo=true&withPrivate=true&withLocation=false`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-magicapi-key': 'cm0793wkr0009jz03atsf6hld', // Replace with your actual MagicAPI key
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
      console.log('API response text:', text)

      try {
        const result = JSON.parse(text)
        console.log('API response JSON:', result)

        // Assuming the result has both arrivals and departures
        flightsData.value.arrivals = result.arrivals || []
        flightsData.value.departures = result.departures || []

        // Update the total number of flights
        pageTotal.value =
          flightsData.value.arrivals.length +
          flightsData.value.departures.length

        console.log('Flights data (arrivals):', flightsData.value.arrivals)
        console.log('Flights data (departures):', flightsData.value.departures)
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
  // New method to fetch flight information by flight number
  const fetchFlightInfoByNumber = async (flightNumber: string) => {
    console.log('Fetching flight info for flight number:', flightNumber)

    const url = `https://flightera-flight-data.p.rapidapi.com/flight/info?flnr=${flightNumber}`

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '7d1a941f06msh29874c6d06f5f6ep12d1d0jsn2fae8bf64af4', // Replace with your actual RapidAPI key
        'x-rapidapi-host': 'flightera-flight-data.p.rapidapi.com',
      },
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.text()
      console.log('Flight info response:', result)

      // Parse and handle flight information as needed
      // Note: Handle any JSON parsing if necessary
    } catch (err) {
      console.error('Error fetching flight info:', err)
      error.value =
        'Failed to fetch flight information. Please try again later.'
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
    fetchFlightInfoByNumber, // Export the new method
  }
}
