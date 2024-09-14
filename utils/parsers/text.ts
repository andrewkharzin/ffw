export function parseFFM(rawMessage: string) {
  const result = {
    totalPieces: 0,
    totalWeight: 0,
    totalVolume: 0,
    totalUlds: 0, // Added for counting ULDs
    ulds: [] as Array<any>,
  }

  const uldRegex = /ULD\/([A-Z0-9]+)/g
  const awbRegex = /(\d{3}-\d{8})([A-Z]{3})([A-Z]{3})\/S(\d+)K(\d+(\.\d+)?)/g

  let currentUld = null

  rawMessage.split('\n').forEach((line) => {
    const uldMatch = uldRegex.exec(line)
    if (uldMatch) {
      // New ULD detected, reset for this ULD
      currentUld = {
        uld: uldMatch[1],
        awbs: [],
      }
      result.ulds.push(currentUld)
    }

    const awbMatch = awbRegex.exec(line)
    if (awbMatch && currentUld) {
      const awb = {
        number: awbMatch[1],
        origin: awbMatch[2],
        destination: awbMatch[3],
        pieces: parseInt(awbMatch[4], 10),
        weight: parseFloat(awbMatch[5]),
      }

      currentUld.awbs.push(awb)

      // Update totals
      result.totalPieces += awb.pieces
      result.totalWeight += awb.weight
    }
  })

  // Calculate total ULDs
  result.totalUlds = result.ulds.length

  return result
}
