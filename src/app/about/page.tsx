// src/app/about/page.tsx
import { StatWidget, InfoWidget } from '@/components/layout/Sidebar'

const MEMBERS = [
  { initials: 'EV', name: 'Evelly Khanzani Putri', role: 'Ketua Umum' },
  { initials: 'FA', name: 'Fauzan Abrar Putra Syadeva', role: 'Wakil Ketua' },
  { initials: 'FA', name: 'Faezya', role: 'Div. Penelitian' },
  { initials: 'ZA', name: 'Zahra Aisyah', role: 'Div. Teknologi' },
  { initials: 'BM', name: 'Bagas Mahendra', role: 'Div. Publikasi' },
  { initials: 'DK', name: 'Dinda Kusuma', role: 'Sekretaris' },
]

const ACTIVITIES = [
  { icon: '🧪', title: 'Riset Rutin Mingguan', desc: 'Setiap Sabtu — presentasi progres penelitian & review jurnal internasional' },
  { icon: '🏆', title: 'Persiapan Kompetisi', desc: 'LKIR, OPSI, ISEF Indonesia, Young Scientists Award — bimbingan mentor' },
  { icon: '🎓', title: 'Workshop Metodologi', desc: 'Pelatihan penulisan karya ilmiah, statistik, dan penggunaan alat lab' },
  { icon: '🌐', title: 'EROBO AI Development', desc: 'Pengembangan platform Agentic AI untuk eksplorasi ide riset siswa' },
  { icon: '📰', title: 'KIR Journal Club', desc: 'Bedah jurnal ilmiah setiap bulan — melatih kemampuan membaca literatur' },
]

const TECH_STACK = [
  { label: 'Frontend', value: 'Next.js 14' },
  { label: 'Styling', value: 'Tailwind CSS' },
  { label: 'Backend', value: 'Node.js API Routes' },
  { label: 'AI Engine', value: 'Gemini 1.5 Flash' },
  { label: 'AI Type', value: 'Agentic AI System' },
  { label: 'Database', value: 'Supabase / PostgreSQL' },
  { label: 'Sumber Data', value: 'arXiv + RSS Feeds' },
  { label: 'Scheduler', value: 'Vercel Cron' },
  { label: 'Deploy', value: 'Vercel' },
]

export default function AboutPage() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-9">
          <p className="text-[11px] font-mono font-medium text-accent tracking-widest uppercase mb-2">
            // Tentang Platform
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">EROBO AI</h1>
          <p className="text-[15px] font-serif italic text-ink-2">
            Platform Agentic AI untuk eksplorasi ide penelitian berbasis data real-time
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-7">

          {/* LEFT */}
          <div className="space-y-5">

            {/* Tentang AI */}
            <div className="bg-white border border-border rounded-card p-7">
              <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <span>🤖</span> Tentang EROBO AI
              </h2>
              <p className="text-[14px] text-ink-2 leading-relaxed mb-3">
                EROBO AI adalah platform berbasis Agentic AI yang dirancang untuk membantu siswa
                menemukan ide penelitian secara otomatis berdasarkan data riset terbaru dari berbagai sumber ilmiah.
              </p>
              <p className="text-[14px] text-ink-2 leading-relaxed mb-3">
                Sistem ini bekerja secara otonom dengan mengumpulkan data dari internet,
                menganalisis tren penelitian, dan mengidentifikasi research gap yang berpotensi
                dikembangkan menjadi karya ilmiah.
              </p>
              <p className="text-[14px] text-ink-2 leading-relaxed">
                Platform ini diimplementasikan pada KIR EROBO sebagai studi kasus,
                namun dirancang agar dapat digunakan oleh berbagai organisasi siswa
                seperti KIR, OSIS, maupun ekstrakurikuler lainnya di berbagai sekolah.
              </p>
            </div>

            {/* Agentic */}
            <div className="bg-white border border-border rounded-card p-7">
              <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <span>⚙️</span> Cara Kerja Agentic AI
              </h2>
              <div className="space-y-3 text-[14px] text-ink-2">
                <p>• Mengambil data penelitian terbaru dari arXiv & RSS secara otomatis</p>
                <p>• Menganalisis tren dan topik menggunakan AI</p>
                <p>• Mengidentifikasi research gap</p>
                <p>• Menghasilkan ide penelitian baru setiap hari</p>
              </div>
            </div>

            {/* KIR (dipindah jadi pendukung) */}
            <div className="bg-white border border-border rounded-card p-7">
              <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <span>🏫</span> Implementasi: KIR EROBO
              </h2>
              <p className="text-[14px] text-ink-2 leading-relaxed mb-3">
                KIR EROBO (Eksperimen Riset & Observasi) adalah kelompok ilmiah remaja
                yang berfokus pada penelitian berbasis sains dan teknologi sejak 2018.
              </p>
              <p className="text-[14px] text-ink-2 leading-relaxed">
                Platform ini digunakan secara aktif oleh anggota untuk membantu menemukan ide penelitian,
                meningkatkan kualitas karya ilmiah, dan mempercepat proses eksplorasi topik riset.
              </p>
            </div>

            {/* Members */}
            <div className="bg-white border border-border rounded-card p-7">
              <h2 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                <span>👥</span> Pengurus KIR 2025/2026
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MEMBERS.map(m => (
                  <div key={m.name} className="bg-surface rounded-lg border border-border p-4 text-center">
                    <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-[#7AE5B0] font-mono text-xs mx-auto mb-2.5">
                      {m.initials}
                    </div>
                    <p className="text-[13px] font-bold text-ink">{m.name}</p>
                    <p className="text-[11px] text-ink-3">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <aside className="space-y-4">

            <div className="bg-white border border-border rounded-card overflow-hidden">
              <StatWidget
                title="Implementasi Sistem"
                icon="📡"
                rows={[
                  { label: 'Digunakan oleh', value: 'KIR EROBO' },
                  { label: 'Status', value: 'Aktif' },
                  { label: 'Update AI', value: 'Harian' },
                  { label: 'Mode', value: 'Multi-organisasi' },
                ]}
              />
            </div>

            <div className="bg-white border border-border rounded-card overflow-hidden">
              <StatWidget
                title="Teknologi EROBO AI"
                icon="🛠"
                rows={TECH_STACK}
              />
            </div>

            <InfoWidget title="📬 Kontak" icon="">
              <p>Tertarik menggunakan platform ini di sekolahmu?</p>
              <p className="font-mono text-[12px] text-accent">kir.erobo@sekolah.sch.id</p>
              <p className="text-[12px] text-ink-3">Instagram: @kir.erobo</p>
            </InfoWidget>

          </aside>
        </div>
      </div>
    </div>
  )
}