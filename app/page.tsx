"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { DataPreview } from "@/components/data-preview"
import { AnalysisView } from "@/components/analysis-view"
import { Upload, FileText, Loader2 } from "lucide-react"

export type FileType = "workloads" | "labels" | "services" | "ip-lists" | "rulesets" | "label-groups"

export interface UploadedFile {
  id: string
  name: string
  type: FileType
  size: number
  data: any[]
  uploadedAt: Date
  version?: number
  uploadId?: string
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<"upload" | "preview" | "analysis">("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDataFromMongoDB()
  }, [])

  const fetchDataFromMongoDB = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fileTypes: FileType[] = ["workloads", "labels", "services", "ip-lists", "rulesets", "label-groups"]
      const fetchPromises = fileTypes.map(async (type) => {
        const response = await fetch(`/api/data/${type}`)
        if (!response.ok) throw new Error(`Failed to fetch ${type}`)
        const result = await response.json()
        if (result.data && result.data.length > 0) {
          const versions = new Map<number, any[]>()
          result.data.forEach((record: any) => {
            const version = record._version || 1
            if (!versions.has(version)) {
              versions.set(version, [])
            }
            versions.get(version)!.push(record)
          })

          return Array.from(versions.entries()).map(([version, records]) => ({
            id: `${type}_v${version}`,
            name: records[0]._fileName || `${type}_v${version}.json`,
            type,
            size: JSON.stringify(records).length,
            data: records,
            uploadedAt: new Date(records[0]._uploadedAt),
            version,
          }))
        }
        return []
      })

      const results = await Promise.all(fetchPromises)
      const allFiles = results.flat()
      setUploadedFiles(allFiles)
    } catch (err) {
      console.error("[v0] Error fetching data:", err)
      setError("Failed to load data from database")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilesUploaded = async (files: UploadedFile[]) => {
    setIsLoading(true)
    setError(null)
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileType: file.type,
            data: file.data,
            fileName: file.name,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const result = await response.json()
        return { ...file, version: result.version, uploadId: result.uploadId }
      })

      const uploadedFilesWithMetadata = await Promise.all(uploadPromises)
      setUploadedFiles((prev) => [...prev, ...uploadedFilesWithMetadata])
    } catch (err) {
      console.error("[v0] Error uploading files:", err)
      setError("Failed to upload files to database")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-auto">
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {activeSection === "upload" && "Upload Files"}
                {activeSection === "preview" && "Data Preview"}
                {activeSection === "analysis" && "Analysis"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeSection === "upload" && "Upload Illumio PCE export files for analysis"}
                {activeSection === "preview" && "Preview uploaded data and verify contents"}
                {activeSection === "analysis" && "Analyze workloads, rulesets, and relationships"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{uploadedFiles.length} files uploaded</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading data...</span>
            </div>
          )}

          {!isLoading && activeSection === "upload" && (
            <div className="space-y-6">
              <FileUpload onFilesUploaded={handleFilesUploaded} />

              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Uploaded Files</h2>
                  <FileList files={uploadedFiles} onRemove={handleRemoveFile} />
                </div>
              )}
            </div>
          )}

          {!isLoading && activeSection === "preview" && uploadedFiles.length > 0 && (
            <DataPreview files={uploadedFiles} />
          )}

          {!isLoading && activeSection === "preview" && uploadedFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No files uploaded yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload files to preview their contents</p>
              <button
                onClick={() => setActiveSection("upload")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Upload
              </button>
            </div>
          )}

          {!isLoading && activeSection === "analysis" && uploadedFiles.length > 0 && (
            <AnalysisView files={uploadedFiles} />
          )}

          {!isLoading && activeSection === "analysis" && uploadedFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No data to analyze</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload files to start analyzing your PCE data</p>
              <button
                onClick={() => setActiveSection("upload")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Go to Upload
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
