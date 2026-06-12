"use client";

import { Building2, KeyRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllJobsSections from "./sections/all-jobs-sections";
import SessionJobsSections from "./sections/session-jobs-sections";

export default function JobsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your scraped LinkedIn jobs
          </p>
        </div>
      </div>

      <Tabs defaultValue="allJobs" className="w-full">
        <TabsList className="flex" variant="line">
          <TabsTrigger value="allJobs" className="flex items-center gap-2 py-2">
            <Building2 className="h-4 w-4" />
            All Jobs
          </TabsTrigger>
          <TabsTrigger
            value="sessionJobs"
            className="flex items-center gap-2 py-2"
          >
            <KeyRound className="h-4 w-4" />
            Session Jobs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allJobs" className="space-y-4">
          <AllJobsSections />
        </TabsContent>

        <TabsContent value="sessionJobs" className="space-y-4">
          <SessionJobsSections />
        </TabsContent>
      </Tabs>
    </div>
  );
}
