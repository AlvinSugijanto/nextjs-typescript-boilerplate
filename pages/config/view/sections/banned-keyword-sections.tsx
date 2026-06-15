"use client"

import React, { useState, useEffect } from "react"
import { Calendar, Plus, EllipsisVertical, Download } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { FloatingActionBar } from "@/components/floating-action-bar"
import { Badge } from "@/components/ui/badge"
import { SimpleTable, usePagination } from "@/components/table/simple-table"
import { fDate } from "@/utils/format-time"
import { useApi } from "@/hooks/use-api"
import { useFilters } from "@/hooks/use-filters"
import { useDebounce } from "@/hooks/use-debounce"
import { useBoolean } from "@/hooks/use-boolean"
import { useTableSelection } from "@/hooks/use-table-selection"
import SearchInput from "@/components/search-input"
import DeleteDialog from "@/components/delete-dialog"
import AddKeywordModal from "../components/add-keyword-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BannedKeyword, PaginatedResponse } from "@/types"

const PAGE_SIZE = 10

export default function BannedKeywordsSection() {
  const createModal = useBoolean(false)
  const deleteModal = useBoolean(false)
  const [selectedItem, setSelectedItem] = useState<BannedKeyword | null>(null)

  const {
    data: keywords,
    call,
    loading,
  } = useApi<PaginatedResponse<BannedKeyword>>()
  const { call: callDelete, loading: loadingDelete } = useApi()

  const { page, pageSize, setPage, paginationProps } = usePagination({
    totalItems: keywords?.total,
    initialPageSize: PAGE_SIZE,
  })

  const { filters, setFilter, handleSort, getQueryParams } = useFilters({
    initialFilters: { q: "", sortBy: "keyword", sortOrder: "asc" },
    paramMapping: { q: "search", sortBy: "sort_by", sortOrder: "sort_order" },
    resetPage: () => setPage(1),
  })

  // const [searchQuery, setSearchQuery] = useState(filters.q as string)
  // const debouncedSearch = useDebounce(searchQuery, 500)

  // useEffect(() => {
  //   setFilter("q", debouncedSearch)
  // }, [debouncedSearch, setFilter])

  // useEffect(() => {
  //   setSearchQuery(filters.q as string)
  // }, [filters.q])

  const {
    selectedRows,
    handleSelectOne,
    handleSelectPage,
    handleSelectAll,
    handleClearSelection,
    handleExport,
  } = useTableSelection<BannedKeyword>({
    currentPageData: keywords?.data ?? [],
    apiUrl: "/api/v1/banned-keywords",
    filters,
    itemLabel: "keywords",
    getQueryParams,
  })

  const sortConfig = {
    key: filters.sortBy as string,
    direction: filters.sortOrder as "asc" | "desc",
  }

  const fetchKeywords = () => {
    const params = getQueryParams({ page, perPage: pageSize })
    call(`/api/v1/banned-keywords?${params}`)
  }

  const handleConfirmDelete = async () => {
    if (!selectedItem?.id) return
    try {
      await callDelete(`/api/v1/banned-keywords/${selectedItem.id}`, "DELETE")
      toast.success(`"${selectedItem.keyword}" deleted successfully.`)
      deleteModal.onFalse()
      setSelectedItem(null)
      fetchKeywords()
    } catch (error) {
      const err = error as {
        response?: { data?: { detail?: string } }
        message?: string
      }
      toast.error(
        err.response?.data?.detail ?? err.message ?? "Failed to delete keyword"
      )
    }
  }

  const columns = [
    {
      key: "keyword",
      label: "Keyword / Phrase",
      sortable: true,
    },
    {
      key: "created_at",
      label: "Created",
      className: "w-[180px] text-muted-foreground text-sm",
      sortable: true,
      render: (row: BannedKeyword) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
          {fDate(row.created_at) || "N/A"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Action",
      className: "w-[100px] text-right",
      render: (row: BannedKeyword) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setSelectedItem(row)
                createModal.onTrue()
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedItem(row)
                deleteModal.onTrue()
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  useEffect(() => {
    fetchKeywords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters])

  useEffect(() => {
    handleClearSelection()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords?.data])

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <h3 className="ml-1 self-end font-semibold">Banned Keywords</h3>
        <div className="flex items-center gap-4">
          <SearchInput
            value={filters.q}
            onChange={(value) => setFilter("q", value)}
            placeholder="Search keywords..."
          />
          <Button
            onClick={() => {
              setSelectedItem(null)
              createModal.onTrue()
            }}
          >
            <Plus className="h-4 w-4" /> Add Keyword
          </Button>
        </div>
      </div>

      <SimpleTable
        columns={columns}
        data={keywords?.data ?? []}
        isLoading={loading}
        sortConfig={sortConfig}
        onSort={handleSort}
        paginationProps={paginationProps}
        selectable
        selectedIds={selectedRows}
        onSelectOne={handleSelectOne}
        onSelectPage={handleSelectPage}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      {createModal.value && (
        <AddKeywordModal
          open={createModal.value}
          setOpen={(value) => {
            createModal.setValue(value)
            if (!value) setSelectedItem(null)
          }}
          selectedItem={selectedItem}
          refetch={fetchKeywords}
        />
      )}

      <DeleteDialog
        open={deleteModal.value}
        setOpen={deleteModal.setValue}
        title="Delete Banned Keyword"
        description={`Are you sure you want to delete "${selectedItem?.keyword ?? ""}" from the banned list?`}
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />

      <FloatingActionBar
        selectedCount={selectedRows.size}
        onExport={() => handleExport({ filename: "banned-keywords" })}
        onCancel={handleClearSelection}
      />
    </div>
  )
}
