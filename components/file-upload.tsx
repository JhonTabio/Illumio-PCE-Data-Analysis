"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileJson, FileSpreadsheet } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { UploadedFile, FileType } from "@/app/page"
import Papa from "papaparse"

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const detectFileType = (filename: string): FileType | null => {
    const lower = filename.toLowerCase()
    if (lower.includes("workload")) return "workloads"
    if (lower.includes("label") && !lower.includes("group")) return "labels"
    if (lower.includes("service")) return "services"
    if (lower.includes("ip") || lower.includes("iplist")) return "ip-lists"
    if (lower.includes("ruleset")) return "rulesets"
    if (lower.includes("label") && lower.includes("group")) return "label-groups"
    return null
  }

  const processFile = async (file: File): Promise<UploadedFile | null> => {
    const fileType = detectFileType(file.name)
    if (!fileType) return null

    return new Promise((resolve) => {
      if (file.name.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: fileType,
              size: file.size,
              data: results.data,
              uploadedAt: new Date(),
            })
          },
          error: () => resolve(null),
        })
      } else if (file.name.endsWith(".json")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string)
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: fileType,
              size: file.size,
              data: Array.isArray(json) ? json : [json],
              uploadedAt: new Date(),
            })
          } catch {
            resolve(null)
          }
        }
        reader.readAsText(file)
      } else {
        resolve(null)
      }
    })
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true)
      const processed = await Promise.all(acceptedFiles.map(processFile))
      const validFiles = processed.filter((f): f is UploadedFile => f !== null)
      onFilesUploaded(validFiles)
      setIsProcessing(false)
    },
    [onFilesUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
  })

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-border bg-card hover:border-primary/50 transition-colors">
        <div {...getRootProps()} className="flex flex-col items-center justify-center px-6 py-12 cursor-pointer">
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isDragActive ? "Drop files here" : "Upload PCE Export Files"}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop CSV or JSON files, or click to browse
          </p>
          {isProcessing && <p className="text-sm text-primary">Processing files...</p>}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="h-5 w-5 text-chart-1 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">CSV Files</h4>
              <p className="text-xs text-muted-foreground">Workloads, Labels, Services, IP Lists</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <FileJson className="h-5 w-5 text-chart-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">JSON Files</h4>
              <p className="text-xs text-muted-foreground">Rulesets, Label Groups</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
