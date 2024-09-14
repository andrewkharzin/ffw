<template>
  <div>
    <!-- Your FFM Table -->
    <table>
      <thead>
        <tr>
          <th>ULD</th>
          <th>Pieces</th>
          <th>Weight (kg)</th>
          <th>AWBs</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(uld, index) in parsedFFM.uldList" :key="index">
          <td>{{ uld.uldType }}</td>
          <td>{{ uld.totalPieces }}</td>
          <td>{{ uld.totalWeight }}</td>
          <td>
            <ul>
              <li v-for="awb in uld.awbList" :key="awb.awbNumber">
                AWB {{ awb.awbNumber }}: {{ awb.origin }} -
                {{ awb.destination }}, {{ awb.pieces }} pcs, {{ awb.weight }} kg
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Button to trigger PDF generation -->
    <button @click="generatePDF">Generate PDF</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import jsPDF from 'jspdf'

// Assuming your `parseFFM` is imported and works to parse the raw FFM message
import { parseFFM } from '@/utils/parsers/FFM'

// Props
const props = defineProps<{
  ffmData: string // Raw FFM data to be parsed
}>()

// Store parsed FFM data in a ref
const parsedFFM = ref(parseFFM(props.ffmData))

// Function to generate PDF
function generatePDF() {
  const doc = new jsPDF()

  // Set some styles for the PDF
  doc.setFontSize(12)
  doc.setTextColor(40)

  // Add title
  doc.text('FFM Message Report', 10, 10)

  // Add total pieces, weight, etc.
  doc.text(`Total ULDs: ${parsedFFM.value.totalULDs}`, 10, 20)
  doc.text(`Total Pieces: ${parsedFFM.value.totalPieces}`, 10, 30)
  doc.text(`Total Weight: ${parsedFFM.value.totalWeight} kg`, 10, 40)

  // Add ULD details
  let yPosition = 60
  doc.text('ULD Details:', 10, yPosition)
  yPosition += 10

  parsedFFM.value.uldList.forEach((uld, index) => {
    doc.text(
      `ULD ${index + 1}: ${uld.uldType} - Pieces: ${uld.totalPieces}, Weight: ${
        uld.totalWeight
      } kg`,
      10,
      yPosition
    )
    yPosition += 10

    // Add AWB details within each ULD
    uld.awbList.forEach((awb) => {
      doc.text(
        `  AWB ${awb.awbNumber}: ${awb.origin}-${awb.destination}, Pieces: ${awb.pieces}, Weight: ${awb.weight} kg`,
        20,
        yPosition
      )
      yPosition += 10
    })
  })

  // Save the PDF
  doc.save('FFM_Report.pdf')
}
</script>
