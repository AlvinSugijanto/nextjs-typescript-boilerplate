import * as React from "react"
import { useState, useMemo } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<T = object> {
  key: string
  label: string
  className?: string
  sortable?: boolean
  render?: (row: T, rowIndex: number) => React.ReactNode
}

export interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

export interface PaginationState {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

// ─── usePagination ────────────────────────────────────────────────────────────

interface UsePaginationOptions {
  totalItems?: number
  initialPage?: number
  initialPageSize?: number
  pageSizeOptions?: number[]
}

export function usePagination({
  totalItems = 0,
  initialPage = 1,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
}: UsePaginationOptions) {
  const [page, setPageRaw] = useState(initialPage)
  const [pageSize, setPageSizeRaw] = useState(initialPageSize)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const setPage = (p: number) =>
    setPageRaw(Math.min(Math.max(1, p), totalPages))

  const setPageSize = (size: number) => {
    setPageSizeRaw(size)
    setPageRaw(1)
  }

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    paginationProps: {
      page,
      pageSize,
      totalPages,
      totalItems,
      pageSizeOptions,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
    } satisfies PaginationState,
  }
}

// ─── Pagination Component ─────────────────────────────────────────────────────

export function Pagination({
  page,
  pageSize,
  totalPages,
  totalItems,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
}: PaginationState) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 px-1 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          {from}–{to} of {totalItems}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">Rows:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => onPageSizeChange(Number(val))}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((s) => (
                <SelectItem key={s} value={String(s)} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="default"
          size="icon"
          className="h-7 w-7 text-xs"
          aria-label={`Page ${page}`}
          aria-current="page"
        >
          {page}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

// ─── SimpleTable ──────────────────────────────────────────────────────────────

interface SimpleTableProps<T extends object> {
  columns: ColumnDef<T>[]
  data: T[]
  onClick?: (row: T) => void
  isLoading?: boolean
  paginationProps?: PaginationState
  defaultPageSize?: number
  pageSizeOptions?: number[]
  columnProps?: Record<string, unknown>
  selectable?: boolean
  rowKey?: keyof T
  sortConfig?: SortConfig | null
  onSort?: ((columnKey: string) => void) | null
  selectedIds?: Set<string | number> | null
  onSelectPage?: (() => void) | null
  onSelectAll?: (() => void) | null
  onClearSelection?: (() => void) | null
  onSelectOne?: ((id: string | number, checked: boolean) => void) | null
}

export function SimpleTable<T extends object>({
  columns,
  data,
  onClick = () => {},
  isLoading,
  paginationProps,
  defaultPageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  selectable = false,
  rowKey = "id" as keyof T,
  sortConfig = null,
  onSort = null,
  selectedIds = null,
  onSelectPage = null,
  onSelectAll = null,
  onClearSelection = null,
  onSelectOne = null,
}: SimpleTableProps<T>) {
  const isClientPaginated = defaultPageSize != null && paginationProps == null

  const clientPagination = usePagination({
    totalItems: isClientPaginated ? data.length : 0,
    initialPageSize: defaultPageSize ?? 10,
    pageSizeOptions,
  })

  const activePaginationProps =
    paginationProps ??
    (isClientPaginated ? clientPagination.paginationProps : null)

  const visibleData = useMemo(() => {
    if (!isClientPaginated) return data
    const { page, pageSize } = clientPagination
    return data.slice((page - 1) * pageSize, page * pageSize)
  }, [
    isClientPaginated,
    data,
    clientPagination.page,
    clientPagination.pageSize,
  ]) // eslint-disable-line react-hooks/exhaustive-deps

  const rows = isClientPaginated ? visibleData : data

  const isRowSelected = (row: T) =>
    selectedIds?.has(row[rowKey] as string | number) ?? false

  const totalItems = activePaginationProps?.totalItems ?? rows.length
  const isAllSelected =
    rows.length > 0 &&
    selectedIds != null &&
    (selectedIds.size === rows.length || selectedIds.size === totalItems)

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-background">
          <TableRow className="border-border">
            {selectable && (
              <TableHead className="w-[70px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-1 rounded-sm px-3 py-2 hover:bg-muted/50">
                      <Checkbox
                        checked={isAllSelected}
                        className="pointer-events-none"
                        aria-hidden
                      />
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-fit">
                    <DropdownMenuItem onClick={onSelectPage ?? undefined}>
                      Select This Page ({rows.length})
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onSelectAll ?? undefined}>
                      Select All Rows ({totalItems})
                    </DropdownMenuItem>
                    {selectedIds && selectedIds.size > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={onClearSelection ?? undefined}
                        >
                          Clear Selection
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columns.map((col) => {
              const isSortable = col.sortable && onSort
              const isActiveSort = sortConfig && sortConfig.key === col.key

              const sortIcon = !isSortable ? null : !isActiveSort ? (
                <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
              ) : sortConfig.direction === "asc" ? (
                <ArrowUp className="ml-1 h-3 w-3" />
              ) : (
                <ArrowDown className="ml-1 h-3 w-3" />
              )

              return (
                <TableHead
                  key={col.key}
                  className={`text-muted-foreground ${
                    isSortable
                      ? "cursor-pointer select-none hover:bg-muted/50"
                      : ""
                  } ${col.className ?? ""}`}
                  onClick={isSortable ? () => onSort!(col.key) : undefined}
                >
                  <div className="flex items-center">
                    {col.label}
                    {sortIcon}
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: activePaginationProps?.pageSize ?? 5 }).map(
              (_, i) => (
                <TableRow key={i} className="border-border">
                  {selectable && (
                    <TableCell>
                      <div className="mx-auto h-4 w-4 animate-pulse rounded bg-muted" />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              )
            )
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="py-12 text-center text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="border-border hover:cursor-pointer"
                data-state={
                  selectable && isRowSelected(row) ? "selected" : undefined
                }
                onClick={() => onClick(row)}
              >
                {selectable && (
                  <TableCell
                    className="w-[70px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={
                        selectedIds
                          ? selectedIds.has(row[rowKey] as string | number)
                          : false
                      }
                      onCheckedChange={(checked) =>
                        onSelectOne?.(row[rowKey] as string | number, !!checked)
                      }
                      aria-label={`Select row ${rowIndex + 1}`}
                      className="ml-3"
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className ?? ""}>
                    {col.render
                      ? col.render(row, rowIndex)
                      : ((row as Record<string, unknown>)[
                          col.key
                        ] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {activePaginationProps && (
        <div className="border-t border-border px-3">
          <Pagination {...activePaginationProps} />
        </div>
      )}
    </div>
  )
}
