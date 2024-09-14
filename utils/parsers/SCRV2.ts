interface FlightDetail {
  flightNumber: string;
  startDate: string;
  endDate: string;
  timing: string;
  aircraftType: string;
  route: string;
  utcTime: string;
  serviceInfo: string;
  flightType: 'Arrival' | 'Departure';
  actionCode: 'N' | 'C' | 'R' | 'H';
}

interface SCRMessage {
  seasonCode: string;
  scheduleDate: string;
  airportCode: string;
  flights: FlightDetail[];
  supplementaryInfo: string;
  generalInfo: string;
}

export function parseSCRMessagev2(scr: string): SCRMessage {
  const lines = scr
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);

  if (lines.length < 3) {
    throw new Error('SCR message is incomplete or not formatted correctly.');
  }

  const seasonCode = lines[0] || '';
  const scheduleDate = lines[1] || '';
  const airportCode = lines[2] || '';

  const flightDetails: FlightDetail[] = [];
  let supplementaryInfo = '';
  let generalInfo = '';

  const actionCodes = ['N', 'C', 'R', 'H']; // Supported action codes

  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    const actionCode = actionCodes.find((code) => line.startsWith(code));

    if (actionCode) {
      const flightParts = line.split(/\s+/).filter((part) => part);

      if (flightParts.length >= 7) {
        const flightNumber = flightParts[0].replace(actionCode, '').trim();
        const startDate = flightParts[1].substring(0, 5);
        const endDate = flightParts[1].substring(5);
        const timing = flightParts[2];
        const aircraftType = flightParts[3];
        const utcRoute = flightParts[4];
        const serviceInfo = flightParts.slice(5).join(' ').replace('/', '').trim();

        const utcTime = utcRoute.slice(0, 4);
        const route = utcRoute.slice(4);

        const flightType = route.startsWith('URC') ? 'Departure' : 'Arrival';

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
          actionCode: actionCode as 'N' | 'C' | 'R' | 'H',
        });
      }
    } else if (line.startsWith('SI')) {
      supplementaryInfo = line.replace('SI', '').trim();
    } else if (line.startsWith('GI')) {
      generalInfo = line.replace('GI', '').trim();
    }
  }

  return {
    seasonCode,
    scheduleDate,
    airportCode,
    flights: flightDetails,
    supplementaryInfo,
    generalInfo,
  };
}

// Example usage
const scrMessage = `
SCR
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

`;

console.log(parseSCRMessagev2(scrMessage));
