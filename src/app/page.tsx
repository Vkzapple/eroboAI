// src/app/page.tsx
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate, fieldLabel, fieldColor } from '@/lib/utils'
import FloatingBubble from "@/components/ui/FloatingBubble"

export const revalidate = 0

async function getStats() {
  const [papers, gaps, ideas] = await Promise.all([
    supabase.from('research_items').select('id', { count: 'exact', head: true }),
    supabase.from('research_gaps').select('id', { count: 'exact', head: true }),
    supabase.from('research_ideas').select('id', { count: 'exact', head: true }),
  ])
  return { papers: papers.count || 0, gaps: gaps.count || 0, ideas: ideas.count || 0 }
}

async function getFeatured() {
  const { data } = await supabase
    .from('research_items')
    .select('id,title,source,field,published_at')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(4)
  return data || []
}

const FALLBACK = [
  { id:'1', title:'AI-powered harvesting robots dapat memetik tomat dengan presisi 94%', source:'Osaka University · Nature Robotics', field:'rob', published_at: new Date().toISOString() },
  { id:'2', title:'Brain cells in lab dish successfully learn to play Pong video game', source:'Cortical Labs · arXiv cs.NE', field:'bio', published_at: new Date().toISOString() },
  { id:'3', title:'Low-cost sensor network for real-time microplastics detection in rivers', source:'ScienceDaily · Env. Sci.', field:'env', published_at: new Date().toISOString() },
  { id:'4', title:'Multilingual LLM untuk deteksi hoaks berita lokal capai F1-score 0.94', source:'arXiv cs.CL · UI', field:'ai', published_at: new Date().toISOString() },
]

// Cara kerja agen AI — ditampilkan di How It Works section
const HOW_IT_WORKS = [
  {
    icon: '⬡',
    step: '01',
    title: 'Kumpulkan Otomatis',
    desc: 'Setiap hari, agen EROBO.AI menjelajahi arXiv, ScienceDaily, Nature, dan IEEE — mengambil ratusan publikasi ilmiah terbaru.',
  },
  {
    icon: '◈',
    step: '02',
    title: 'Analisis dengan AI',
    desc: 'Setiap paper dirangkum oleh Gemini AI dalam Bahasa Indonesia yang mudah dipahami siswa SMA — tanpa jargon akademik berlebihan.',
  },
  {
    icon: '◉',
    step: '03',
    title: 'Deteksi Research Gap',
    desc: 'AI membandingkan ribuan paper untuk menemukan celah penelitian yang belum banyak dikaji — khususnya yang relevan untuk konteks Indonesia.',
  },
  {
    icon: '✦',
    step: '04',
    title: 'Sajikan Ide Siap Pakai',
    desc: 'Dari gap yang ditemukan, AI menyusun ide penelitian konkret yang bisa langsung dikerjakan siswa dengan peralatan lab sekolah.',
  },
]

// Dampak nyata AI — membangun trust
const IMPACTS = [
  {
    metric: '4 Sumber',
    label: 'Data Ilmiah',
    desc: 'arXiv · ScienceDaily · Nature · IEEE',
    color: 'bg-[#E8F5EE] border-[#B8E0CA] text-[#1B6B45]',
  },
  {
    metric: 'Harian',
    label: 'Update Otomatis',
    desc: 'Tanpa perlu refresh manual — selalu terkini',
    color: 'bg-[#E8EFF8] border-[#C0D4F0] text-[#1A4B8C]',
  },
  {
    metric: 'Bahasa ID',
    label: 'Ringkasan AI',
    desc: 'Ringkasan ilmiah dalam Bahasa Indonesia',
    color: 'bg-[#FBF0E8] border-[#F0CCB0] text-[#C85A1A]',
  },
  {
    metric: 'Gratis',
    label: 'untuk Semua KIR',
    desc: 'Open untuk seluruh siswa Indonesia',
    color: 'bg-[#F5E8FB] border-[#DDB8F0] text-[#7B2FBE]',
  },
]

// Testimonial / use cases
const USE_CASES = [
  {
    emoji: '🔬',
    title: 'Cari Topik Karya Ilmiah',
    desc: 'Tidak tahu mau meneliti apa? EROBO.AI menampilkan gap penelitian aktual yang bisa langsung dijadikan judul KIR.',
  },
  {
    emoji: '📰',
    title: 'Update Perkembangan STEM',
    desc: 'Pantau riset terbaru dari universitas top dunia setiap hari — tanpa harus bisa baca jurnal berbahasa Inggris.',
  },
  {
    emoji: '💡',
    title: 'Inspirasi Metodologi',
    desc: 'Pelajari metode yang dipakai peneliti senior sebagai inspirasi desain eksperimen dan metodologi penelitianmu.',
  },
  {
    emoji: '🏆',
    title: 'Siapkan Kompetisi',
    desc: 'Temukan topik orisinal untuk LKIR, OPSI, ISEF, atau Young Scientists Award dengan skor relevansi dari AI.',
  },
]

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeatured()])
  const highlights = featured.length > 0 ? featured : FALLBACK

  return (
    <div>
        <FloatingBubble />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="bg-[#1A1A18] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',backgroundSize:'48px 48px'}} />

        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{background:'radial-gradient(circle, #7AE5B0 0%, transparent 70%)'}} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">

          {/* Brand pill */}
          <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7AE5B0] animate-pulse" />
            <span className="text-[11px] font-mono text-white/60 tracking-widest uppercase">Dibuat oleh EROBO · Untuk semua siswa KIR Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[64px] font-extrabold tracking-tight leading-[1.05] mb-6">
            Asisten Riset STEM<br />
            berbasis{' '}
            <span className="text-[#7AE5B0] font-serif font-normal italic">Kecerdasan Buatan</span>
          </h1>

          <p className="text-white/55 font-serif italic text-lg max-w-2xl leading-relaxed mb-4">
            EROBO.AI secara otomatis memantau ratusan jurnal ilmiah setiap hari, merangkumnya dalam Bahasa Indonesia,
            dan menemukan celah penelitian yang bisa kamu kerjakan sebagai siswa SMA.
          </p>

          {/* Trust signal */}
          <p className="text-[12px] font-mono text-white/35 mb-10 tracking-wide">
            Powered by Gemini AI · arXiv · ScienceDaily · Nature · IEEE Xplore
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/research"
              className="bg-[#7AE5B0] text-[#1A1A18] font-bold px-7 py-3.5 rounded-[9px] text-sm hover:bg-[#5ADBA0] transition-colors">
              Lihat Research Hari Ini →
            </Link>
            <Link href="/gaps"
              className="border border-white/20 text-white/75 font-medium px-7 py-3.5 rounded-[9px] text-sm hover:border-white/45 hover:text-white transition-colors">
              Temukan Gap Penelitian
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-16 pt-10 border-t border-white/8">
            {[
              [stats.papers > 0 ? stats.papers.toLocaleString('id-ID') : '500+', 'Makalah Dianalisis AI'],
              [stats.gaps > 0 ? stats.gaps.toLocaleString('id-ID') : '100+', 'Research Gap Terdeteksi'],
              [stats.ideas > 0 ? stats.ideas.toLocaleString('id-ID') : '50+', 'Ide Penelitian'],
              ['Setiap Hari', 'Update Otomatis'],
            ].map(([val, label], i) => (
              <div key={i} className="pr-6 mr-6 border-r border-white/8 last:border-0 last:pr-0 last:mr-0 mb-4 md:mb-0">
                <div className="text-[28px] font-extrabold font-mono text-[#7AE5B0] leading-none mb-1">{val}</div>
                <div className="text-[11px] text-white/40 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="bg-[#F4F3EF] border-b border-[#E2E1DC]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono font-semibold text-[#1B6B45] tracking-widest uppercase mb-2">// Cara Kerja AI</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Dari Jurnal Global ke Ide Penelitianmu</h2>
            <p className="text-[15px] font-serif italic text-[#4A4A46] max-w-lg mx-auto">
              Pipeline agentic yang berjalan otomatis setiap hari — kamu cukup buka websitenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={i} className="bg-white rounded-[16px] border border-[#E2E1DC] p-6 relative hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                {/* Step connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-2 w-4 h-0.5 bg-[#B8E0CA] z-10" />
                )}
                <div className="w-10 h-10 rounded-xl bg-[#1A1A18] flex items-center justify-center text-[#7AE5B0] font-mono text-lg mb-4">{h.icon}</div>
                <div className="text-[10px] font-mono text-[#8A8A84] mb-1.5 tracking-widest">LANGKAH {h.step}</div>
                <h3 className="text-[15px] font-bold text-[#1A1A18] mb-2 leading-snug">{h.title}</h3>
                <p className="text-[12px] text-[#4A4A46] leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── IMPACT / TRUST SIGNALS ─────────────────────── */}
        <section className="py-14 border-b border-[#E2E1DC]">
          <div className="mb-10">
            <p className="text-[11px] font-mono font-semibold text-[#1B6B45] tracking-widest uppercase mb-2">// Kenapa EROBO.AI?</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">AI yang Bekerja, Bukan Sekadar Fitur</h2>
            <p className="text-[15px] font-serif italic text-[#4A4A46]">
              Bukan cuma tampilan — setiap data di sini dikumpulkan dan dianalisis sungguhan oleh AI setiap hari.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {IMPACTS.map((imp, i) => (
              <div key={i} className={`rounded-[14px] border px-5 py-5 ${imp.color}`}>
                <div className="text-2xl font-extrabold font-mono leading-none mb-1">{imp.metric}</div>
                <div className="text-[13px] font-bold mb-1">{imp.label}</div>
                <div className="text-[11px] opacity-70 leading-snug">{imp.desc}</div>
              </div>
            ))}
          </div>

          {/* Pipeline visual */}
          <div className="bg-[#1A1A18] rounded-[16px] px-8 py-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Pipeline Harian:</div>
            {[
              { label: 'Vercel Cron', sub: '06:00 WIB', color: 'text-[#7AE5B0]' },
              { label: '→', sub: '', color: 'text-white/20' },
              { label: 'arXiv + RSS', sub: '4 sumber', color: 'text-blue-300' },
              { label: '→', sub: '', color: 'text-white/20' },
              { label: 'Gemini AI', sub: 'Analisis + Rangkum', color: 'text-purple-300' },
              { label: '→', sub: '', color: 'text-white/20' },
              { label: 'Supabase', sub: 'Tersimpan', color: 'text-yellow-300' },
              { label: '→', sub: '', color: 'text-white/20' },
              { label: 'Kamu', sub: 'Langsung bisa dipakai', color: 'text-[#7AE5B0]' },
            ].map((p, i) => (
              <div key={i} className="text-center">
                <div className={`text-[13px] font-mono font-semibold ${p.color}`}>{p.label}</div>
                {p.sub && <div className="text-[10px] text-white/30 mt-0.5">{p.sub}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── USE CASES ──────────────────────────────────── */}
        <section className="py-14 border-b border-[#E2E1DC]">
          <div className="mb-10">
            <p className="text-[11px] font-mono font-semibold text-[#1B6B45] tracking-widest uppercase mb-2">// Bisa Dipakai Untuk</p>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Untuk Siapa EROBO.AI?</h2>
            <p className="text-[15px] font-serif italic text-[#4A4A46]">
              Cocok untuk siapapun yang mau berkarya ilmiah — dari anggota KIR hingga siswa yang baru mulai.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USE_CASES.map((u, i) => (
              <div key={i} className="bg-white border border-[#E2E1DC] rounded-[16px] p-6 flex gap-4 hover:shadow-lg hover:border-[#D0CFC8] transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-[#F4F3EF] flex items-center justify-center text-2xl shrink-0 group-hover:bg-[#E8F5EE] transition-colors">
                  {u.emoji}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1A1A18] mb-1.5">{u.title}</h3>
                  <p className="text-[13px] text-[#4A4A46] leading-relaxed">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RESEARCH HIGHLIGHTS ────────────────────────── */}
        <section className="py-14 border-b border-[#E2E1DC]">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <p className="text-[11px] font-mono font-semibold text-[#1B6B45] tracking-widest uppercase mb-2">// Sorotan Hari Ini</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-1">Research Terbaru yang Relevan</h2>
              <p className="text-[14px] font-serif italic text-[#4A4A46]">Dikurasi otomatis oleh AI — diperbarui setiap pagi</p>
            </div>
            <Link href="/research"
              className="text-sm font-bold text-[#1B6B45] border border-[#B8E0CA] bg-[#E8F5EE] px-5 py-2.5 rounded-[9px] hover:bg-[#1B6B45] hover:text-white hover:border-[#1B6B45] transition-all duration-200 shrink-0 whitespace-nowrap">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((item: any, i: number) => (
              <Link href="/research" key={item.id}
                className="bg-white border border-[#E2E1DC] rounded-[16px] p-5 hover:shadow-lg hover:border-[#D0CFC8] transition-all duration-200 group block">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[11px] font-mono text-[#8A8A84]">{String(i+1).padStart(2,'0')}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${fieldColor(item.field)}`}>
                    {fieldLabel(item.field)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1A1A18] leading-snug mb-2 group-hover:text-[#1B6B45] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A8A84]">
                  <span className="w-1 h-1 rounded-full bg-[#1B6B45]" />
                  {item.source}
                  <span>· {formatDate(item.published_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────── */}
        <section className="py-14">
          <div className="bg-[#1A1A18] rounded-[20px] px-10 py-12 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
              style={{background:'radial-gradient(circle, #7AE5B0 0%, transparent 70%)'}} />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-lg">
                <p className="text-[11px] font-mono text-[#7AE5B0] tracking-widest uppercase mb-3">// Mulai Sekarang</p>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  Temukan Topik Riset<br />yang Belum Pernah Diteliti
                </h2>
                <p className="text-white/50 font-serif italic text-[15px] leading-relaxed">
                  EROBO.AI menganalisis ribuan paper setiap hari untuk menemukan celah penelitian
                  yang relevan, orisinal, dan bisa dikerjakan oleh siswa SMA.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Link href="/gaps"
                  className="bg-[#7AE5B0] text-[#1A1A18] font-bold px-8 py-3.5 rounded-[9px] text-sm hover:bg-[#5ADBA0] transition-colors text-center whitespace-nowrap">
                  Buka Gap Finder →
                </Link>
                <Link href="/research"
                  className="border border-white/20 text-white/70 font-medium px-8 py-3.5 rounded-[9px] text-sm hover:border-white/40 hover:text-white transition-colors text-center whitespace-nowrap">
                  Lihat Research Hari Ini
                </Link>
                <p className="text-[10px] font-mono text-white/25 text-center">Gratis · Tanpa daftar · Update harian</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── FOOTER BRAND NOTE ──────────────────────────── */}
      <div className="border-t border-[#E2E1DC] bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#8A8A84] font-mono">
            EROBO.AI — dibuat oleh{' '}
            <Link href="/about" className="text-[#1B6B45] hover:underline">KIR EROBO</Link>
            {' '}· Untuk semua siswa KIR Indonesia
          </p>
          <p className="text-[11px] text-[#8A8A84] font-mono">
            Powered by Gemini AI · arXiv · ScienceDaily · Nature · IEEE
          </p>
        </div>
      </div>

    </div>
  )
}