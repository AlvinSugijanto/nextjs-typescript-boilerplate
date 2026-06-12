"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import CustomModal from "@/components/custom-modal"
import FormProvider, { RHFInput } from "@/components/hook-form"
import { useApi } from "@/hooks/use-api"

const formSchema = z.object({
  keyword: z.string().min(1, "Keyword is required"),
})

type FormValues = z.infer<typeof formSchema>

interface BannedKeyword {
  id: string | number
  keyword: string
}

interface AddKeywordModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedItem: BannedKeyword | null
  refetch: () => void
}

export default function AddKeywordModal({
  open,
  setOpen,
  selectedItem,
  refetch,
}: AddKeywordModalProps) {
  const { call } = useApi()

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { keyword: "" },
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods

  // Pre-fill form when editing
  useEffect(() => {
    if (selectedItem) {
      reset({ keyword: selectedItem.keyword })
    } else {
      reset({ keyword: "" })
    }
  }, [selectedItem, reset])

  const onSubmit = async (values: FormValues) => {
    try {
      const isEdit = !!selectedItem
      const url = isEdit
        ? `/api/v1/banned-keywords/${selectedItem!.id}`
        : `/api/v1/banned-keywords/`
      const method = isEdit ? "PATCH" : "POST"

      await call(url, method, values)
      toast.success(
        isEdit
          ? "Keyword Successfully Updated!"
          : "Keyword Successfully Created!"
      )
      setOpen(false)
      reset()
      refetch()
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <CustomModal
      title={selectedItem ? "Edit Keyword" : "Create Keyword"}
      open={open}
      setOpen={setOpen}
      className="sm:max-w-2xl"
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="flex-1 space-y-8 overflow-y-auto px-5 pt-2 pb-8">
          <RHFInput
            name="keyword"
            label="Keyword / Phrase"
            placeholder="Enter keyword or phrase"
          />
        </div>

        <div className="flex justify-end px-5 py-3">
          <Button type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting ? "Saving..." : "Submit"}
          </Button>
        </div>
      </FormProvider>
    </CustomModal>
  )
}
