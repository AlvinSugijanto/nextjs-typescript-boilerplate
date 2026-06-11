import { useState, useCallback } from "react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/export-csv";
import { fDate } from "@/utils/format-time";
import { useApi } from "./use-api";

interface UseTableSelectionOptions<T extends { id: string | number }> {
  currentPageData: T[];
  apiUrl: string;
  filters?: Record<string, unknown>;
  itemLabel?: string;
  getQueryParams?: (extra?: Record<string, unknown>) => URLSearchParams;
}

interface PaginatedResponse<T> {
  data: T[];
  total?: number;
}

export function useTableSelection<T extends { id: string | number }>({
  currentPageData = [],
  apiUrl,
  filters = {},
  itemLabel = "items",
  getQueryParams,
}: UseTableSelectionOptions<T>) {
  const { call } = useApi<PaginatedResponse<T>>();
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [allSelectedItems, setAllSelectedItems] = useState<T[]>([]);

  const handleSelectOne = useCallback(
    (id: string | number, checked: boolean) => {
      setSelectedRows((prev) => {
        const newSelected = new Set(prev);
        if (checked) {
          newSelected.add(id);
        } else {
          newSelected.delete(id);
        }
        return newSelected;
      });
    },
    []
  );

  const handleSelectPage = useCallback(() => {
    setSelectedRows(new Set(currentPageData.map((item) => item.id)));
  }, [currentPageData]);

  const handleSelectAll = useCallback(async () => {
    const params = getQueryParams
      ? getQueryParams({ perPage: 10000 })
      : new URLSearchParams({ perPage: "10000" });

    try {
      const res = await call(`${apiUrl}?${params.toString()}`);
      const items = res?.data ?? [];
      setSelectedRows(new Set(items.map((item) => item.id)));
      setAllSelectedItems(items);
      toast.success(`Selected all ${items.length} ${itemLabel}`);
    } catch {
      toast.error(`Failed to select all ${itemLabel}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, call, apiUrl, itemLabel, getQueryParams]);

  const handleClearSelection = useCallback(() => {
    setSelectedRows(new Set());
    setAllSelectedItems([]);
  }, []);

  const handleExport = useCallback(
    ({ filename = itemLabel }: { filename?: string } = {}) => {
      const source =
        allSelectedItems.length > 0 ? allSelectedItems : currentPageData;
      const toExport = source.filter((item) => selectedRows.has(item.id));

      if (toExport.length === 0) {
        toast.error("Please select at least one item to export");
        return;
      }

      const timestamp = fDate(new Date());
      exportToCSV(toExport, `${filename}_${timestamp}.csv`);
      handleClearSelection();
      toast.success(`Exported ${toExport.length} items to CSV`);
    },
    [allSelectedItems, currentPageData, selectedRows, handleClearSelection, itemLabel]
  );

  return {
    selectedRows,
    allSelectedItems,
    handleSelectOne,
    handleSelectPage,
    handleSelectAll,
    handleClearSelection,
    handleExport,
    setSelectedRows,
    setAllSelectedItems,
  };
}
