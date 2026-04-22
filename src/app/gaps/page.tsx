'use client'
// src/app/gaps/page.tsx
import { useState } from 'react'
import type { ResearchGap } from '@/types'

// ── Modal Kembangkan Ide ──────────────────────────────────────
function IdeModal({ gap, onClose }: { gap: ResearchGap; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] max-w-lg w-full p-7 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F4F3EF] text-[#8A8A84] hover:bg-[#EDECEA] text-lg font-bold transition-colors"
        >×</button>

        <div className="mb-5">
          <span className="text-[10px] font-mono font-bold text-[#1B6B45] bg-[#E8F5EE] border border-[#B8E0CA] px-2 py-1 rounded-md uppercase tracking-wide">
            💡 Panduan Pengembangan Ide
          </span>
          <h2 className="text-[17px] font-extrabold text-[#1A1A18] leading-snug mt-3 mb-1">{gap.title}</h2>
          <p className="text-[11px] font-mono text-[#1B6B45]">⚡ {gap.field}</p>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { step:'01', title:'Rumuskan Judul', desc:`Buat judul spesifik dari gap ini. Contoh: "Pengaruh ${(gap.tags?.[0]||'X')} terhadap ${(gap.tags?.[1]||'Y')} di Lingkungan Sekolah"` },
            { step:'02', title:'Tentukan Variabel', desc:'Tentukan variabel bebas, terikat, dan kontrol. Pastikan bisa diukur dengan alat yang tersedia di lab sekolah.' },
            { step:'03', title:'Kumpulkan Referensi', desc:'Cari 5–10 jurnal terkait di Google Scholar atau arXiv. Kutip alasan mengapa gap ini belum banyak diteliti.' },
            { step:'04', title:'Buat Proposal', desc:'Susun latar belakang, rumusan masalah, tujuan, hipotesis, dan metodologi. Konsultasikan dengan pembina KIR.' },
          ].map(s => (
            <div key={s.step} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-[#1B6B45] text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">{s.step}</span>
              <div>
                <p className="text-[13px] font-bold text-[#1A1A18] mb-0.5">{s.title}</p>
                <p className="text-[12px] text-[#4A4A46] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {gap.tags?.map(t => (
            <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4F3EF] text-[#4A4A46] border border-[#E2E1DC]">{t}</span>
          ))}
        </div>

        <div className="flex gap-2">
          <a href={`https://scholar.google.com/scholar?q=${encodeURIComponent(gap.title)}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-[12px] font-bold text-[#1B6B45] bg-[#E8F5EE] border border-[#B8E0CA] px-4 py-2.5 rounded-lg hover:bg-[#1B6B45] hover:text-white hover:border-[#1B6B45] transition-all duration-200">
            Cari di Google Scholar →
          </a>
          <a href={`https://arxiv.org/search/?query=${encodeURIComponent(gap.title)}&searchtype=all`} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-[12px] font-bold text-[#1A4B8C] bg-[#E8EFF8] border border-[#C0D4F0] px-4 py-2.5 rounded-lg hover:bg-[#1A4B8C] hover:text-white hover:border-[#1A4B8C] transition-all duration-200">
            Cari di arXiv →
          </a>
        </div>
      </div>
    </div>
  )
}

const FALLBACK_GAPS: ResearchGap[] = [
  {id:'1',title:'IoT monitoring sampah sekolah berbasis machine learning',field:'Lingkungan + AI',related_fields:['IoT','ML'],reason:'Belum banyak penelitian pada skala sekolah. Hampir semua studi IoT sampah fokus pada skala kota atau TPA, bukan unit sekolah dengan karakteristik unik.',opportunity:'Bangun sensor berat + kamera murah di tempat sampah sekolah dan latih model klasifikasi jenis sampah dengan dataset lokal.',difficulty:'sedang',level:'kritis',relevance_score:93,tags:['IoT','ML','Sampah','Sekolah','Lingkungan'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'2',title:'AI monitoring kualitas udara dalam kelas menggunakan sensor murah',field:'Lingkungan + AI',related_fields:['Sensor','AI'],reason:'Research masih fokus pada outdoor dan kota besar. Data kualitas udara indoor — khususnya di kelas sekolah Indonesia — hampir tidak ada di literatur internasional.',opportunity:'Pasang sensor CO2 + PM2.5 di beberapa kelas, kumpulkan data harian, dan analisis korelasi dengan produktivitas belajar.',difficulty:'mudah',level:'kritis',relevance_score:90,tags:['Air Quality','Indoor','Sensor','Classroom'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'3',title:'Deteksi cyberbullying bahasa daerah (Jawa, Sunda, Bugis)',field:'NLP + Sosial',related_fields:['NLP','Bahasa Daerah'],reason:'Model NLP untuk bahasa daerah Indonesia sangat langka. Corpus dan penelitian bahasa Jawa, Sunda, Bugis untuk deteksi ujaran kebencian hampir tidak ada di literatur global.',opportunity:'Kumpulkan dataset komentar media sosial berbahasa Jawa/Sunda, fine-tune IndoBERT, dan evaluasi performanya pada 500+ sampel.',difficulty:'sulit',level:'kritis',relevance_score:87,tags:['NLP','Bahasa Daerah','Cyberbullying','BERT'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'4',title:'Bioplastik dari limbah organik lokal: kulit pisang kepok & daun nanas',field:'Kimia + Lingkungan',related_fields:['Kimia','Bioplastik'],reason:'Potensi limbah pisang dan nanas Indonesia yang melimpah belum banyak dikaji sebagai bahan baku bioplastik.',opportunity:'Ekstrak pati dari kulit pisang kepok, cetak film bioplastik, uji mekanik dan degradabilitas selama 30 hari.',difficulty:'sedang',level:'moderat',relevance_score:79,tags:['Bioplastik','Pisang','Nanas','Kimia Hijau'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'5',title:'Sistem early warning longsor menggunakan akselerometer & ML',field:'Geoteknik + AI',related_fields:['IoT','Geoteknik'],reason:'Penelitian early warning longsor berbasis sensor murah di pemukiman padat Indonesia sangat terbatas.',opportunity:'Pasang akselerometer + sensor kelembaban tanah di 3 titik lereng, kumpulkan data 2 minggu, bangun model prediksi sederhana.',difficulty:'sedang',level:'moderat',relevance_score:74,tags:['Longsor','IoT','Akselerometer','Early Warning'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'6',title:'Efek musik gamelan pada konsentrasi belajar siswa SMA',field:'Psikologi + Neurosains',related_fields:['Psikologi','Gamelan'],reason:'Studi musik tradisional Indonesia dan efeknya pada fungsi kognitif hampir tidak ada di literatur global.',opportunity:'Uji konsentrasi siswa sebelum/sesudah mendengarkan gamelan vs musik pop selama 15 menit dengan tes standar.',difficulty:'mudah',level:'moderat',relevance_score:70,tags:['Gamelan','Konsentrasi','Neurosains','Psikologi'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'7',title:'Penggunaan AI generatif untuk aksesibilitas buku teks siswa disabilitas visual',field:'EdTech + AI',related_fields:['AI Generatif','Aksesibilitas'],reason:'Gap antara teknologi AI generatif dan kebutuhan siswa tunanetra Indonesia belum pernah dijembatani dalam penelitian akademik lokal.',opportunity:'Bangun prototype yang mengubah halaman buku teks menjadi audio deskriptif menggunakan Gemini API.',difficulty:'sedang',level:'baru',relevance_score:66,tags:['AI Generatif','Aksesibilitas','EdTech','Inklusif'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
  {id:'8',title:'Kompos cerdas berbasis sensor pH & kelembaban untuk taman sekolah',field:'Pertanian + IoT',related_fields:['IoT','Kompos'],reason:'Aplikasi IoT untuk optimasi komposting skala taman sekolah belum ada dalam literatur Indonesia.',opportunity:'Buat komposer dengan sensor pH, suhu, dan kelembaban (Arduino), kumpulkan data 4 minggu, analisis kondisi optimal.',difficulty:'mudah',level:'baru',relevance_score:63,tags:['Kompos','Sensor pH','IoT','Pertanian'],source_papers:[],generated_at:new Date().toISOString(),created_at:new Date().toISOString()},
]

const LEVELS=[{key:'semua',label:'Semua'},{key:'kritis',label:'Kritis'},{key:'moderat',label:'Moderat'},{key:'baru',label:'Baru'}]
const LVL:{[k:string]:{l:string,c:string}}={kritis:{l:'Kritis',c:'bg-red-50 text-red-700 border border-red-100'},moderat:{l:'Moderat',c:'bg-orange-50 text-orange-700 border border-orange-100'},baru:{l:'Baru',c:'bg-blue-50 text-blue-700 border border-blue-100'},rendah:{l:'Rendah',c:'bg-gray-50 text-gray-600 border border-gray-200'}}
const DIF:{[k:string]:{l:string,c:string}}={mudah:{l:'Mudah',c:'text-green-700'},sedang:{l:'Sedang',c:'text-orange-600'},sulit:{l:'Sulit',c:'text-red-600'}}

export default function GapsPage() {
  const [active,setActive]=useState('semua')
  const [selectedGap,setSelectedGap]=useState<ResearchGap|null>(null)
  const gaps=FALLBACK_GAPS
  const filtered=active==='semua'?gaps:gaps.filter(g=>g.level===active)

  // Real counts from data
  const counts = {
    kritis: gaps.filter(g=>g.level==='kritis').length,
    moderat: gaps.filter(g=>g.level==='moderat').length,
    baru: gaps.filter(g=>g.level==='baru').length,
    rendah: gaps.filter(g=>g.level==='rendah').length,
  }

  return (
    <div>
      {/* Modal */}
      {selectedGap && <IdeModal gap={selectedGap} onClose={()=>setSelectedGap(null)} />}

      <div className="bg-white border-b border-[#E2E1DC]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Research Gap Suggestions</h1>
          <p className="font-serif italic text-[#4A4A46] mb-5">Celah penelitian yang ditemukan agen AI — relevan untuk skala siswa SMA</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-mono font-semibold bg-[#E8F5EE] text-[#1B6B45] border border-[#B8E0CA] rounded-full px-3 py-1">{gaps.length} gap terdeteksi</span>
            <span className="text-[11px] font-mono font-semibold bg-red-50 text-red-700 border border-red-100 rounded-full px-3 py-1">{counts.kritis} gap kritis</span>
            <span className="text-[11px] font-mono font-semibold bg-[#E8EFF8] text-[#1A4B8C] border border-[#C0D4F0] rounded-full px-3 py-1">Disesuaikan untuk KIR SMA</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {LEVELS.map(l=>(
                <button key={l.key} onClick={()=>setActive(l.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${active===l.key?'bg-[#1B6B45] text-white border-[#1B6B45]':'bg-white text-[#4A4A46] border-[#E2E1DC] hover:border-[#D0CFC8]'}`}>
                  {l.label}
                  <span className={`text-[10px] font-mono ${active===l.key?'text-white/70':'text-[#8A8A84]'}`}>
                    {l.key==='semua'?gaps.length:gaps.filter(g=>g.level===l.key).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {filtered.map((gap,i)=>(
                <GapCard key={gap.id} gap={gap} index={i} onKembangkan={()=>setSelectedGap(gap)} />
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            {/* Fix 2: Tingkat Urgensi dengan data real */}
            <div className="bg-white border border-[#E2E1DC] rounded-[16px] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E2E1DC] text-[12px] font-bold">📈 Tingkat Urgensi</div>
              <div className="px-5 py-1">
                {[
                  ['🔴 Kritis', counts.kritis, 'text-red-600'],
                  ['🟠 Moderat', counts.moderat, 'text-orange-600'],
                  ['🔵 Baru terdeteksi', counts.baru, 'text-blue-600'],
                  ['⚪ Rendah', counts.rendah, 'text-gray-500'],
                  ['Total', gaps.length, 'text-[#1B6B45]'],
                ].map(([l,v,c])=>(
                  <div key={String(l)} className="flex items-center justify-between py-2.5 border-b border-[#E2E1DC] last:border-0">
                    <span className="text-[13px] text-[#4A4A46]">{l}</span>
                    <span className={`text-[13px] font-mono font-bold ${c}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E2E1DC] rounded-[16px] p-5">
              <p className="text-[12px] font-bold mb-2">💡 Cara Menggunakan</p>
              <p className="text-[13px] text-[#4A4A46] leading-relaxed mb-2">Gap dengan skor tinggi = lebih sedikit penelitian yang ada = peluang lebih besar untuk karya orisinal.</p>
              <p className="text-[13px] text-[#4A4A46] leading-relaxed">Pilih gap yang sesuai dengan fasilitas lab sekolahmu, lalu klik <strong className="text-[#1A1A18]">"Kembangkan Ide Ini"</strong> untuk panduan proposal.</p>
            </div>

            <div className="bg-[#1B6B45] rounded-[16px] p-5">
              <h3 className="text-[13px] font-bold text-white mb-1.5">Butuh bantuan proposal?</h3>
              <p className="text-[12px] text-white/70 font-serif italic">Klik "Kembangkan Ide Ini" di setiap card — akan muncul panduan lengkap + link pencarian jurnal.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function GapCard({gap,index,onKembangkan}:{gap:ResearchGap,index:number,onKembangkan:()=>void}) {
  const num=String(index+1).padStart(2,'0')
  const lvl=LVL[gap.level]||LVL.rendah
  const diff=DIF[gap.difficulty]||DIF.sedang
  return (
    <article className="bg-white border border-[#E2E1DC] rounded-[16px] p-6 hover:border-[#D0CFC8] hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1B6B45] to-[#1A4B8C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md ${lvl.c}`}>◆ {lvl.l}</span>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold font-mono leading-none">{gap.relevance_score}<span className="text-xs font-normal text-[#8A8A84]">/100</span></div>
          <div className="text-[10px] font-mono text-[#8A8A84]">skor relevansi</div>
        </div>
      </div>
      <div className="flex gap-3 mb-2">
        <span className="text-[11px] font-mono text-[#8A8A84] shrink-0 mt-0.5">{num}</span>
        <h3 className="text-[16px] font-bold text-[#1A1A18] leading-snug">{gap.title}</h3>
      </div>
      <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#1B6B45] mb-3 ml-6">
        ⚡ {gap.field} <span className="text-[#8A8A84] font-normal">·</span> <span className={diff.c}>{diff.l}</span>
      </div>
      <div className="ml-6 mb-4 bg-[#FAFAF8] rounded-lg border-l-2 border-[#D0CFC8] px-3.5 py-2.5">
        <p className="text-[11px] font-mono text-[#8A8A84] mb-1 uppercase tracking-wide font-semibold">Alasan Gap:</p>
        <p className="text-[13px] font-serif italic text-[#4A4A46] leading-relaxed">{gap.reason}</p>
      </div>
      {gap.opportunity&&(
        <div className="ml-6 mb-4 bg-[#E8F5EE] rounded-lg px-3.5 py-2.5 border border-[#B8E0CA]">
          <p className="text-[11px] font-mono text-[#1B6B45] mb-1 uppercase tracking-wide font-semibold">Peluang untuk KIR:</p>
          <p className="text-[13px] text-[#4A4A46] leading-relaxed">{gap.opportunity}</p>
        </div>
      )}
      <div className="ml-6 flex flex-wrap gap-1.5 mb-4">
        {gap.tags?.map(t=><span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4F3EF] text-[#4A4A46] border border-[#E2E1DC]">{t}</span>)}
      </div>
      <div className="ml-6 flex items-center gap-2 mb-4">
        <span className="text-[10px] font-mono text-[#8A8A84] w-16 shrink-0">Relevansi</span>
        <div className="flex-1 h-1.5 bg-[#EDECEA] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-[#1B6B45]" style={{width:`${gap.relevance_score}%`}} />
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#1B6B45] w-8 text-right">{gap.relevance_score}%</span>
      </div>
      <div className="ml-6">
        <button
          onClick={onKembangkan}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B6B45] bg-[#E8F5EE] border border-[#B8E0CA] px-3.5 py-2 rounded-lg hover:bg-[#1B6B45] hover:text-white hover:border-[#1B6B45] transition-all duration-200"
        >
          Kembangkan Ide Ini →
        </button>
      </div>
    </article>
  )
}