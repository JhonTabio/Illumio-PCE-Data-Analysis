"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, PieChartIcon, Download } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { UploadedFile } from "@/app/page"
import { WorkloadDetails } from "@/components/workload-details"
import { RulesetDetails } from "@/components/ruleset-details"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"

interface AnalysisViewProps {
  files: UploadedFile[]
}

export function AnalysisView({ files }: AnalysisViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterValue, setFilterValue] = useState<string>("all")
  const [selectedWorkload, setSelectedWorkload] = useState<any>(null)
  const [selectedRuleset, setSelectedRuleset] = useState<any>(null)

  const workloadsFile = files.find((f) => f.type === "workloads")
  const rulesetsFile = files.find((f) => f.type === "rulesets")
  const labelsFile = files.find((f) => f.type === "labels")
  const servicesFile = files.find((f) => f.type === "services")

  // Filter workloads based on selected filters
  const filteredWorkloads = useMemo(() => {
    if (!workloadsFile) return []
    let data = workloadsFile.data

    if (filterType !== "all" && filterValue !== "all") {
      data = data.filter((w: any) => w[filterType] === filterValue)
    }

    if (searchQuery) {
      data = data.filter((w: any) =>
        Object.values(w).some((val) => String(val).toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    return data
  }, [workloadsFile, filterType, filterValue, searchQuery])

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    if (!workloadsFile || filterType === "all") return []
    return Array.from(new Set(workloadsFile.data.map((w: any) => w[filterType]))).filter(Boolean)
  }, [workloadsFile, filterType])

  // Chart data: Workloads by environment
  const environmentData = useMemo(() => {
    if (!workloadsFile) return []
    const counts: Record<string, number> = {}
    workloadsFile.data.forEach((w: any) => {
      const env = w.environment || w.env || "Unknown"
      counts[env] = (counts[env] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [workloadsFile])

  // Chart data: Services usage
  const servicesData = useMemo(() => {
    if (!rulesetsFile) return []
    const counts: Record<string, number> = {}
    rulesetsFile.data.forEach((r: any) => {
      const services = r.services || []
      services.forEach((s: any) => {
        const name = s.name || s.service || "Unknown"
        counts[name] = (counts[name] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [rulesetsFile])

  const COLORS = ["#6366f1", "#22d3ee", "#a855f7", "#f59e0b", "#10b981"]

  const handleExportCSV = () => {
    if (filteredWorkloads.length > 0) {
      exportToCSV(filteredWorkloads, "filtered-workloads.csv")
    }
  }

  const handleExportJSON = () => {
    if (filteredWorkloads.length > 0) {
      exportToJSON(filteredWorkloads, "filtered-workloads.json")
    }
  }

  const handleExportChartData = (data: any[], filename: string, format: "csv" | "json") => {
    if (format === "csv") {
      exportToCSV(data, filename)
    } else {
      exportToJSON(data, filename)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Filters & Search</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredWorkloads.length === 0}
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              disabled={filteredWorkloads.length === 0}
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Filter By</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="enforcement_mode">Enforcement Mode</SelectItem>
                <SelectItem value="ven_status">VEN Status</SelectItem>
                <SelectItem value="environment">Environment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Value</label>
            <Select value={filterValue} onValueChange={setFilterValue} disabled={filterType === "all"}>
              <SelectTrigger>
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map((opt: any) => (
                  <SelectItem key={String(opt)} value={String(opt)}>
                    {String(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {workloadsFile && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredWorkloads.length} of {workloadsFile.data.length} workloads
          </div>
        )}
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {environmentData.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Workloads by Environment</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportChartData(environmentData, "environment-data.csv", "csv")}
                  className="h-8 px-2"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={environmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {environmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {servicesData.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">Top Services in Rulesets</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportChartData(servicesData, "services-data.csv", "csv")}
                  className="h-8 px-2"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servicesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0 0)" />
                <XAxis dataKey="name" tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }} />
                <YAxis tick={{ fill: "oklch(0.55 0 0)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0 0)",
                    border: "1px solid oklch(0.22 0 0)",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {workloadsFile && filteredWorkloads.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Filtered Workloads (Click to view relationships)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {Object.keys(filteredWorkloads[0] || {})
                    .slice(0, 6)
                    .map((col) => (
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
                {filteredWorkloads.slice(0, 20).map((row: any, idx: number) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedWorkload(row)}
                    className="hover:bg-accent/30 transition-colors cursor-pointer"
                  >
                    {Object.keys(row)
                      .slice(0, 6)
                      .map((col) => (
                        <td key={col} className="px-4 py-3 text-foreground font-mono text-xs">
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredWorkloads.length > 20 && (
            <div className="px-6 py-3 bg-muted/30 border-t border-border text-xs text-muted-foreground text-center">
              Showing first 20 of {filteredWorkloads.length} results
            </div>
          )}
        </Card>
      )}

      {rulesetsFile && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-medium text-foreground">Rulesets (Click to view relationships)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Enabled
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Rules Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rulesetsFile.data.slice(0, 10).map((ruleset: any, idx: number) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedRuleset(ruleset)}
                    className="hover:bg-accent/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-foreground font-mono text-xs">{ruleset.name || "Unnamed"}</td>
                    <td className="px-4 py-3 text-foreground font-mono text-xs">{String(ruleset.enabled ?? "N/A")}</td>
                    <td className="px-4 py-3 text-foreground font-mono text-xs">{ruleset.rules?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedWorkload && (
        <WorkloadDetails
          workload={selectedWorkload}
          labels={labelsFile?.data || []}
          rulesets={rulesetsFile?.data || []}
          onClose={() => setSelectedWorkload(null)}
        />
      )}

      {selectedRuleset && (
        <RulesetDetails
          ruleset={selectedRuleset}
          workloads={workloadsFile?.data || []}
          labels={labelsFile?.data || []}
          onClose={() => setSelectedRuleset(null)}
        />
      )}
    </div>
  )
}
