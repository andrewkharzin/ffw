interface AWB {
  awbNumber: string;
  origin: string;
  destination: string;
  pieces: number;
  weight: number;
  natureOfGoods: string;
  specialHandling: string;
}

interface ULD {
  uldNumber: string;
  awbs: AWB[];
}

interface FlightManifest {
  flightNumber: string;
  date: string;
  origin: string;
  destination: string;
  ulds: ULD[];
}

function parseFFM(ffm: string): FlightManifest {
  const lines = ffm.trim().split(/\n/);
  let flightManifest: FlightManifest = {
    flightNumber: '',
    date: '',
    origin: '',
    destination: '',
    ulds: []
  };

  let currentULD: ULD | null = null;

  lines.forEach(line => {
    const flightMatch = line.match(/(\d+)\/([A-Z]+\d{4})\/(\d+[A-Z]{3}\d{4})\/([A-Z]{3})\/([A-Z0-9]+)/);
    if (flightMatch) {
      // Parsing flight information
      flightManifest.flightNumber = flightMatch[2];
      flightManifest.date = flightMatch[3];
      flightManifest.origin = flightMatch[4];
      flightManifest.destination = flightMatch[5];
      return;
    }

    const uldMatch = line.match(/ULD\/([A-Z0-9]+)/);
    if (uldMatch) {
      // Parsing ULD information
      if (currentULD) {
        flightManifest.ulds.push(currentULD);
      }
      currentULD = {
        uldNumber: uldMatch[1],
        awbs: []
      };
      return;
    }

    const awbMatch = line.match(/(\d{3}-\d{8})([A-Z]{3})([A-Z]{3})\/([A-Z]?)(\d+)(K)(\d+)(MC\d+T?\d+)?\/([A-Z ]+)/);
    if (awbMatch && currentULD) {
      // Parsing AWB information
      currentULD.awbs.push({
        awbNumber: awbMatch[1],
        origin: awbMatch[2],
        destination: awbMatch[3],
        pieces: parseInt(awbMatch[5]),
        weight: parseInt(awbMatch[7]),
        natureOfGoods: awbMatch[9].trim(),
        specialHandling: awbMatch[9].includes('SPX') ? 'SPX' : ''
      });
    }
  });

  if (currentULD) {
    flightManifest.ulds.push(currentULD);
  }

  return flightManifest;
}

// Example usage
const ffmMessage = `FFM/8
1/HY3123/05SEP2200/TAS/UK67001
SVO
ULD/FQA0362HY
250-91841956HKGSVO/S2K808MC1T51/CABLE FAST LOCK
/SPX
ULD/FQA0372HY
250-91840781HKGSVO/S22K422MC1T158/CPU SOLID STATE
/SPX
...`; // truncated for brevity

const manifest = parseFFM(ffmMessage);
console.log(JSON.stringify(manifest, null, 2));
