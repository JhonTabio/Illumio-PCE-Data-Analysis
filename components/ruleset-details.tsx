"use client"

import { Card } from "@/components/ui/card"
import { X, Users, ArrowRight } from "lucide-react"

interface RulesetDetailsProps {
  ruleset: any
  workloads: any[]
  labels: any[]
  onClose: () => void
}

export function RulesetDetails({ ruleset, workloads, labels, onClose }: RulesetDetailsProps) {
  // Extract consumer and provider labels from rules
  const getConsumersAndProviders = () => {
    const rules = ruleset.rules || []
    const consumers: any[] = []
    const providers: any[] = []

    rules.forEach((rule: any) => {
      if (rule.consumers) {
        consumers.push(...rule.consumers)
      }
      if (rule.providers) {
        providers.push(...rule.providers)
      }
    })

    return { consumers, providers }
  }

  const { consumers, providers } = getConsumersAndProviders()

  // Resolve labels to workloads
  const resolveToWorkloads = (entities: any[]) => {
    const resolved: any[] = []

    entities.forEach((entity: any) => {
      if (entity.workload) {
        const workload = workloads.find((w: any) => w.href === entity.workload.href)
        if (workload) resolved.push(workload)
      } else if (entity.label) {
        const matchingWorkloads = workloads.filter((w: any) => {
          return labels.some(
            (l: any) =>
              (l.workload_id === w.id || l.href?.includes(w.href)) &&
              (l.href === entity.label.href || l.key === entity.label.key),
          )
        })
        resolved.push(...matchingWorkloads)
      }
    })

    return resolved
  }

  const consumerWorkloads = resolveToWorkloads(consumers)
  const providerWorkloads = resolveToWorkloads(providers)

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ruleset Details</h2>
            <p className="text-sm text-muted-foreground mt-1">{ruleset.name || "Unnamed Ruleset"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Ruleset Properties */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Properties</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Enabled</div>
                <div className="text-sm text-foreground font-mono">{String(ruleset.enabled ?? "N/A")}</div>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <div className="text-xs text-muted-foreground mb-1">Rules Count</div>
                <div className="text-sm text-foreground font-mono">{ruleset.rules?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Consumer and Provider Flow */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-chart-1" />
              Traffic Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Consumers */}
              <Card className="p-4">
                <div className="text-xs text-muted-foreground mb-2">Consumers ({consumerWorkloads.length})</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {consumerWorkloads.length > 0 ? (
                    consumerWorkloads.slice(0, 5).map((w: any, idx: number) => (
                      <div key={idx} className="text-xs font-mono text-foreground bg-secondary/30 rounded px-2 py-1">
                        {w.name || w.hostname || "Unknown"}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No consumers</p>
                  )}
                  {consumerWorkloads.length > 5 && (
                    <p className="text-xs text-muted-foreground">+{consumerWorkloads.length - 5} more</p>
                  )}
                </div>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>

              {/* Providers */}
              <Card className="p-4">
                <div className="text-xs text-muted-foreground mb-2">Providers ({providerWorkloads.length})</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {providerWorkloads.length > 0 ? (
                    providerWorkloads.slice(0, 5).map((w: any, idx: number) => (
                      <div key={idx} className="text-xs font-mono text-foreground bg-secondary/30 rounded px-2 py-1">
                        {w.name || w.hostname || "Unknown"}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No providers</p>
                  )}
                  {providerWorkloads.length > 5 && (
                    <p className="text-xs text-muted-foreground">+{providerWorkloads.length - 5} more</p>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Rules */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Rules</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {ruleset.rules && ruleset.rules.length > 0 ? (
                ruleset.rules.map((rule: any, idx: number) => (
                  <div key={idx} className="bg-secondary/50 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground font-medium">Rule {idx + 1}</span>
                      <span className="text-xs text-muted-foreground">{rule.enabled ? "Enabled" : "Disabled"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rule.consumers?.length || 0} consumers → {rule.providers?.length || 0} providers
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No rules defined</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
