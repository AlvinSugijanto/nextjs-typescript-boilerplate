"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type FilterValue = string | number | boolean | null | undefined;

type FiltersState = Record<string, FilterValue>;

interface UseFiltersOptions<T extends FiltersState> {
  initialFilters?: T;
  resetPage?: () => void;
  paramMapping?: Partial<Record<keyof T, string>>;
}

export function useFilters<T extends FiltersState>({
  initialFilters = {} as T,
  resetPage,
  paramMapping = {},
}: UseFiltersOptions<T> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params, fallback to defaults
  const [filters, setFiltersState] = useState<T>(() => {
    const state = {} as T;
    for (const [key, defaultValue] of Object.entries(initialFilters)) {
      (state as FiltersState)[key] = searchParams.get(key) ?? defaultValue;
    }
    return state;
  });

  const syncToUrl = useCallback(
    (updates: FiltersState) => {
      const params = new URLSearchParams(searchParams.toString());
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
    (key: keyof T, value: FilterValue) => {
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
      syncToUrl({ ...(updates as FiltersState), page: 0 });
    },
    [resetPage, syncToUrl]
  );

  const handleSort = useCallback(
    (key: string) => {
      const currentSortBy = (filters as FiltersState).sortBy;
      const currentSortOrder = (filters as FiltersState).sortOrder;
      const newDirection =
        currentSortBy === key && currentSortOrder === "asc" ? "desc" : "asc";
      const updates = { sortBy: key, sortOrder: newDirection };
      setFiltersState((prev) => ({ ...prev, ...updates }));
      resetPage?.();
      syncToUrl({ ...updates, page: 0 });
    },
    [filters, resetPage, syncToUrl]
  );

  const paramMappingRef = useRef(paramMapping);
  paramMappingRef.current = paramMapping;

  const getQueryParams = useCallback(
    (additionalParams: Record<string, unknown> = {}): URLSearchParams => {
      const params = new URLSearchParams();

      Object.entries(filters as FiltersState).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "" && val !== "all") {
          const paramKey =
            (paramMappingRef.current as Record<string, string>)[key] ?? key;
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
