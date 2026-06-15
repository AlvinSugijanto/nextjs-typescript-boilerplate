"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Search, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MultiSelect } from "@/components/ui/multi-select"
import { SelectItem } from "@/components/ui/select"
import CustomModal from "@/components/custom-modal"
import FormProvider, { RHFInput, RHFSelect } from "@/components/hook-form"
import { useScrapingProgress, ScrapingProgress } from "./scraping-progress"
import { useApi } from "@/hooks/use-api"
import {
  JOB_CONTRACT,
  JOB_TYPE,
  POSTED_WITHIN_TYPES,
  JOB_PORTALS,
} from "@/data/enums"
import { PaginatedResponse, Session, SingleItemResponse } from "@/types"

const formSchema = z.object({
  keywords: z.string().min(1, "Keywords is required"),
  session_name: z.string().min(1, "Session Name is required"),
  location: z.string().optional(),
  job_contract: z.string().optional(),
  job_type: z.string().optional(),
  easy_apply: z.boolean().optional(),
  results_wanted: z.coerce.number().min(1).max(100).default(25),
  hours_old: z.string().optional(),
  job_portals: z.array(z.string()),
})

type FormValues = z.infer<typeof formSchema>

interface SearchJobsDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  refetch?: () => void
}

export function SearchJobsDialog({
  open,
  setOpen,
  refetch,
}: SearchJobsDialogProps) {
  const scraping = useScrapingProgress()
  const { call } = useApi<SingleItemResponse<Session>>()
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
      session_name: "",
      location: "",
      job_contract: "",
      job_type: "",
      easy_apply: false,
      results_wanted: 25,
      hours_old: "",
      job_portals: JOB_PORTALS.map((p) => p.value as string),
    },
  })

  const { handleSubmit, setValue, reset } = methods

  const prevOpen = React.useRef(open)

  // Reset form and scraping state when dialog closes
  useEffect(() => {
    if (!open && prevOpen.current) {
      if (scraping.status === "completed") {
        refetch?.()
      }
      scraping.reset()
      reset()
    }
    prevOpen.current = open
  }, [open, refetch, reset, scraping.status, scraping.reset])

  // Auto-close dialog after scraping is completed
  useEffect(() => {
    if (scraping.status === "completed") {
      const timer = setTimeout(() => setOpen(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [scraping.status, setOpen])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsCreatingSession(true)
      const sessionPayload = {
        name: data.session_name,
        status: "running",
        start_run_time: new Date().toISOString(),
        total_jobs: 0,
      }

      const sessionResp = await call("/api/v1/sessions", "POST", sessionPayload)

      if (!sessionResp) {
        throw new Error("Failed to create session")
      }

      const params = {
        keywords: data.keywords,
        location: data.location || undefined,
        job_contract: data.job_contract || undefined,
        job_type: data.job_type || undefined,
        easy_apply: data.easy_apply,
        results_wanted: Number(data.results_wanted) || 25,
        hours_old:
          data.hours_old && data.hours_old !== "all"
            ? parseInt(data.hours_old, 10)
            : undefined,
        job_portals: data.job_portals,
        session_id: sessionResp?.data?.id,
      }
      scraping.startScraping(params)
    } catch (error) {
      console.error("Error creating session or starting scrape:", error)
      const err = error as {
        response?: { data?: { detail?: string } }
        message?: string
      }
      toast.error(
        err.response?.data?.detail || err.message || "Failed to search jobs"
      )
    } finally {
      setIsCreatingSession(false)
    }
  }

  const handleClose = (isOpen: boolean) => {
    if (scraping.isActive) {
      // Don't close if scraping is active
      return
    }
    setOpen(isOpen)
  }

  const handleCancel = () => {
    scraping.cancel()
    toast.info("Search cancelled")
  }

  return (
    <CustomModal
      open={open}
      setOpen={handleClose}
      title="Search LinkedIn Jobs"
      className="sm:max-w-5xl"
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 pt-2 pb-8">
          <RHFInput
            name="session_name"
            label="Session Name *"
            placeholder="e.g. Software Engineer Search Q2"
            disabled={scraping.isActive}
          />

          <RHFInput
            name="keywords"
            label="Keywords *"
            placeholder="e.g. Python Developer"
            disabled={scraping.isActive}
          />

          <RHFInput
            name="location"
            label="Location"
            placeholder="e.g. Jakarta, Indonesia"
            disabled={scraping.isActive}
          />

          <div className="space-y-2">
            <Label>Job Portals</Label>
            <MultiSelect
              options={JOB_PORTALS as { value: string; label: string }[]}
              defaultValue={JOB_PORTALS.map((p) => p.value as string)}
              onValueChange={(values) => {
                if (values.length > 0) setValue("job_portals", values)
              }}
              placeholder="Select job portals..."
              disabled={scraping.isActive}
            />
          </div>

          <RHFSelect
            name="job_contract"
            label="Job Contract"
            placeholder="Select Job Contract"
            disabled={scraping.isActive}
            className="w-full"
          >
            {JOB_CONTRACT.map((type) => (
              <SelectItem key={type.value || ""} value={type.value || ""}>
                {type.label}
              </SelectItem>
            ))}
          </RHFSelect>

          <RHFSelect
            name="job_type"
            label="Job Type"
            placeholder="Select Job Type"
            disabled={scraping.isActive}
            className="w-full"
          >
            {JOB_TYPE.map((type) => (
              <SelectItem key={type.value || ""} value={type.value || ""}>
                {type.label}
              </SelectItem>
            ))}
          </RHFSelect>

          <div className="grid grid-cols-2 gap-4">
            <RHFInput
              name="results_wanted"
              label="Results Wanted"
              type="number"
              min="1"
              max="100"
              disabled={scraping.isActive}
            />

            <RHFSelect
              name="hours_old"
              label="Posted Within"
              placeholder="Select posted within"
              disabled={scraping.isActive}
              className="w-full"
            >
              {POSTED_WITHIN_TYPES.map((type) => (
                <SelectItem key={type.value || ""} value={type.value || ""}>
                  {type.label}
                </SelectItem>
              ))}
            </RHFSelect>
          </div>

          {/* Progress Display */}
          <ScrapingProgress
            status={scraping.status}
            message={scraping.message}
            progress={scraping.progress}
            activePortal={scraping.activePortal}
            portalProgress={scraping.portalProgress}
            countdown={scraping.countdown}
            result={scraping.result}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t bg-muted/10 px-6 py-4">
          {scraping.isActive ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                size="sm"
              >
                {scraping.status === "completed" ? "Close" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={scraping.status === "completed" || isCreatingSession}
                size="sm"
              >
                {isCreatingSession ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>
            </>
          )}
        </div>
      </FormProvider>
    </CustomModal>
  )
}
