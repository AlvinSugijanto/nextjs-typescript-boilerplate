"use client";

import { useBoolean } from "@/hooks/use-boolean";
import { useApi } from "@/hooks/use-api";
import { useFilters } from "@/hooks/use-filters";
import { SimpleTable, usePagination } from "@/components/table/simple-table";
import { useTableSelection } from "@/hooks/use-table-selection";
import React, { useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  MapPin,
  Search,
} from "lucide-react";
import JobsFilters from "../components/jobs-filters";
import { SearchJobsDialog } from "@/components/jobs/search-jobs-dialog";
import { JOB_CONTRACT, JOB_PORTALS, JOB_TYPE } from "@/data/enums";
import { Button } from "@/components/ui/button";
import { FloatingActionBar } from "@/components/floating-action-bar";
import { fDate, fDateTime, toUTC7 } from "@/utils/format-time";
import { Badge } from "@/components/ui/badge";
import { Job, PaginatedResponse, Session } from "@/types/jobs";

const PAGE_SIZE = 10;

interface AllJobsSectionsProps {
  session?: Session | null;
  setSession?: (session: Session | null) => void;
}

const AllJobsSections = ({ session, setSession }: AllJobsSectionsProps) => {
  const searchModal = useBoolean(false);
  const { data: jobs, call, loading } = useApi<PaginatedResponse<Job>>();

  const { page, pageSize, setPage, paginationProps } = usePagination({
    totalItems: jobs?.total,
    initialPageSize: PAGE_SIZE,
  });

  const { filters, setFilters, handleSort, getQueryParams } = useFilters({
    initialFilters: {
      q: "",
      job_type: "all",
      job_contract: "all",
      location: "",
      job_portal: "all",
      sortBy: "created_at",
      sortOrder: "desc",
      session_id: session?.id ? String(session.id) : "",
    },
    paramMapping: {
      q: "search",
      sortBy: "sort_by",
      sortOrder: "sort_order",
      job_portal: "source",
    },
    resetPage: () => setPage(1),
  });

  const {
    selectedRows,
    handleSelectOne,
    handleSelectPage,
    handleSelectAll,
    handleClearSelection,
    handleExport,
  } = useTableSelection<Job>({
    currentPageData: jobs?.data || [],
    apiUrl: "/api/v1/jobs",
    filters,
    itemLabel: "jobs",
    getQueryParams,
  });

  const sortConfig = { key: filters.sortBy as string, direction: filters.sortOrder as "asc" | "desc" };

  const fetchJobs = async () => {
    const params = getQueryParams({ page, perPage: pageSize });
    call(`/api/v1/jobs?${params}`);
  };

  const handleRowClick = (row: Job) => {
    window.open(`/dashboard/jobs/${row.id}`, "_blank");
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row: Job) => (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="capitalize w-[60px]">
            {JOB_TYPE.find((t) => t.value === row.job_type)?.label ?? "-"}
          </Badge>
          <span className="line-clamp-1 font-medium">{row.title}</span>
        </div>
      ),
    },
    {
      key: "job_contract",
      label: "Contract",
      sortable: true,
      render: (row: Job) => (
        <span className="capitalize">
          {JOB_CONTRACT.find((c) => c.value === row.job_contract)?.label ?? "-"}
        </span>
      ),
    },
    {
      key: "company",
      label: "Company",
      sortable: true,
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      render: (row: Job) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="line-clamp-1">{row.location}</span>
        </div>
      ),
    },
    {
      key: "salary",
      label: "Salary",
      sortable: true,
      render: (row: Job) =>
        row.salary ? (
          <Badge variant="default">{row.salary}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      render: (row: Job) =>
        JOB_PORTALS.find((c) => c.value === row.source)?.label ?? "-",
    },
    {
      key: "date_posted",
      label: "Posted",
      sortable: true,
      render: (row: Job) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm">{fDate(row.date_posted) || "-"}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Searched At",
      sortable: true,
      render: (row: Job) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm" title={fDateTime(row.created_at)}>
            {fDateTime(toUTC7(row.created_at)) || "-"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-[80px]",
      render: (row: Job) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.open(row.job_url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize, filters]);

  useEffect(() => {
    handleClearSelection();
  }, [jobs?.data]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="flex gap-2 items-center">
          {session && setSession && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSession(null)}
            >
              <ArrowLeft />
            </Button>
          )}
          <h3 className="font-semibold ml-1 self-end">
            {session?.name ? session.name : "All"} Jobs
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {!session && (
            <Button onClick={searchModal.onTrue}>
              <Search className="h-4 w-4" />
              Search Jobs
            </Button>
          )}
          <JobsFilters filters={filters as any} onFiltersChange={setFilters as any} />
        </div>
      </div>

      <SimpleTable
        columns={columns}
        data={jobs?.data || []}
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
        refetch={fetchJobs}
      />

      <FloatingActionBar
        selectedCount={selectedRows.size}
        onExport={() => handleExport({ filename: "jobs" })}
        onCancel={handleClearSelection}
      />
    </div>
  );
};

export default AllJobsSections;
