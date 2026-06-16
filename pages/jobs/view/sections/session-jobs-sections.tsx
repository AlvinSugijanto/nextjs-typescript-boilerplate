"use client"

import { useBoolean } from "@/hooks/use-boolean"
import { useApi } from "@/hooks/use-api"
import { useFilters } from "@/hooks/use-filters"
import { useDebounce } from "@/hooks/use-debounce"
import { SimpleTable, usePagination } from "@/components/table/simple-table"
import { useTableSelection } from "@/hooks/use-table-selection"
import React, { useEffect, useState } from "react"
import { Calendar, Download, EllipsisVertical } from "lucide-react"
import { SearchJobsDialog } from "@/components/jobs/search-jobs-dialog"
import { Button } from "@/components/ui/button"
import { FloatingActionBar } from "@/components/floating-action-bar"
import { fDate, fDateTime, toUTC7 } from "@/utils/format-time"
import { Badge } from "@/components/ui/badge"
import SearchInput from "@/components/search-input"
import AllJobsSections from "./all-jobs-sections"
import { toast } from "sonner"
import DeleteDialog from "@/components/delete-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PaginatedResponse, Session } from "@/types"

const PAGE_SIZE = 10

const SessionJobsSections = () => {
  const searchModal = useBoolean(false)
  const deleteModal = useBoolean(false)
  const [selectedItem, setSelectedItem] = useState<Session | null>(null)

  const { data: sessions, call, loading } = useApi<PaginatedResponse<Session>>()
  const { call: callDelete, loading: loadingDelete } = useApi()
  const [session, setSession] = useState<Session | null>(null)

  const { page, pageSize, setPage, paginationProps } = usePagination({
    totalItems: sessions?.total,
    initialPageSize: PAGE_SIZE,
  })

  const { filters, setFilter, handleSort, getQueryParams } = useFilters({
    initialFilters: {
      q: "",
      sortBy: "created_at",
      sortOrder: "desc",
    },
    paramMapping: {
      q: "search",
      sortBy: "sort_by",
      sortOrder: "sort_order",
    },
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
  } = useTableSelection<Session>({
    currentPageData: sessions?.data || [],
    apiUrl: "/api/v1/sessions",
    filters,
    itemLabel: "list-session-jobs",
    getQueryParams,
  })

  const sortConfig = {
    key: filters.sortBy as string,
    direction: filters.sortOrder as "asc" | "desc",
  }

  const fetchSessions = async () => {
    const params = getQueryParams({ page, perPage: pageSize })
    call(`/api/v1/sessions?${params}`)
  }

  const handleConfirmDelete = async () => {
    if (!selectedItem?.id) return
    try {
      await callDelete(`/api/v1/sessions/${selectedItem.id}`, "DELETE")
      toast.success(`Session "${selectedItem.name}" deleted successfully.`)
      deleteModal.onFalse()
      fetchSessions()
    } catch (error) {
      const err = error as { message?: string }
      toast.error(err.message || "Failed to delete session")
    }
  }

  const handleRowClick = (row: Session) => {
    setSession(row)
  }

  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: Session) => <Badge variant="default">{row.status}</Badge>,
    },
    {
      key: "total_jobs",
      label: "Total Jobs",
      sortable: true,
    },
    {
      key: "start_run_time",
      label: "Started At",
      sortable: true,
      render: (row: Session) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm" title={fDateTime(row.start_run_time)}>
            {fDateTime(toUTC7(row.start_run_time)) || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "end_run_time",
      label: "Ended At",
      sortable: true,
      render: (row: Session) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span
            className="text-sm"
            title={row.end_run_time ? fDateTime(row.end_run_time) : ""}
          >
            {row.end_run_time ? fDate(row.end_run_time) : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[80px] text-right",
      render: (row: Session) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setSession(row)
              }}
            >
              View Details
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
    fetchSessions()
  }, [page, pageSize, filters])

  useEffect(() => {
    handleClearSelection()
  }, [sessions?.data])

  if (session) {
    return <AllJobsSections session={session} setSession={setSession} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <h3 className="ml-1 self-end font-semibold">Session Jobs</h3>

        <div className="flex items-center gap-4">
          <SearchInput
            onChange={(value) => setFilter("q", value)}
            placeholder="Search items..."
          />
        </div>
      </div>

      <SimpleTable
        columns={columns}
        data={sessions?.data || []}
        isLoading={loading}
        onClick={handleRowClick}
        selectable
        selectedIds={selectedRows}
        onSelectPage={handleSelectPage}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onSelectOne={handleSelectOne}
        sortConfig={sortConfig}
        onSort={handleSort}
        paginationProps={paginationProps}
      />

      <SearchJobsDialog
        open={searchModal.value}
        setOpen={searchModal.setValue}
        refetch={fetchSessions}
      />

      <DeleteDialog
        open={deleteModal.value}
        setOpen={deleteModal.setValue}
        title="Delete Session"
        description={`Are you sure you want to delete session "${selectedItem?.name || ""}"?`}
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />

      <FloatingActionBar
        selectedCount={selectedRows.size}
        onExport={() => handleExport({ filename: "sessions" })}
        onCancel={handleClearSelection}
      />
    </div>
  )
}

export default SessionJobsSections
