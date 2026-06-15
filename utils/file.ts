
export function getFileTypeLabel(type?: string): string {
  if (!type) return "File"
  if (type.startsWith("image/")) return type.replace("image/", "").toUpperCase()
  if (type === "application/pdf") return "PDF"
  if (type.includes("word")) return "DOCX"
  if (type.includes("sheet") || type.includes("excel")) return "XLSX"
  if (type.includes("presentation") || type.includes("powerpoint"))
    return "PPTX"
  if (type.startsWith("text/")) return type.replace("text/", "").toUpperCase()
  return type.split("/").pop()?.toUpperCase() ?? "FILE"
}

export function getFileExtension(filename?: string): string {
  if (!filename) return ""
  const parts = filename.split(".")
  if (parts.length > 1) {
    return parts.pop()?.toUpperCase() ?? ""
  }
  return ""
}

export const getFileSize = (kb?: number | null): string => {
  if (!kb) return "-"

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  if (kb < 1024 * 1024) {
    return `${(kb / 1024).toFixed(1)} MB`
  }

  return `${(kb / (1024 * 1024)).toFixed(1)} GB`
}

export const getFileSizeFromBytes = (bytes?: number | null): string => {
  if (!bytes) return "-"

  if (bytes < 1024) {
    return `${bytes.toFixed(1)} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
