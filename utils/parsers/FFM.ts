export function parseFFM(rawMessage: string) {
  const result = {
    flightNumber: '',
    flightDate: '',
    departure: '',
    arrival: '',
    ulds: [] as Array<any>,
  }

  const validTypes = [
    'AKC',
    'AKH',
    'AKN',
    'AKP',
    'AKE',
    'AKW',
    'ALF',
    'ALP',
    'AMJ',
    'FQA',
    'AMX',
    'APE',
    'APA',
    'APB',
    'APC',
    'APD',
    'AQF',
    'AQP',
    'RKN',
    'RAP',
    'RA3',
    'PAG',
    'PAJ',
    'PMC',
    'P6P',
    'P1P',
    'PGA',
    'PGP',
    'P1A',
    'P6E',
    'PQP',
    'DQF',
    'HML',
    'HMJ',
    'VAA',
    'VDA',
    'VRA',
    'VSA',
    'IG1',
    'IG2',
    'IG3',
    'IG4',
    'IG5',
    'IG6',
    'IG7',
    'IG8',
    'IG9',
    'IGA',
    'IGB',
    'IGC',
    'IGD',
    'IGE',
    'IGF',
    'IGG',
    'IGH',
    'IGI',
    'IGJ',
    'IGK',
  ]

  const headerRegex =
    /FFM\/\d+\s+\d+\/([A-Z0-9]+)\/(\d+[A-Z]+)\/([A-Z]{3})\s+([A-Z]{3})/
  const uldRegex = /ULD\/([A-Z0-9]+)/

  // Updated AWB regex to include Nature of Goods and multiple SHC codes
  const awbRegex =
    /(\d{3}-\d{8})([A-Z]{3})([A-Z]{3})\/[SDTP](\d+)K(\d+(\.\d+)?)(?:MC(\d+(\.\d+)?))?\/([^\/]+)?(?:\/([A-Z]{3}(?:\/[A-Z]{3})*))?/

  const lines = rawMessage.split('\n')
  let currentUld: any = null

  function parseULD(uldString: string) {
    const uldType = uldString.slice(0, 3).toUpperCase()
    const uldNumber = uldString.slice(3, -2)
    const owner = uldString.slice(-2).toUpperCase()

    if (!validTypes.includes(uldType)) {
      throw new Error(`Invalid ULD type: ${uldType}`)
    }

    if (!/^\d+$/.test(uldNumber)) {
      throw new TypeError(`Invalid ULD number: ${uldNumber}`)
    }

    if (!/^[A-Z0-9]{2}$/.test(owner)) {
      throw new Error(`Invalid ULD owner: ${owner}`)
    }

    return { uldType, uldNumber, owner }
  }

  lines.forEach((line) => {
    const headerMatch = headerRegex.exec(line)
    if (headerMatch) {
      result.flightNumber = headerMatch[1]
      result.flightDate = headerMatch[2]
      result.departure = headerMatch[3]
      result.arrival = headerMatch[4]
    }

    const uldMatch = uldRegex.exec(line)
    if (uldMatch) {
      try {
        const parsedULD = parseULD(uldMatch[1])
        currentUld = {
          uld: `${parsedULD.uldType}${parsedULD.uldNumber}${parsedULD.owner}`,
          uldType: parsedULD.uldType,
          uldNumber: parsedULD.uldNumber,
          owner: parsedULD.owner,
          awbs: [],
        }
        result.ulds.push(currentUld)
      } catch (error) {
        console.error(`ULD Parsing Error: ${error.message}`)
      }
    }

    const awbMatch = awbRegex.exec(line)
    if (awbMatch && currentUld) {
      const awb = {
        number: awbMatch[1],
        origin: awbMatch[2],
        destination: awbMatch[3],
        pieces: parseInt(awbMatch[4], 10),
        weight: parseFloat(awbMatch[5]),
        cubicMeter: awbMatch[7] ? parseFloat(awbMatch[7]) : null,
        natureOfGoods: awbMatch[8]?.trim() || '',
        specialHandling: awbMatch[9] ? awbMatch[9].split('/') : [],
      }
      currentUld.awbs.push(awb)
    }
  })

  return result
}
