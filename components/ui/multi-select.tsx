"use client";

import * as React from "react";
import ReactSelect, { MultiValue, ActionMeta } from "react-select";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  isClearable?: boolean;
  closeMenuOnSelect?: boolean;
}

export function MultiSelect({
  options = [],
  value,
  onValueChange,
  defaultValue,
  placeholder = "Select options...",
  disabled = false,
  className,
  searchable = true,
  isClearable = false,
  closeMenuOnSelect = false,
}: MultiSelectProps) {
  // react-select expects { value, label } objects
  const toOption = (v: string): Option =>
    options.find((o) => o.value === v) ?? { value: v, label: v };

  // Controlled: convert string[] → option objects
  const selectedOptions = value !== undefined ? value.map(toOption) : undefined;
  const defaultOptions =
    defaultValue !== undefined ? defaultValue.map(toOption) : undefined;

  const handleChange = (
    selected: MultiValue<Option>,
    _actionMeta: ActionMeta<Option>
  ) => {
    const values = (selected ?? []).map((o) => o.value);
    onValueChange?.(values);
  };

  return (
    <ReactSelect<Option, true>
      isMulti
      options={options}
      value={selectedOptions}
      defaultValue={defaultOptions}
      onChange={handleChange}
      isDisabled={disabled}
      isSearchable={searchable}
      isClearable={isClearable}
      closeMenuOnSelect={closeMenuOnSelect}
      placeholder={placeholder}
      classNamePrefix="rs"
      unstyled
      className={cn("w-full text-sm", className)}
      classNames={{
        control: ({ isFocused, isDisabled }) =>
          cn(
            "flex min-h-9 w-full rounded-md border bg-transparent px-3 py-1 shadow-xs transition-colors",
            "border-input",
            isFocused && "ring-2 ring-ring border-ring outline-none",
            isDisabled && "cursor-not-allowed opacity-50"
          ),
        valueContainer: () => "flex flex-wrap gap-1 py-0.5",
        placeholder: () => "text-muted-foreground text-sm",
        input: () => "text-foreground text-sm",
        multiValue: () =>
          "flex items-center gap-1 rounded-md bg-primary/10 text-primary text-xs px-2 py-0.5",
        multiValueLabel: () => "text-xs font-medium",
        multiValueRemove: () =>
          "rounded-sm opacity-60 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-colors p-0.5",
        indicatorsContainer: () => "flex items-center gap-1 self-center",
        clearIndicator: () =>
          "text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0.5",
        dropdownIndicator: () =>
          "text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0.5",
        indicatorSeparator: () => "hidden",
        menu: () =>
          "mt-1 rounded-md border border-border bg-popover shadow-md overflow-hidden z-50",
        menuList: () => "max-h-60 overflow-auto py-1",
        option: ({ isFocused, isSelected }) =>
          cn(
            "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors",
            isFocused && !isSelected && "bg-accent text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground"
          ),
        noOptionsMessage: () =>
          "py-6 text-center text-sm text-muted-foreground",
        loadingMessage: () => "py-6 text-center text-sm text-muted-foreground",
      }}
    />
  );
}
