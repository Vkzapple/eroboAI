'use client'
// src/app/research/ResearchClientPage.tsx
import { useState } from 'react'
import type { ResearchItem } from '@/types'
import { fieldLabel, fieldColor, formatDate } from '@/lib/utils'

const FIELDS = [
  {key:'semua',label:'Semua Bidang'},{key:'ai',label:'AI & ML'},{key:'bio',label:'Biologi'},
  {key:'env',label:'Lingkungan'},{key:'phys',label:'Fisika'},{key:'math',label:'Matematika'},
  {key:'rob',label:'Robotika'},{key:'chem',label:'Kimia'},
]
const SOURCES = [
  {name:'arXiv.org',color:'#1B6B45'},{name:'ScienceDaily',color:'#1A4B8C'},
  {name:'IEEE Xplore',color:'#C85A1A'},{name:'Nature RSS',color:'#7B2FBE'},
]
const FALLBACK: ResearchItem[] = [
  {id:'1',title:'AI-powered harvesting robots dapat memetik tomat dengan presisi 94%',source:'Osaka University · Nature Robotics',authors:['K. Tanaka'],url:'https://arxiv.org',published_at:new Date().toISOString(),field:'rob',fields:['Robotika','Computer Vision'],summary_ai:'Peneliti mengembangkan robot panen AI yang mampu mengidentifikasi dan memetik tomat matang dengan efisiensi 94%, menggunakan computer vision dan gripper silikon lunak.',summary_original:'',relevance_score:88,is_featured:true,created_at:new Date().toISOString()},
  {id:'2',title:'Brain cells in lab dish successfully learn to play Pong video game',source:'Cortical Labs · arXiv cs.NE',authors:['B. Kagan'],url:'https://arxiv.org',published_at:new Date().toISOString(),field:'bio',fields:['Neurosains','AI'],summary_ai:'Sel-sel otak manusia yang ditumbuhkan dalam cawan petri berhasil dilatih memainkan Pong melalui sinyal listrik, membuka peluang baru komputasi biologis.',summary_original:'',relevance_score:82,is_featured:true,created_at:new Date().toISOString()},
  {id:'3',title:'Low-cost sensor network for real-time microplastics detection in river water',source:'ScienceDaily · Env. Sci. & Tech.',authors:['A. Smith'],url:'https://sciencedaily.com',published_at:new Date().toISOString(),field:'env',fields:['Lingkungan','IoT'],summary_ai:'Sistem sensor murah $12/unit mampu mendeteksi mikroplastik di sungai secara real-time — berpotensi besar untuk monitoring lingkungan Indonesia.',summary_original:'',relevance_score:94,is_featured:true,created_at:new Date().toISOString()},
  {id:'4',title:'Perovskite-silicon tandem solar cell mencapai efisiensi rekor 33.2%',source:'Helmholtz-Zentrum Berlin · Nature Energy',authors:['M. Becker'],url:'https://nature.com',published_at:new Date().toISOString(),field:'phys',fields:['Energi','Fisika'],summary_ai:'Sel surya tandem perovskite-silicon mencapai 33,2% efisiensi, memecahkan rekor dunia dan cocok untuk iklim tropis.',summary_original:'',relevance_score:79,is_featured:false,created_at:new Date().toISOString()},
  {id:'5',title:'Multilingual LLM untuk deteksi hoaks berita lokal capai F1-score 0.94',source:'arXiv cs.CL · Universitas Indonesia',authors:['R. Wirawan'],url:'https://arxiv.org',published_at:new Date().toISOString(),field:'ai',fields:['NLP','AI'],summary_ai:'Model bahasa multilingual yang dilatih pada dataset berita Indonesia mencapai F1-score 0,94 dalam deteksi hoaks.',summary_original:'',relevance_score:91,is_featured:true,created_at:new Date().toISOString()},
  {id:'6',title:'CRISPR-Cas9 berhasil meningkatkan ketahanan padi terhadap kekeringan 40%',source:'Nature Plants · IPB University',authors:['S. Hadisatono'],url:'https://nature.com',published_at:new Date().toISOString(),field:'bio',fields:['Bioteknologi','Pertanian'],summary_ai:'Modifikasi gen padi dengan CRISPR-Cas9 meningkatkan ketahanan kekeringan 40%, berpotensi besar untuk ketahanan pangan Indonesia.',summary_original:'',relevance_score:85,is_featured:false,created_at:new Date().toISOString()},
  {id:'7',title:'Deep learning model prediksi cuaca ekstrem 72 jam ke depan akurasi 89%',source:'BMKG × ITB · arXiv',authors:['H. Nugroho'],url:'https://arxiv.org',published_at:new Date().toISOString(),field:'ai',fields:['AI','Klimatologi'],summary_ai:'Model deep learning berbasis data radar BMKG mampu memprediksi cuaca ekstrem 72 jam ke depan dengan akurasi 89%, jauh melampaui model numerik konvensional.',summary_original:'',relevance_score:87,is_featured:false,created_at:new Date().toISOString()},
  {id:'8',title:'Graph Neural Network untuk prediksi penyebaran DBD di skala kecamatan',source:'arXiv cs.LG · UI Faculty of Medicine',authors:['D. Purnomo'],url:'https://arxiv.org',published_at:new Date().toISOString(),field:'math',fields:['Matematika','AI'],summary_ai:'GNN yang menggabungkan data curah hujan, populasi nyamuk, dan riwayat kasus berhasil mengidentifikasi 83% hotspot DBD di level kecamatan.',summary_original:'',relevance_score:83,is_featured:false,created_at:new Date().toISOString()},
]

interface Props {
  initialItems: ResearchItem[]
  fieldCounts: Record<string,number>
  lastRun: any
}

export function ResearchClientPage({initialItems,fieldCounts,lastRun}:Props) {
  const [activeField,setActiveField] = useState('semua')
  const items = initialItems.length > 0 ? initialItems : FALLBACK
  const filtered = activeField === 'semua' ? items : items.filter(i=>i.field===activeField)

  return (
    <div>
      <div className="bg-white border-b border-[#E2E1DC]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">STEM Research Today</h1>
          <p className="font-serif italic text-[#4A4A46] mb-5">Diperbarui otomatis setiap pagi oleh agen EROBO AI</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-mono font-semibold bg-[#E8F5EE] text-[#1B6B45] border border-[#B8E0CA] rounded-full px-3 py-1">● Terbaru · Hari ini</span>
            <span className="text-[11px] font-mono bg-[#E8EFF8] text-[#1A4B8C] border border-[#C0D4F0] rounded-full px-3 py-1">{items.length} makalah diproses</span>
            <span className="text-[11px] font-mono bg-[#FBF0E8] text-[#C85A1A] border border-[#F0CCB0] rounded-full px-3 py-1">4 sumber data aktif</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {FIELDS.map(f => {
                const count = f.key==='semua' ? items.length : items.filter(i=>i.field===f.key).length
                // Sembunyikan filter jika tidak ada data (kecuali "Semua")
                if (f.key !== 'semua' && count === 0) return null
                return (
                  <button key={f.key} onClick={()=>setActiveField(f.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${activeField===f.key ? 'bg-[#1B6B45] text-white border-[#1B6B45]' : 'bg-white text-[#4A4A46] border-[#E2E1DC] hover:border-[#D0CFC8]'}`}>
                    {f.label}
                    <span className={`text-[10px] font-mono ${activeField===f.key?'text-white/70':'text-[#8A8A84]'}`}>{count}</span>
                  </button>
                )
              })}
            </div>
            {filtered.length===0 ? (
              <div className="bg-white border border-[#E2E1DC] rounded-[16px] p-12 text-center">
                <p className="text-[#8A8A84] font-serif italic">Belum ada data untuk bidang ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((item,i)=><ResearchCard key={item.id} item={item} index={i} />)}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <SideWidget title="📊 Statistik Hari Ini">
              {[['Total makalah',items.length],['AI & ML',fieldCounts.ai||0],['Biologi',fieldCounts.bio||0],['Lingkungan',fieldCounts.env||0],['Fisika',fieldCounts.phys||0]].map(([l,v])=>(
                <div key={String(l)} className="flex items-center justify-between py-2.5 border-b border-[#E2E1DC] last:border-0">
                  <span className="text-[13px] text-[#4A4A46]">{l}</span>
                  <span className="text-[13px] font-mono font-semibold">{v}</span>
                </div>
              ))}
            </SideWidget>
            <SideWidget title="🔗 Sumber Data">
              {SOURCES.map(s=>(
                <div key={s.name} className="flex items-center gap-3 py-2.5 border-b border-[#E2E1DC] last:border-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{background:s.color}} />
                  <span className="text-[13px] font-medium flex-1">{s.name}</span>
                  <span className="text-[11px] font-mono text-[#8A8A84]">aktif</span>
                </div>
              ))}
            </SideWidget>
      
          </aside>
        </div>
      </div>
    </div>
  )
}

function SideWidget({title,children}:{title:string,children:React.ReactNode}) {
  return (
    <div className="bg-white border border-[#E2E1DC] rounded-[16px] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E2E1DC] text-[12px] font-bold">{title}</div>
      <div className="px-5 py-1">{children}</div>
    </div>
  )
}

function ResearchCard({item,index}:{item:ResearchItem,index:number}) {
  const num = String(index+1).padStart(2,'0')
  return (
    <article className="bg-white border border-[#E2E1DC] rounded-[16px] p-6 hover:border-[#D0CFC8] hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1B6B45] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-top rounded-r" />
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-[11px] font-mono text-[#8A8A84] shrink-0 mt-0.5">{num}</span>
        <div className="flex gap-1.5 flex-wrap flex-1">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${fieldColor(item.field)}`}>{fieldLabel(item.field)}</span>
          {item.fields?.slice(1,3).map(f=><span key={f} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F4F3EF] text-[#4A4A46] border border-[#E2E1DC]">{f}</span>)}
          {item.is_featured&&<span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-[#E8F5EE] text-[#1B6B45] border border-[#B8E0CA]">★ Pilihan</span>}
        </div>
        <span className="text-[11px] font-mono text-[#8A8A84] shrink-0">{formatDate(item.published_at)}</span>
      </div>
      <h3 className="text-[17px] font-bold text-[#1A1A18] leading-snug mb-2.5 group-hover:text-[#1B6B45] transition-colors">{item.title}</h3>
      <div className="flex items-center gap-1.5 text-xs font-mono text-[#8A8A84] mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1B6B45] shrink-0" />
        <span className="text-[#1B6B45] font-semibold">{item.source}</span>
        {item.authors?.length?<><span>·</span><span>{item.authors.slice(0,2).join(', ')}</span></>:null}
      </div>
      <div className="bg-[#FAFAF8] rounded-lg border-l-2 border-[#D0CFC8] px-4 py-3 mb-5">
        <p className="text-[13px] font-serif italic text-[#4A4A46] leading-relaxed">
          <strong className="font-sans not-italic font-semibold text-[11px] uppercase tracking-wide mr-1 text-[#8A8A84]">Ringkasan AI:</strong>
          {item.summary_ai}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B6B45] bg-[#E8F5EE] border border-[#B8E0CA] px-3.5 py-2 rounded-lg hover:bg-[#1B6B45] hover:text-white hover:border-[#1B6B45] transition-all duration-200">
          Baca Lebih Lanjut
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8A8A84]">Relevansi</span>
          <div className="w-16 h-1.5 bg-[#EDECEA] rounded-full overflow-hidden">
            <div className="h-full bg-[#1B6B45] rounded-full" style={{width:`${item.relevance_score}%`}} />
          </div>
          <span className="text-[11px] font-mono font-semibold text-[#1B6B45]">{item.relevance_score}</span>
        </div>
      </div>
    </article>
  )
}