"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { DataPreview } from "@/components/data-preview"
import { AnalysisView } from "@/components/analysis-view"
import { Upload, FileText } from "lucide-react"

export type FileType = "workloads" | "labels" | "services" | "ip-lists" | "rulesets" | "label-groups"

export interface UploadedFile {
  id: string
  name: string
  type: FileType
  size: number
  data: any[]
  uploadedAt: Date
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<"upload" | "preview" | "analysis">("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles((prev) => [...prev, ...files])
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
          {activeSection === "upload" && (
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

          {activeSection === "preview" && uploadedFiles.length > 0 && <DataPreview files={uploadedFiles} />}

          {activeSection === "preview" && uploadedFiles.length === 0 && (
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

          {activeSection === "analysis" && uploadedFiles.length > 0 && <AnalysisView files={uploadedFiles} />}

          {activeSection === "analysis" && uploadedFiles.length === 0 && (
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
