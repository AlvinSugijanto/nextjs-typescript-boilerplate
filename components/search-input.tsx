"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Filter...",
  className,
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value ?? "")
  const debouncedValue = useDebounce(localValue, 500)

  const isFirstRender = useRef(true)
  // Sync keluar ke parent (debounced)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange?.(debouncedValue)
  }, [debouncedValue])

  // Sync masuk dari parent (misal reset filter)
  // useEffect(() => {
  //   if (value !== undefined && value !== localValue) {
  //     setLocalValue(value)
  //   }
  // }, [value])

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setLocalValue(e.target.value)}
        className={cn("pl-10", className)}
        {...props}
      />
    </div>
  )
}
