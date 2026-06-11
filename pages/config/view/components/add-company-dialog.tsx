"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/custom-modal";
import FormProvider, { RHFInput } from "@/components/hook-form";
import { useApi } from "@/hooks/use-api";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface BannedCompany {
  id: string | number;
  name: string;
}

interface AddCompanyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedItem: BannedCompany | null;
  refetch: () => void;
}

export default function AddCompanyModal({
  open,
  setOpen,
  selectedItem,
  refetch,
}: AddCompanyModalProps) {
  const { call } = useApi();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Pre-fill form when editing
  useEffect(() => {
    if (selectedItem) {
      reset({ name: selectedItem.name });
    } else {
      reset({ name: "" });
    }
  }, [selectedItem, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const isEdit = !!selectedItem;
      const url = isEdit
        ? `/api/v1/banned-companies/${selectedItem!.id}`
        : `/api/v1/banned-companies/`;
      const method = isEdit ? "PATCH" : "POST";

      await call(url, method, values);
      toast.success(
        isEdit ? "Company Successfully Updated!" : "Company Successfully Created!"
      );
      setOpen(false);
      reset();
      refetch();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <CustomModal
      title={selectedItem ? "Edit Company" : "Create Company"}
      open={open}
      setOpen={setOpen}
      className="max-w-3xl"
    >
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <RHFInput name="name" label="Company Name" placeholder="Enter company name" />
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting ? "Saving..." : "Submit"}
          </Button>
        </div>
      </FormProvider>
    </CustomModal>
  );
}
