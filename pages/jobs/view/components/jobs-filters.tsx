"use client"

import React, { useState } from "react"
import { Filter, ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { JOB_CONTRACT, JOB_PORTALS, JOB_TYPE } from "@/data/enums"

export interface Filters {
  [key: string]: string | number | boolean | null | undefined
  q: string
  location: string
  job_type: string
  job_contract: string
  job_portal: string
  sortBy?: string
  sortOrder?: string
  session_id?: string | number | null
}

interface JobsFiltersProps {
  filters: Filters
  onFiltersChange: (updates: Partial<Filters>) => void
}

export default function JobsFilters({
  filters,
  onFiltersChange,
}: JobsFiltersProps) {
  // Local state for filters within the popover
  const [localFilters, setLocalFilters] = useState<Filters>(filters)
  const [prevFilters, setPrevFilters] = useState<Filters>(filters)
  const [open, setOpen] = useState(false)

  // Adjust state when props change, avoiding useEffect
  if (filters !== prevFilters) {
    setPrevFilters(filters)
    setLocalFilters(filters)
  }

  const activeFiltersCount = [
    localFilters.q !== "",
    localFilters.job_type !== "all" && localFilters.job_type !== "",
    localFilters.job_contract !== "all" && localFilters.job_contract !== "",
    localFilters.location !== "",
    localFilters.job_portal !== "all" && localFilters.job_portal !== "",
  ].filter(Boolean).length

  const handleApply = () => {
    onFiltersChange({
      q: localFilters.q,
      location: localFilters.location,
      job_type: localFilters.job_type,
      job_contract: localFilters.job_contract,
      job_portal: localFilters.job_portal,
    })
    setOpen(false)
  }

  const handleReset = () => {
    const resetValues = {
      q: "",
      location: "",
      job_type: "all",
      job_contract: "all",
      job_portal: "all",
    }
    setLocalFilters((prev) => ({
      ...prev,
      ...resetValues,
    }))
    onFiltersChange(resetValues)
    setOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      // Re-sync local state when popover is opened
      setLocalFilters(filters)
    }
    setOpen(nextOpen)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="leading-none font-medium">Job Filters</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 px-2 text-muted-foreground"
              >
                Reset
              </Button>
            </div>

            <Separator />

            <div className="grid w-full gap-4">
              <div className="space-y-2">
                <Label htmlFor="search-filter">Keywords</Label>
                <Input
                  id="search-filter"
                  placeholder="e.g. Developer, Google"
                  value={localFilters.q}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, q: e.target.value }))
                  }
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-filter">Location</Label>
                <Input
                  id="location-filter"
                  placeholder="e.g. Jakarta, Indonesia"
                  value={localFilters.location}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-portal-filter">Job Portal</Label>
                <Select
                  value={localFilters.job_portal}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, job_portal: val }))
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select Job Portal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {JOB_PORTALS.map((portal) => (
                      <SelectItem
                        key={portal.value || ""}
                        value={portal.value || ""}
                      >
                        {portal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full space-y-2">
                <Label>Job Type</Label>
                <Select
                  value={localFilters.job_type}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, job_type: val }))
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {JOB_TYPE.map((type) => (
                      <SelectItem
                        key={type.value || ""}
                        value={type.value || ""}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full space-y-2">
                <Label>Contract Type</Label>
                <Select
                  value={localFilters.job_contract}
                  onValueChange={(val) =>
                    setLocalFilters((prev) => ({ ...prev, job_contract: val }))
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Select Contract Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contracts</SelectItem>
                    {JOB_CONTRACT.map((type) => (
                      <SelectItem
                        key={type.value || ""}
                        value={type.value || ""}
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="h-8" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
