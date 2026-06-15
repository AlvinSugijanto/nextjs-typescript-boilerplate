"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type FilterValue = string | number | boolean;
export type NullableFilterValue = FilterValue | null | undefined;

export interface SortableFilters {
  sortBy?: string;
  sortOrder?: "asc" | "desc" | string;
}

interface UseFiltersOptions<T extends Record<string, NullableFilterValue>> {
  initialFilters?: T;
  resetPage?: () => void;
  paramMapping?: { [K in keyof T]?: string };
}

export function useFilters<T extends Record<string, NullableFilterValue> & SortableFilters>({
  initialFilters = {} as T,
  resetPage,
  paramMapping = {},
}: UseFiltersOptions<T> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params, fallback to defaults
  const [filters, setFiltersState] = useState<T>(() => {
    const state = { ...initialFilters };
    for (const key of Object.keys(initialFilters) as (keyof T)[]) {
      const urlValue = searchParams?.get(key as string);
      if (urlValue !== null) {
        const defaultValue = initialFilters[key];
        if (typeof defaultValue === "boolean") {
          state[key] = (urlValue === "true") as T[keyof T];
        } else if (typeof defaultValue === "number") {
          state[key] = Number(urlValue) as T[keyof T];
        } else {
          state[key] = urlValue as T[keyof T];
        }
      }
    }
    return state;
  });

  const syncToUrl = useCallback(
    (updates: Record<string, NullableFilterValue>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const setFilter = useCallback(
    (key: keyof T, value: NullableFilterValue) => {
      setFiltersState((prev) => ({ ...prev, [key]: value }));
      resetPage?.();
      syncToUrl({ [key as string]: value, page: 0 });
    },
    [resetPage, syncToUrl]
  );

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      setFiltersState((prev) => ({ ...prev, ...updates }));
      resetPage?.();
      syncToUrl({ ...updates, page: 0 });
    },
    [resetPage, syncToUrl]
  );

  const handleSort = useCallback(
    (key: string) => {
      const currentSortBy = filters.sortBy;
      const currentSortOrder = filters.sortOrder;
      const newDirection: "asc" | "desc" =
        currentSortBy === key && currentSortOrder === "asc" ? "desc" : "asc";
      const updates = { sortBy: key, sortOrder: newDirection } as Partial<T>;
      setFiltersState((prev) => ({ ...prev, ...updates }));
      resetPage?.();
      syncToUrl({ sortBy: key, sortOrder: newDirection, page: 0 });
    },
    [filters, resetPage, syncToUrl]
  );

  const paramMappingRef = useRef(paramMapping);
  useEffect(() => {
    paramMappingRef.current = paramMapping;
  }, [paramMapping]);

  const getQueryParams = useCallback(
    (additionalParams: Record<string, unknown> = {}): URLSearchParams => {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "" && val !== "all") {
          const paramKey = paramMappingRef.current[key as keyof T] ?? key;
          params.append(paramKey, String(val));
        }
      });

      Object.entries(additionalParams).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          params.set(key, String(val));
        }
      });

      return params;
    },
    [filters]
  );

  return { filters, setFilter, setFilters, handleSort, getQueryParams };
}

