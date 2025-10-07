"use client"

import { Upload, Eye, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: "upload" | "preview" | "analysis"
  onSectionChange: (section: "upload" | "preview" | "analysis") => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const sections = [
    { id: "upload" as const, label: "Upload", icon: Upload },
    { id: "preview" as const, label: "Preview", icon: Eye },
    { id: "analysis" as const, label: "Analysis", icon: BarChart3 },
  ]

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Illumio PCE Analyzer</h2>
      </div>

      <nav className="p-4 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
