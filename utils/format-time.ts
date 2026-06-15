import {
  format,
  getTime,
  formatDistanceToNow,
  parseISO,
  isValid,
  differenceInDays,
  startOfDay,
} from "date-fns"

// ----------------------------------------------------------------------

type DateInput = Date | string | number | null | undefined

export function fDate(date: DateInput, newFormat?: string): string {
  const fm = newFormat || "dd MMM yyyy"
  return date ? format(new Date(date), fm) : ""
}

export function fTime(date: DateInput, newFormat?: string): string {
  const fm = newFormat || "HH:mm"
  return date ? format(new Date(date), fm) : ""
}

export function fDateTime(date: DateInput, newFormat?: string): string {
  const fm = newFormat || "dd MMM yyyy HH:mm"
  return date ? format(new Date(date), fm) : ""
}

export function fYear(date: DateInput): string {
  return date ? format(new Date(date), "yyyy") : ""
}

/**
 * Convert a UTC+0 date/string to UTC+7 (WIB).
 * Returns a new Date object shifted by +7 hours.
 */
export function toUTC7(date: DateInput): Date | null {
  if (!date) return null
  const utc = new Date(date)
  return new Date(utc.getTime() + 7 * 60 * 60 * 1000)
}

export function fTimestamp(date: DateInput): number | string {
  return date ? getTime(new Date(date)) : ""
}

export function fToNow(date: DateInput): string {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : ""
}

export function isBetween(
  inputDate: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean {
  const date = new Date(inputDate)
  const results =
    new Date(date.toDateString()) >= new Date(new Date(startDate).toDateString()) &&
    new Date(date.toDateString()) <= new Date(new Date(endDate).toDateString())

  return results
}

export function isAfter(
  startDate: Date | string | number | null | undefined,
  endDate: Date | string | number | null | undefined
): boolean {
  const results =
    startDate && endDate
      ? new Date(startDate).getTime() > new Date(endDate).getTime()
      : false

  return results
}

export function dayName(dateString: string | number | Date): string {
  const daysOfWeek = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ]
  const date = new Date(dateString)
  const dayIndex = date.getDay()

  return daysOfWeek[dayIndex]
}

export function dateRemaining(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate

  if (!isValid(start) || !isValid(end)) {
    throw new Error(
      "Invalid date input. Use Date object or ISO string (YYYY-MM-DD)."
    )
  }

  // Normalize both dates to the start of their day (00:00)
  const startDay = startOfDay(start)
  const endDay = startOfDay(end)

  // Inclusive calculation (+1 means include both start and end date)
  return differenceInDays(endDay, startDay)
}
