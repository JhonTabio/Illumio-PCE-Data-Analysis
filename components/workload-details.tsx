"use client"

import { Card } from "@/components/ui/card"
import { X, Tag, Shield } from "lucide-react"

interface WorkloadDetailsProps {
  workload: any
  labels: any[]
  rulesets: any[]
  onClose: () => void
}

export function WorkloadDetails({ workload, labels, rulesets, onClose }: WorkloadDetailsProps) {
  // Find labels associated with this workload
  const workloadLabels = labels.filter((label: any) => {
    return label.workload_id === workload.id || label.href?.includes(workload.href)
  })

  // Find rulesets that reference this workload
  const relatedRulesets = rulesets.filter((ruleset: any) => {
    const rules = ruleset.rules || []
    return rules.some((rule: any) => {
      const consumers = rule.consumers || []
      const providers = rule.providers || []
      return (
        consumers.some((c: any) => c.workload?.href === workload.href) ||
        providers.some((p: any) => p.workload?.href === workload.href)
      )
    })
  })

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Workload Details</h2>
            <p className="text-sm text-muted-foreground mt-1">{workload.name || workload.hostname || "Unnamed"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Workload Properties */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Properties
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(workload)
                .slice(0, 8)
                .map(([key, value]) => (
                  <div key={key} className="bg-secondary/50 rounded-md p-3">
                    <div className="text-xs text-muted-foreground mb-1">{key}</div>
                    <div className="text-sm text-foreground font-mono">{String(value ?? "N/A")}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Labels */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-chart-2" />
              Labels ({workloadLabels.length})
            </h3>
            {workloadLabels.length > 0 ? (
              <div className="space-y-2">
                {workloadLabels.map((label: any, idx: number) => (
                  <div key={idx} className="bg-secondary/50 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{label.key || "Label"}:</span>
                      <span className="text-sm text-foreground font-mono">{label.value || label.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No labels found for this workload</p>
            )}
          </div>

          {/* Related Rulesets */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-chart-3" />
              Related Rulesets ({relatedRulesets.length})
            </h3>
            {relatedRulesets.length > 0 ? (
              <div className="space-y-2">
                {relatedRulesets.map((ruleset: any, idx: number) => (
                  <div key={idx} className="bg-secondary/50 rounded-md p-3">
                    <div className="text-sm text-foreground font-medium mb-1">{ruleset.name || "Unnamed Ruleset"}</div>
                    <div className="text-xs text-muted-foreground">
                      {ruleset.rules?.length || 0} rules • {ruleset.enabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No rulesets reference this workload</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
