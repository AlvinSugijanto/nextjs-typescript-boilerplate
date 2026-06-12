"use client"

import React from "react"
import { Building2, KeyRound } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BannedCompaniesSection from "./sections/banned-company-sections"
import BannedKeywordsSection from "./sections/banned-keyword-sections"

export default function ConfigView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Configuration</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your filter rules to ignore specific recruiters or job
            posting content.
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="companies" className="w-full">
        <TabsList>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Banned Companies
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Banned Keywords
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="mt-4 space-y-4">
          <BannedCompaniesSection />
        </TabsContent>

        <TabsContent value="keywords" className="mt-4 space-y-4">
          <BannedKeywordsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
