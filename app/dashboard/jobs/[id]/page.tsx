"use client";

import React, { use } from "react";
import JobDetailView from "@/pages/jobs/detail/jobs-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailViewPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
          <JobDetailView id={id} />
        </div>
      </div>
    </div>
  );
}
