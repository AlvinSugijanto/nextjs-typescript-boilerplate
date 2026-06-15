export const formatRupiah = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return ""
  const number = Number(value)
  if (isNaN(number)) return String(value)
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number)
}
