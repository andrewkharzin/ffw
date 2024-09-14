interface FlightDetail {
  flightNumber: string
  startDate: string
  endDate: string
  timing: string
  aircraftType: string
  route: string
  utcTime: string
  serviceInfo: string
  flightType: 'Arrival' | 'Departure'
}

interface SCRMessage {
  seasonCode: string
  scheduleDate: string
  airportCode: string
  flights: FlightDetail[]
  supplementaryInfo: string
  generalInfo: string
}

export function parseSCRMessage(scr: string): SCRMessage {
  const lines = scr
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)

  if (lines.length < 3) {
    throw new Error('SCR message is incomplete or not formatted correctly.')
  }

  const seasonCode = lines[0] || ''
  const scheduleDate = lines[1] || ''
  const airportCode = lines[2] || ''

  const flightDetails: FlightDetail[] = []
  let supplementaryInfo = ''
  let generalInfo = ''

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('N')) {
      const flightParts = line.split(' ').filter((part) => part.trim())

      if (flightParts.length >= 6) {
        // Determine flight type based on the presence of space after "N"
        const flightType = line[1] === ' ' ? 'Departure' : 'Arrival'

        // Handle flight number and extract correct parts
        const flightNumber =
          flightType === 'Departure'
            ? flightParts[1]
            : flightParts[0].replace('N', '').trim()

        // Parse the remaining parts correctly based on flight type
        const [startDate, endDate] =
          flightType === 'Departure'
            ? [flightParts[2].slice(0, 5), flightParts[2].slice(5)]
            : [flightParts[1].slice(0, 5), flightParts[1].slice(5)]

        const timing = flightParts[flightType === 'Departure' ? 3 : 2]
        const aircraftType = flightParts[flightType === 'Departure' ? 4 : 3]

        // Extract route and UTC time
        let route: string
        let utcTime: string

        if (flightType === 'Arrival') {
          route = flightParts[4].slice(0, -4) // Everything except the last 4 characters
          utcTime = flightParts[4].slice(-4) // Last 4 characters (assumed to be UTC time)
        } else {
          utcTime = flightParts[5].slice(0, 4) // First 4 characters are UTC time
          route = flightParts[5].slice(4) // Everything after the first 4 characters (which are UTC time)
        }

        const serviceInfo = flightParts
          .slice(6)
          .join(' ')
          .replace('/', '')
          .trim()

        flightDetails.push({
          flightNumber,
          startDate,
          endDate,
          timing,
          aircraftType,
          route: route.trim(),
          utcTime: utcTime.trim(),
          serviceInfo,
          flightType,
        })
      }
    } else if (line.startsWith('SI')) {
      supplementaryInfo = line.replace('SI', '').trim()
    } else if (line.startsWith('GI')) {
      generalInfo = line.replace('GI', '').trim()
    }
  }

  return {
    seasonCode,
    scheduleDate,
    airportCode,
    flights: flightDetails,
    supplementaryInfo,
    generalInfo,
  }
}

// Example usage
const scrMessage = `
S24
30AUG
SVO
NVI7362 02SEP02SEP 1000000 000A4F DWCKRW0920 H / TA.B/
N VI7363 10SEP10SEP 0200000 000A4F 0005URCURC P / TD.C/

NVI608 02SEP02SEP 1000000 000IL7 URCULY2155 F / TA.B/
N VI207 03SEP03SEP 0200000 000IL7 0725URCURC P / TD.C/

NVI3150 02SEP02SEP 1000000 000IL7 DWCKRW1345 H / TA.B/
N VI2825 03SEP03SEP 0200000 000IL7 0545MMKMMK P / TD.B/
SI ОБСЛУЖИВАНИЕ – МОСКВА-КАРГО
GI BRGDS, VDA OPS
`

console.log(parseSCRMessage(scrMessage))
