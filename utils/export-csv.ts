import { fDate } from "./format-time"

interface ExportCSVOptions {
  skipped_key?: string | string[]
  keys?: string[]
}

export const exportToCSV = (
  data: Record<string, unknown>[],
  filename = "export.csv",
  options: ExportCSVOptions = {}
): void => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("exportToCSV: Data is empty or not an array")
    return
  }

  const { skipped_key = [], keys: customKeys } = options

  // Normalize skipped_key to an array
  const skipList = Array.isArray(skipped_key)
    ? skipped_key
    : skipped_key
      ? [skipped_key]
      : []

  const firstItem = data[0] || {}
  let keys = customKeys || Object.keys(firstItem)

  // Filter out skipped keys
  keys = keys.filter((key) => !skipList.includes(key))

  // Generate headers: "job_title" -> "Job Title"
  const headers = keys.map((key) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )

  const formatValue = (key: string, val: unknown): string => {
    if (val === null || val === undefined) {
      return ""
    }

    let resolvedVal = val

    // Convert date fields using fDate
    if (key === "created_at" || key === "date_posted" || key === "date") {
      try {
        const formatted = fDate(val as string | number | Date)
        if (formatted) {
          resolvedVal = formatted
        }
      } catch {
        // Fallback to original value
      }
    }

    let strVal = typeof resolvedVal === "object" ? JSON.stringify(resolvedVal) : String(resolvedVal)

    // Replace any internal double quotes with doubled double quotes
    strVal = strVal.replace(/"/g, '""')

    // Wrap the cell in double quotes if it contains commas, quotes, or newlines
    if (
      strVal.includes(",") ||
      strVal.includes('"') ||
      strVal.includes("\n") ||
      strVal.includes("\r")
    ) {
      return `"${strVal}"`
    }
    return strVal
  }

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      keys.map((key) => formatValue(key, row[key])).join(",")
    ),
  ]

  const csvContent = csvRows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()

  URL.revokeObjectURL(url)
}
