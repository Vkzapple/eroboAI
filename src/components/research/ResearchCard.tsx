// src/components/research/ResearchCard.tsx
import type { ResearchItem } from '@/types'
import { formatDate, fieldLabel, fieldColor } from '@/lib/utils'

interface Props {
  item: ResearchItem
  index: number
}

export function ResearchCard({ item, index }: Props) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="research-card-accent relative bg-white border border-border rounded-card p-6 hover:border-border-2 hover:shadow-card-hover transition-all duration-200 overflow-hidden">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[11px] font-mono text-ink-3 shrink-0 mt-0.5">{num}</span>
        <div className="flex gap-1.5 flex-wrap flex-1">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${fieldColor(item.field)}`}>
            {fieldLabel(item.field)}
          </span>
          {item.fields?.slice(1, 3).map(f => (
            <span key={f} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-2 text-ink-2 border border-border">
              {f}
            </span>
          ))}
          {item.is_featured && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-accent-light text-accent border border-accent-border">
              ★ Pilihan
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono text-ink-3 shrink-0">{formatDate(item.published_at)}</span>
      </div>

      {/* Title */}
      <h3 className="text-[17px] font-bold text-ink leading-snug mb-2.5 text-balance">
        {item.title}
      </h3>

      {/* Source */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-ink-3 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
        {item.source}
        {item.authors?.length ? ` · ${item.authors.slice(0, 2).join(', ')}` : ''}
      </div>

      {/* AI Summary */}
      <div className="bg-surface rounded-lg border-l-2 border-border-2 px-4 py-3 mb-5">
        <p className="text-[13px] font-serif italic text-ink-2 leading-relaxed">
          <strong className="font-sans not-italic font-semibold text-ink-2 text-xs uppercase tracking-wide mr-1">
            Ringkasan AI:
          </strong>
          {item.summary_ai}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-accent bg-accent-light border border-accent-border px-3.5 py-2 rounded-lg hover:bg-accent hover:text-white hover:border-accent transition-all duration-200"
        >
          Baca Lebih Lanjut
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-ink-3">Relevansi</span>
          <div className="w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${item.relevance_score}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-medium text-accent">{item.relevance_score}</span>
        </div>
      </div>
    </article>
  )
}
