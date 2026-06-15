export function getColor(color?: string | null): string {
  const value = color?.toLowerCase()
  if (!value) return ""

  if (value === "hired") return "success"
  return ""
}
