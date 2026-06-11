import * as React from "react";
import { FormProvider as Form, UseFormReturn } from "react-hook-form";

interface FormProviderProps {
  children: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  methods: UseFormReturn<any>;
  className?: string;
}

export default function FormProvider({
  children,
  onSubmit,
  methods,
  className,
}: FormProviderProps) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </Form>
  );
}
