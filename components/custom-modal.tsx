"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  title: string
  className?: string
  children?: React.ReactNode
}

export default function CustomModal({
  open,
  setOpen,
  title,
  className,
  children,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("overflow-hidden p-0", className)}>
        <DialogHeader className="relative flex flex-row items-center space-y-0 border-b p-4">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
