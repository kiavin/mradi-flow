<script setup>
import { ref } from 'vue'
import SearchInput from '../../molecules/SearchInput.vue'
import PageDropDownSelect from '../../molecules/PageDropDownSelect.vue'
import BaseButton from '../../atoms/button/BaseButton.vue'
import { onClickOutside } from '@vueuse/core'

// pdf and excel
import { utils as XLSXUtils, writeFile as XLSXWriteFile } from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const emit = defineEmits([
  'search',
  'update:modelValue',
  'update:perPage',
  'changePage',
  'create',
  'refresh',
])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ data: [], paginationData: {} }),
  },
  toolbar: {
    type: Object,
    default: () => ({
      show: false,
      showCreateButton: false,
      showExportButton: false,
    }),
  },
  showCreateButton: { type: Boolean, default: false },
  showRefreshButton: { type: Boolean, default: true },
  showShowAllToggle: { type: Boolean, default: false },
  showExportButton: { type: Boolean, default: false },
})

const searchQuery = ref('')
const showAll = ref(false)
const previousPerPage = ref(null)
const showExportPanel = ref(false)
const exportButtonRef = ref(null)
const exportPanelRef = ref(null)

// Close panel when clicking outside
onClickOutside(exportPanelRef, (event) => {
  if (!exportButtonRef.value.contains(event.target)) {
    showExportPanel.value = false
  }
})

const handlePerPageChange = (newPerPage) => {
  emit('update:perPage', newPerPage)
  emit('changePage', 1)
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const onToggleShowAll = () => {
  if (showAll.value) {
    // Restore previous pagination (default 20)
    handlePerPageChange(previousPerPage.value || 20)
    showAll.value = false
  } else {
    // Store current setting
    previousPerPage.value = props.data?.paginationData?.perPage || 20

    // Set to show all (using large number or special value)
    handlePerPageChange(10000)
    showAll.value = true
  }
}

const onCreate = () => emit('create')
const onRefresh = () => emit('refresh')

const toggleExportPanel = () => {
  showExportPanel.value = !showExportPanel.value
}

const exportData = (type) => {
  showExportPanel.value = false
  const dataToExport = props.data.data || []

  switch (type) {
    case 'csv':
      exportToCSV(dataToExport)
      break
    case 'excel':
      exportToExcel(dataToExport)
      break
    case 'pdf':
      exportToPDF(dataToExport)
      break
    case 'text':
      exportToText(dataToExport)
      break
    case 'html':
      exportToHTML(dataToExport)
      break
    case 'json':
      exportToJSON(dataToExport)
      break
  }
}

const exportToCSV = (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }
  const headers = Object.keys(data[0] || {})
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) =>
          typeof row[header] === 'string' ? `"${row[header].replace(/"/g, '""')}"` : row[header],
        )
        .join(','),
    ),
  ].join('\n')

  downloadFile(csvContent, 'text/csv', 'export.csv')
}

const exportToExcel = (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }
  try {
    const worksheet = XLSXUtils.json_to_sheet(data)
    const workbook = XLSXUtils.book_new()
    XLSXUtils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSXWriteFile(workbook, 'export.xlsx', { compression: true })
  } catch (error) {
    console.error('Excel export error:', error)
    downloadFile(JSON.stringify(data), 'application/vnd.ms-excel', 'export.xls')
  }
}

const exportToPDF = async (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  try {
    // Dynamically import required libraries
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    // Create PDF document with landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      hotfixes: ['px_scaling'], // Fix for pixel scaling issues
    })

    // Add title
    doc.setFontSize(16)
    doc.setTextColor(40)
    doc.setFont('helvetica', 'bold')
    doc.text('Exported Data', doc.internal.pageSize.getWidth() / 2, 15, {
      align: 'center',
    })

    // Prepare table data
    const headers = Object.keys(data[0] || {})
    const body = data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value)
      }),
    )

    // Generate the table
    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 25,
      margin: {
        top: 20,
        left: 10,
        right: 10,
        bottom: 20,
      },
      tableWidth: 'wrap',
      showHead: 'everyPage',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        lineColor: [220, 220, 220],
        lineWidth: 0.3,
        textColor: [20, 20, 20],
      },
      headStyles: {
        fillColor: [51, 102, 153], // Darker blue header
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        lineWidth: 0.5,
        lineColor: [255, 255, 255],
      },
      bodyStyles: {
        lineWidth: 0.3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        // Apply to all columns
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
      },
      didParseCell: (data) => {
        // Right-align numeric columns
        if (!isNaN(data.cell.raw)) {
          data.cell.styles.halign = 'right'
        }
      },
      didDrawPage: (data) => {
        // Footer with page numbers
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' },
        )
      },
      // Enable horizontal overflow handling
      horizontalPageBreak: true,
      horizontalPageBreakRepeat: 0, // Repeat header column on horizontal break
    })

    // Save the PDF
    doc.save('export.pdf')
  } catch (error) {
    console.error('PDF export failed:', error)
  }
}

const exportToText = (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }
  const textContent = data
    .map((row) =>
      Object.entries(row)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\t'),
    )
    .join('\n')
  downloadFile(textContent, 'text/plain', 'export.txt')
}

const exportToHTML = (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }
  const headers = Object.keys(data[0] || {})
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Exported Data</title>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${data
            .map((row) => `<tr>${headers.map((h) => `<td>${row[h]}</td>`).join('')}</tr>`)
            .join('')}
        </tbody>
      </table>
    </body>
    </html>
  `
  downloadFile(htmlContent, 'text/html', 'export.html')
}

const exportToJSON = (data) => {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }
  downloadFile(JSON.stringify(data, null, 2), 'application/json', 'export.json')
}

const downloadFile = (content, mimeType, fileName) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="d-flex flex-column mb-4 w-100">
    <!-- Toolbar -->
    <div v-if="toolbar.show" class="d-flex justify-content-between align-items-center mb-2">
      <!-- Left Section -->
      <div class="d-flex align-items-center">
        <template v-if="toolbar.showCreateButton">
          <slot name="left-buttons"></slot>
        </template>
      </div>

      <!-- Right Section -->
      <div class="d-flex align-items-center position-relative">
        <!-- Create/Refresh Buttons Group -->
        <div class="d-flex flex-row border rounded border-secondary mx-2">
          <BaseButton
            v-if="showCreateButton"
            @click="onCreate"
            class="btn btn-success btn-sm"
            title="Create"
          >
            <template #icon>
              <font-awesome-icon :icon="['fas', 'plus']" class="icon-cs" />
            </template>
          </BaseButton>

          <BaseButton
            v-if="showRefreshButton"
            @click="onRefresh"
            class="btn btn-light btn-sm"
            title="Refresh"
          >
            <template #icon>
              <font-awesome-icon :icon="['fas', 'arrow-rotate-right']" class="icon-cs" />
            </template>
          </BaseButton>
        </div>

        <!-- Show All Toggle -->
        <BaseButton
          v-if="showShowAllToggle"
          @click="onToggleShowAll"
          class="btn btn-light btn-sm me-2"
          :title="showAll ? 'Show Paginated' : 'Show All'"
          :class="{ active: showAll }"
        >
          <template #icon>
            <font-awesome-icon :icon="['fas', showAll ? 'compress' : 'expand']" class="icon-cs" />
          </template>
        </BaseButton>

        <!-- Export Button and Panel -->
        <div class="position-relative">
          <BaseButton
            v-if="showExportButton"
            ref="exportButtonRef"
            @click="toggleExportPanel"
            class="btn btn-light btn-sm"
            title="Export"
            :class="{ active: showExportPanel }"
          >
            <template #icon>
              <font-awesome-icon :icon="['fas', 'up-right-from-square']" class="icon-cs" />
            </template>
          </BaseButton>

          <!-- Export Panel -->
          <div v-if="showExportPanel" ref="exportPanelRef" class="export-panel shadow-sm">
            <div class="export-title">Export Page Data</div>
            <button class="export-option" @click="exportData('csv')">
              <font-awesome-icon :icon="['fas', 'file-csv']" class="me-2" style="color: #73aafc" />
              CSV
            </button>
            <button class="export-option" @click="exportData('excel')">
              <font-awesome-icon
                :icon="['fas', 'file-excel']"
                class="me-2"
                style="color: #198754"
              />
              Excel
            </button>
            <button class="export-option" @click="exportData('pdf')">
              <font-awesome-icon :icon="['fas', 'file-pdf']" class="me-2" style="color: #e36572" />
              PDF
            </button>
            <button class="export-option" @click="exportData('text')">
              <font-awesome-icon
                :icon="['fas', 'file-lines']"
                class="me-2"
                style="color: #a9abae"
              />
              Text
            </button>
            <button class="export-option" @click="exportData('html')">
              <font-awesome-icon :icon="['fas', 'file-code']" class="me-2" style="color: #cef1f9" />
              HTML
            </button>
            <button class="export-option" @click="exportData('json')">
              <font-awesome-icon :icon="['fas', 'file-code']" class="me-2" style="color: #ffc107" />
              JSON
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Page Dropdown -->
    <div class="d-flex align-items-center justify-content-between">
      <PageDropDownSelect
        :modelValue="props.data?.paginationData?.perPage"
        @update:modelValue="handlePerPageChange"
      />
      <SearchInput v-model="searchQuery" @search="handleSearch" type="text" class="border p-0" />
    </div>
  </div>
</template>

<style scoped>
/* Your existing styles plus: */

.btn-light.active {
  background-color: #e2e6ea;
  border-color: #dae0e5;
}

/* Improved button group styling */
.d-flex.border {
  border-color: #dee2e6 !important;
  border-radius: 0.375rem;
  overflow: hidden;
}

.btn-success {
  border-radius: 0.375rem 0 0 0.375rem !important;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-light {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}

/* Export Panel Styles */
.export-panel {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1000;
  min-width: 180px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.export-title {
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.export-option {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: #212529;
  cursor: pointer;
}

.export-option:hover {
  background-color: #f8f9fa;
}

.position-relative {
  position: relative;
}
</style>
