import Papa from "papaparse"

export function exportToCSV(data: any[], filename: string) {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, filename)
}

export function exportToJSON(data: any[], filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" })
  downloadBlob(blob, filename)
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
