// ffmProcessor.ts

interface FFMMessage {
  header: string;
  ulds: ULD[];
  items: Item[];
}

interface ULD {
  code: string;
  items: Item[];
}

interface Item {
  description: string;
  quantity: number;
  weight: number;
  volume: number;
  specialHandling: string;
}

function ffmProcessor(message: string): FFMMessage {
  // Split the message into lines
  const lines = message.split('\n').filter(line => line.trim() !== '');

  // Initialize variables
  const header = lines.shift() || '';
  const ulds: ULD[] = [];
  let currentULD: ULD | null = null;

  // Process each line
  lines.forEach(line => {
    if (line.startsWith('ULD/')) {
      // New ULD
      if (currentULD) {
        ulds.push(currentULD);
      }
      currentULD = { code: line.substring(4), items: [] };
    } else if (currentULD) {
      // Process item
      const item = parseItem(line);
      if (item) {
        currentULD.items.push(item);
      }
    }
  });

  // Push the last ULD
  if (currentULD) {
    ulds.push(currentULD);
  }

  // Return the standardized FFM message
  return { header, ulds, items: ulds.flatMap(uld => uld.items) };
}

function parseItem(line: string): Item | null {
  // Example parsing logic, adapt as needed
  const match = line.match(/(\d+)-(\d+)([A-Z]{3})([A-Z]{3})(\S*)\/(.+)/);
  if (match) {
    const [, quantity, weight, code, specialHandling, , description] = match;
    return {
      description,
      quantity: parseInt(quantity, 10),
      weight: parseFloat(weight),
      volume: 0, // Default or calculate if needed
      specialHandling: specialHandling || '',
    };
  }
  return null;
}

// Example usage
const message = `FFM/8
1/AL8731/02SEP/MFM
SVO
ULD/PMC00005AL
601-44042165MFMKGF/T25K460.0MC0/DATA CABLE
/ELM
601-44041421MFMKGF/S62K429.0MC0T94/MEMORY CARD
ULD/PMC00008AL
601-44041314MFMKGF/S7K2610.0MC0T8/COMPUTER
ULD/PMC00015AL
601-44041340MFMKGF/S150K2695.0MC0T2919/MONITORS PARTS`;

const standardizedMessage = ffmProcessor(message);
console.log(standardizedMessage);
