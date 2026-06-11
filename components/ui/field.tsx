"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ── Field (container) ──────────────────────────────────────────────────────

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  "data-invalid"?: boolean;
}

export function Field({
  orientation = "vertical",
  className,
  ...props
}: FieldProps) {
  return (
    <div
      data-orientation={orientation}
      className={cn(
        "flex gap-1.5",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  );
}

// ── FieldLabel ─────────────────────────────────────────────────────────────

type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

// ── FieldDescription ───────────────────────────────────────────────────────

type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

// ── FieldError ─────────────────────────────────────────────────────────────

type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <p
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    />
  );
}
