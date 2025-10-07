"use client"

import { Card } from "@/components/ui/card"
import { FileJson, FileSpreadsheet, Trash2, CheckCircle2 } from "lucide-react"
import type { UploadedFile } from "@/app/page"

interface FileListProps {
  files: UploadedFile[]
  onRemove: (id: string) => void
}

export function FileList({ files, onRemove }: FileListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getFileTypeLabel = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file) => {
        const isJson = file.name.endsWith(".json")
        const Icon = isJson ? FileJson : FileSpreadsheet

        return (
          <Card key={file.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isJson ? "text-chart-2" : "text-chart-1"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">{file.name}</h4>
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-mono">
                      {getFileTypeLabel(file.type)}
                    </span>
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.data.length} records</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemove(file.id)}
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
