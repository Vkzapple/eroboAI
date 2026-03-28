import type { ResearchGap } from '@/types'

interface Props {
  gap: ResearchGap
  index: number
}

const levelConfig = {
  kritis: { label: 'Kritis', cls: 'bg-red-50 text-red-700 border-red-100' },
  moderat: { label: 'Moderat', cls: 'bg-orange-50 text-orange-700 border-orange-100' },
  baru: { label: 'Baru', cls: 'bg-blue-50 text-blue-700 border-blue-100' },
  rendah: { label: 'Rendah', cls: 'bg-surface-2 text-ink-3 border-border' },
}

const diffConfig = {
  mudah: { label: 'Mudah', cls: 'text-accent' },
  sedang: { label: 'Sedang', cls: 'text-orange-600' },
  sulit: { label: 'Sulit', cls: 'text-red-600' },
}

export function GapCard({ gap, index }: Props) {
  const num = String(index + 1).padStart(2, '0')
  const lvl = levelConfig[gap.level] || levelConfig.rendah
  const diff = diffConfig[gap.difficulty] || diffConfig.sedang

  return (
    <article className="bg-white border border-border rounded-card p-6 hover:border-border-2 hover:shadow-card-hover transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-blue-DEFAULT scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="flex items-start justify-between gap-4 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border ${lvl.cls}`}>
          ◆ {lvl.label}
        </span>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold font-mono text-ink leading-none">
            {gap.relevance_score}<span className="text-xs font-normal text-ink-3">/100</span>
          </div>
          <div className="text-[10px] font-mono text-ink-3 mt-0.5">skor relevansi</div>
        </div>
      </div>

      <div className="flex gap-3 mb-2">
        <span className="text-[11px] font-mono text-ink-3 shrink-0 mt-0.5">{num}</span>
        <h3 className="text-[16px] font-bold text-ink leading-snug">{gap.title}</h3>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-accent mb-3 ml-6">
        ⚡ {gap.field}
        <span className="text-ink-3 font-normal">·</span>
        <span className={diff.cls}>{diff.label}</span>
      </div>

      <div className="ml-6 mb-4">
        <div className="bg-surface rounded-lg border-l-2 border-border-2 px-3.5 py-2.5">
          <p className="text-[11px] font-mono text-ink-3 mb-1 uppercase tracking-wide font-semibold">Alasan Gap:</p>
          <p className="text-[13px] font-serif italic text-ink-2 leading-relaxed">{gap.reason}</p>
        </div>
      </div>

      {gap.opportunity && (
        <div className="ml-6 mb-4 bg-accent-light rounded-lg px-3.5 py-2.5 border border-accent-border">
          <p className="text-[11px] font-mono text-accent mb-1 uppercase tracking-wide font-semibold">Peluang untuk KIR:</p>
          <p className="text-[13px] text-ink-2 leading-relaxed">{gap.opportunity}</p>
        </div>
      )}

      <div className="ml-6 flex flex-wrap gap-1.5 mb-4">
        {gap.tags?.map(tag => (
          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-ink-2 border border-border">{tag}</span>
        ))}
      </div>

      <div className="ml-6 flex items-center gap-2 mb-4">
        <span className="text-[10px] font-mono text-ink-3 w-16 shrink-0">Relevansi</span>
        <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-accent" style={{ width: `${gap.relevance_score}%` }} />
        </div>
        <span className="text-[11px] font-mono font-semibold text-accent w-8 text-right">{gap.relevance_score}%</span>
      </div>

      <div className="ml-6">
        <button className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light border border-accent-border px-3.5 py-2 rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-200">
          Kembangkan Ide Ini →
        </button>
      </div>
    </article>
  )
}
