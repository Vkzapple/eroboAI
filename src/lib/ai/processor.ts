// src/lib/ai/processor.ts
// AI processing: summarization, gap detection, idea generation
// Supports both Gemini and OpenAI

import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'
import type { ResearchGap, ResearchIdea } from '@/types'

// ── Clients ───────────────────────────────────────────────────
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'

// ── Core LLM call ─────────────────────────────────────────────
async function callLLM(prompt: string): Promise<string> {
  if (AI_PROVIDER === 'gemini' && gemini) {
    const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })
    const result = await model.generateContent(prompt)
    return result.response.text()
  }

  if (openai) {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    })
    return res.choices[0].message.content || ''
  }

  throw new Error('No AI provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY.')
}

export async function summarizePaper(
  title: string,
  abstract: string
): Promise<{ summary: string; relevance_score: number; field_tags: string[] }> {
  const prompt = `
Kamu adalah asisten riset untuk siswa SMA Indonesia yang tergabung dalam Klub Ilmiah Remaja (KIR).

Tugas:
1. Buat ringkasan SINGKAT (2-3 kalimat) dalam Bahasa Indonesia yang mudah dipahami siswa SMA.
2. Beri skor relevansi 0-100 untuk siswa SMA Indonesia (100 = sangat relevan untuk penelitian skala sekolah).
3. Identifikasi 2-4 tag bidang ilmu dalam Bahasa Indonesia.

Judul Paper: "${title}"
Abstrak: "${abstract.slice(0, 800)}"

Balas HANYA dengan JSON valid ini (tanpa backtick, tanpa komentar):
{
  "summary": "ringkasan di sini",
  "relevance_score": 75,
  "field_tags": ["AI", "Pertanian"]
}
`.trim()

  try {
    const raw = await callLLM(prompt)
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch {
    return {
      summary: abstract.slice(0, 200) + '...',
      relevance_score: 50,
      field_tags: ['STEM'],
    }
  }
}

// ── 2. Detect research gaps from batch of papers ──────────────
export async function detectResearchGaps(
  papers: Array<{ title: string; summary: string; field: string }>
): Promise<Omit<ResearchGap, 'id' | 'created_at'>[]> {
  const paperList = papers
    .slice(0, 20)
    .map((p, i) => `${i + 1}. [${p.field.toUpperCase()}] ${p.title}`)
    .join('\n')

  const prompt = `
Kamu adalah analis riset ilmiah untuk siswa SMA Indonesia dalam Klub Ilmiah Remaja (KIR).

Berdasarkan daftar paper riset terbaru ini, identifikasi 5 RESEARCH GAP yang:
- Belum banyak diteliti (terutama untuk konteks Indonesia)
- Bisa dilakukan oleh siswa SMA dengan peralatan sederhana
- Relevan untuk kehidupan sehari-hari di Indonesia

Paper terbaru:
${paperList}

Balas HANYA dengan JSON array valid (tanpa backtick):
[
  {
    "title": "Judul gap penelitian yang menarik dan spesifik",
    "field": "Nama bidang utama",
    "related_fields": ["Bidang 1", "Bidang 2"],
    "reason": "Penjelasan mengapa ini adalah gap: apa yang sudah ada dan apa yang belum diteliti (2-3 kalimat)",
    "opportunity": "Apa yang bisa dilakukan siswa SMA untuk mengisi gap ini (1-2 kalimat)",
    "difficulty": "mudah",
    "level": "kritis",
    "relevance_score": 88,
    "tags": ["Tag1", "Tag2", "Tag3"],
    "source_papers": [],
    "generated_at": "${new Date().toISOString()}"
  }
]

level harus salah satu: "kritis", "moderat", "baru", "rendah"
difficulty harus salah satu: "mudah", "sedang", "sulit"
`.trim()

  try {
    const raw = await callLLM(prompt)
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error('[AI] Gap detection failed:', err)
    return []
  }
}

// ── 3. Generate research ideas from gaps ──────────────────────
export async function generateResearchIdeas(
  gaps: Array<{ id: string; title: string; field: string; reason: string }>
): Promise<Omit<ResearchIdea, 'id' | 'created_at'>[]> {
  if (gaps.length === 0) return []

  const gapList = gaps
    .slice(0, 5)
    .map((g, i) => `${i + 1}. ${g.title} (${g.field})`)
    .join('\n')

  const prompt = `
Kamu adalah mentor penelitian untuk siswa SMA Indonesia di Klub Ilmiah Remaja (KIR).

Berdasarkan gap penelitian berikut, buat JUDUL IDE PENELITIAN yang:
- Spesifik dan operasional (bisa langsung dijadikan judul penelitian)
- Sesuai kapasitas siswa SMA (tidak memerlukan lab universitas)
- Menggunakan bahan/alat yang tersedia di Indonesia
- Orisinal dan belum banyak diteliti

Gap penelitian:
${gapList}

Balas HANYA dengan JSON array valid (tanpa backtick):
[
  {
    "title": "Judul penelitian lengkap dan spesifik",
    "gap_id": null,
    "field": "ai",
    "tags": ["Tag1", "Tag2"],
    "description": "Deskripsi penelitian 2-3 kalimat mengapa penting dan apa yang diteliti",
    "methodology": "Metode penelitian singkat: alat/bahan, prosedur utama, analisis data",
    "expected_outcome": "Hasil yang diharapkan dan dampaknya",
    "difficulty": "sedang",
    "feasibility_score": 82,
    "originality_score": 79
  }
]

field harus salah satu: "ai", "bio", "env", "phys", "math", "rob", "chem", "other"
difficulty: "mudah", "sedang", atau "sulit"
`.trim()

  try {
    const raw = await callLLM(prompt)
    const clean = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error('[AI] Idea generation failed:', err)
    return []
  }
}

// ── 4. Score relevance for SMA students ───────────────────────
export function scoreRelevanceHeuristic(title: string, summary: string): number {
  const text = (title + ' ' + summary).toLowerCase()
  let score = 50

  // High relevance keywords
  const boost = ['indonesia', 'sekolah', 'lokal', 'murah', 'sederhana', 'siswa',
    'iot', 'sensor', 'pertanian', 'lingkungan', 'air', 'udara', 'sampah',
    'mobile', 'smartphone', 'raspberry', 'arduino', 'low-cost', 'affordable']
  boost.forEach(w => { if (text.includes(w)) score += 5 })

  // Lower relevance (too advanced)
  const penalize = ['quantum', 'nuclear', 'cern', 'hadron', 'synchrotron',
    'billion parameter', 'supercomputer', 'clinical trial phase']
  penalize.forEach(w => { if (text.includes(w)) score -= 10 })

  return Math.max(0, Math.min(100, score))
}
