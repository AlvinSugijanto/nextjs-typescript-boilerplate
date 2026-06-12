import * as React from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionBarProps {
  selectedCount: number
  onExport: () => void
  onDelete?: () => void
  onCancel: () => void
}

export function FloatingActionBar({
  selectedCount,
  onExport,
  onDelete,
  onCancel,
}: FloatingActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-border bg-background px-5 py-3 shadow-xl">
      <span className="text-sm font-medium text-muted-foreground">
        {selectedCount} selected
      </span>
      <div className="h-5 w-px bg-border" />
      <Button variant="ghost" size="sm" className="h-8" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="outline" size="sm" className="h-8" onClick={onExport}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button
        variant="destructive"
        size="sm"
        className="h-8"
        // onClick={onDelete}
      >
        Delete
      </Button>
    </div>
  )
}
