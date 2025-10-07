"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { UploadedFile } from "@/app/page"

interface DataPreviewProps {
  files: UploadedFile[]
}

export function DataPreview({ files }: DataPreviewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set([files[0]?.id]))

  const toggleFile = (id: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="space-y-4">
      {files.map((file) => {
        const isExpanded = expandedFiles.has(file.id)
        const isJson = file.name.endsWith(".json")

        return (
          <Card key={file.id} className="overflow-hidden">
            <button
              onClick={() => toggleFile(file.id)}
              className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-foreground">{file.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {file.data.length} {isJson ? "entries" : "rows"} • {file.type.replace("-", " ")}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{isJson ? "JSON" : "CSV"}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-border">
                {isJson ? (
                  <JsonPreview data={file.data.slice(0, 10)} />
                ) : (
                  <TablePreview data={file.data.slice(0, 10)} />
                )}
                {file.data.length > 10 && (
                  <div className="px-6 py-3 bg-muted/30 border-t border-border text-xs text-muted-foreground text-center">
                    Showing first 10 of {file.data.length} {isJson ? "entries" : "rows"}
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function TablePreview({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="px-6 py-8 text-center text-sm text-muted-foreground">No data to display</div>
  }

  const columns = Object.keys(data[0] || {})

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-accent/30 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-foreground font-mono text-xs">
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function JsonPreview({ data }: { data: any[] }) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleItem = (idx: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      return next
    })
  }

  if (!data || data.length === 0) {
    return <div className="px-6 py-8 text-center text-sm text-muted-foreground">No data to display</div>
  }

  return (
    <div className="divide-y divide-border">
      {data.map((item, idx) => {
        const isExpanded = expandedItems.has(idx)

        return (
          <div key={idx} className="px-6 py-3">
            <button
              onClick={() => toggleItem(idx)}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-2"
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span className="font-mono text-muted-foreground">Entry {idx + 1}</span>
            </button>

            {isExpanded && (
              <pre className="ml-5 p-3 bg-secondary rounded-md overflow-x-auto text-xs font-mono text-secondary-foreground">
                {JSON.stringify(item, null, 2)}
              </pre>
            )}
          </div>
        )
      })}
    </div>
  )
}
