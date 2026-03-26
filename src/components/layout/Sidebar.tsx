// src/components/layout/Sidebar.tsx
'use client'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface SidebarProps {
  title?: string
  filters?: FilterOption[]
  activeFilter?: string
  onFilterChange?: (val: string) => void
  statsWidget?: React.ReactNode
  extraWidgets?: React.ReactNode
}

export function Sidebar({
  filters,
  activeFilter = 'semua',
  onFilterChange,
  statsWidget,
  extraWidgets,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      {statsWidget && (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          {statsWidget}
        </div>
      )}

      {filters && filters.length > 0 && (
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border text-xs font-bold text-ink flex items-center gap-2">
            <span>🏷</span> Filter
          </div>
          <div className="p-3 flex flex-col gap-1.5">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => onFilterChange?.(f.value)}
                className={[
                  'flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 text-left',
                  activeFilter === f.value
                    ? 'bg-accent-light border border-accent-border text-accent'
                    : 'bg-surface border border-border text-ink-2 hover:bg-surface-2',
                ].join(' ')}
              >
                <span>{f.label}</span>
                {f.count !== undefined && (
                  <span className={`text-[10px] font-mono ${activeFilter === f.value ? 'text-accent' : 'text-ink-3'}`}>
                    {f.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {extraWidgets}
    </aside>
  )
}

// ── Reusable stat widget ──────────────────────────────────────
interface StatWidgetProps {
  title: string
  icon: string
  rows: Array<{ label: string; value: string | number }>
}

export function StatWidget({ title, icon, rows }: StatWidgetProps) {
  return (
    <>
      <div className="px-4 py-3 border-b border-border text-xs font-bold text-ink flex items-center gap-2">
        <span>{icon}</span> {title}
      </div>
      <div className="divide-y divide-border">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
            <span className="text-ink-2">{r.label}</span>
            <span className="font-mono font-semibold text-ink">{r.value}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Source widget ─────────────────────────────────────────────
interface SourceWidgetProps {
  sources: Array<{ name: string; count: number; color: string }>
}

export function SourceWidget({ sources }: SourceWidgetProps) {
  return (
    <div className="bg-white border border-border rounded-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border text-xs font-bold text-ink flex items-center gap-2">
        <span>🔗</span> Sumber Data
      </div>
      <div className="divide-y divide-border">
        {sources.map(s => (
          <div key={s.name} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-[13px] font-medium text-ink flex-1">{s.name}</span>
            <span className="text-[11px] font-mono text-ink-3">{s.count} artikel</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Info widget ───────────────────────────────────────────────
export function InfoWidget({ title, icon, children }: {
  title: string; icon: string; children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-border rounded-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border text-xs font-bold text-ink flex items-center gap-2">
        <span>{icon}</span> {title}
      </div>
      <div className="px-4 py-3 text-[13px] text-ink-2 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}
