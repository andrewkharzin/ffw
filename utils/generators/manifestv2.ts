import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

pdfMake.vfs = pdfFonts.pdfMake.vfs

// Function to generate table rows for ULDs and AWBs
export const generateFFMPdf = (ulds) => {
  if (!ulds || !Array.isArray(ulds)) {
    console.error('ULDS data is invalid or undefined');
    return [];
  }

  return ulds.flatMap((uld) => {
    if (!uld.awbs || !Array.isArray(uld.awbs)) {
      console.error('AWBS data is invalid or undefined for ULD:', uld);
      return [];
    }

    // Create an array of AWB details per ULD
    const awbsDetails = uld.awbs.map((awb) => [
      { text: awb.number || 'N/A', alignment: 'center' },
      { text: awb.origin || 'N/A', alignment: 'center' },
      { text: awb.destination || 'N/A', alignment: 'center' },
      { text: awb.pieces || 0, alignment: 'center' },
      { text: awb.weight || 0, alignment: 'center' },
    ]);

    // Return ULD info with AWB details, using rowSpan for ULD
    return [
      [
        {
          text: uld.uld || 'N/A',
          rowSpan: awbsDetails.length,
          alignment: 'center',
          margin: [0, 5, 0, 5],
        },
        ...awbsDetails[0], // First AWB details with the ULD rowSpan
      ],
      ...awbsDetails.slice(1).map((details) => [{}, ...details]), // Other AWBs with empty ULD cell
    ];
  });
}

// Function to create the table body for the PDF
const createTableBody = (ulds) => {
  // Table header
  const headerRow = [
    { text: 'ULD', style: 'tableHeader', alignment: 'center' },
    { text: 'AWB Number', style: 'tableHeader', alignment: 'center' },
    { text: 'Origin', style: 'tableHeader', alignment: 'center' },
    { text: 'Destination', style: 'tableHeader', alignment: 'center' },
    { text: 'Pieces', style: 'tableHeader', alignment: 'center' },
    { text: 'Weight (kg)', style: 'tableHeader', alignment: 'center' },
  ];

  // Combine header and body
  return [headerRow, ...generateFFMPdf(ulds)];
}

// Function to create the document definition for PDFMake
const createDocDefinition = (parsedFFM) => {
  if (!parsedFFM || !parsedFFM.ulds) {
    console.error('Parsed FFM data is invalid or undefined');
    return;
  }

  const tableBody = createTableBody(parsedFFM.ulds);

  return {
    content: [
      { text: 'FFM Cargo Manifest', style: 'header' },
      { text: `Flight Number: ${parsedFFM.flightNumber || 'N/A'}`, style: 'subheader' },
      { text: `Total Pieces: ${parsedFFM.totalPieces || 0}`, style: 'subheader' },
      { text: `Total ULDs: ${parsedFFM.totalUlds || 0}`, style: 'subheader' },
      { text: `Total Weight: ${parsedFFM.totalWeight || 0} kg`, style: 'subheader' },
      { text: `Total Volume: ${parsedFFM.totalVolume || 0} m³`, style: 'subheader' },

      // Table for ULDs and AWB details
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody,
        },
        layout: 'lightHorizontalLines', // Optional styling for table layout
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 10],
      },
      subheader: {
        fontSize: 12,
        margin: [0, 5, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
      },
    },
  };
}

// Generate PDF with parsed FFM data
const generatePDF = (parsedFFM) => {
  const docDefinition = createDocDefinition(parsedFFM);
  if (docDefinition) {
    pdfMake.createPdf(docDefinition).open();
  } else {
    console.error('Unable to generate PDF, document definition is invalid.');
  }
}

export { generatePDF }
