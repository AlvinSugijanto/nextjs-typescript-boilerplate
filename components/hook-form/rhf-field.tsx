"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

// ── RHFInput ──────────────────────────────────────────────────────────────────

interface RHFInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  inputClassName?: string;
}

export function RHFInput({
  name,
  label,
  description,
  className,
  inputClassName,
  disabled,
  ...other
}: RHFInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field data-invalid={!!error || undefined} className={className}>
          {label && <FieldLabel htmlFor={name} className="mb-1">{label}</FieldLabel>}
          <Input
            id={name}
            aria-invalid={!!error}
            disabled={disabled}
            className={inputClassName}
            {...field}
            {...other}
          />
          {description && !error && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
}

// ── RHFTextarea ───────────────────────────────────────────────────────────────

interface RHFTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string;
  label?: string;
  description?: string;
  className?: string;
}

export function RHFTextarea({
  name,
  label,
  description,
  className,
  disabled,
  ...other
}: RHFTextareaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field data-invalid={!!error || undefined} className={className}>
          {label && <FieldLabel htmlFor={name} className="mb-1">{label}</FieldLabel>}
          <Textarea
            id={name}
            aria-invalid={!!error}
            disabled={disabled}
            {...field}
            {...other}
          />
          {description && !error && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
}

// ── RHFSelect ─────────────────────────────────────────────────────────────────

interface RHFSelectProps {
  name: string;
  label?: string;
  description?: string;
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export function RHFSelect({
  name,
  label,
  description,
  children,
  placeholder,
  className,
  triggerClassName,
  disabled,
}: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field data-invalid={!!error || undefined} className={className}>
          {label && <FieldLabel className="mb-1">{label}</FieldLabel>}
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
            disabled={disabled}
          >
            <SelectTrigger aria-invalid={!!error} className={cn("w-full", triggerClassName)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
          {description && !error && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {error && <FieldError>{error.message}</FieldError>}
        </Field>
      )}
    />
  );
}

// ── RHFCheckbox ───────────────────────────────────────────────────────────────

interface RHFCheckboxProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function RHFCheckbox({
  name,
  label,
  description,
  className,
  disabled,
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field
          orientation="horizontal"
          data-invalid={!!error || undefined}
          className={cn("items-center gap-2", className)}
        >
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
          <div className="grid gap-1.5 leading-none">
            {label && (
              <FieldLabel htmlFor={name} className="font-normal cursor-pointer mb-1">
                {label}
              </FieldLabel>
            )}
            {description && !error && (
              <FieldDescription>{description}</FieldDescription>
            )}
            {error && <FieldError>{error.message}</FieldError>}
          </div>
        </Field>
      )}
    />
  );
}
