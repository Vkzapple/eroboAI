# KIR EROBO AI — STEM Trend & Gap Intelligence Platform

> Platform Web 4.0 berbasis Agentic AI untuk membantu anggota KIR menemukan tren dan gap penelitian STEM terkini.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL CRON                          │
│              (Setiap hari 06:00 WIB)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ GET /api/cron
                       ▼
┌─────────────────────────────────────────────────────────┐
│               PIPELINE AGEN EROBO                       │
│                                                         │
│  Step 1: Fetch Data                                     │
│  ├── arXiv API  (STEM papers, free, no key)             │
│  ├── ScienceDaily RSS                                   │
│  ├── Nature RSS                                         │
│  └── IEEE RSS                                           │
│                                                         │
│  Step 2: AI Processing (Gemini 1.5 Flash / GPT-4o-mini) │
│  ├── Summarize → Bahasa Indonesia                       │
│  ├── Score relevance untuk siswa SMA                    │
│  └── Tag bidang ilmu                                    │
│                                                         │
│  Step 3: Store → Supabase / PostgreSQL                  │
│  ├── research_items table                               │
│  ├── research_gaps table                                │
│  └── research_ideas table                               │
│                                                         │
│  Step 4: Detect Research Gaps                           │
│  └── AI analysis of coverage + local context           │
│                                                         │
│  Step 5: Generate Research Ideas                        │
│  └── SMA-level feasible ideas from gaps                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  NEXT.JS FRONTEND                       │
│                                                         │
│  / (Home)         — Landing + prestasi + highlights     │
│  /research        — Research Today feed + filter        │
│  /gaps            — Gap Finder + ideas                  │
│  /about           — Profil KIR + pengurus               │
│                                                         │
│  API Routes:                                            │
│  /api/research    — GET paginated research items        │
│  /api/gaps        — GET research gaps                   │
│  /api/ideas       — GET research ideas                  │
│  /api/cron        — POST trigger pipeline               │
└─────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
kir-erobo-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + fonts
│   │   ├── globals.css             # Tailwind + custom styles
│   │   ├── page.tsx                # Home page
│   │   ├── research/
│   │   │   └── page.tsx            # Research Today page
│   │   ├── gaps/
│   │   │   └── page.tsx            # Gap Finder page
│   │   ├── about/
│   │   │   └── page.tsx            # About KIR page
│   │   └── api/
│   │       ├── cron/route.ts       # Cron trigger endpoint
│   │       ├── research/route.ts   # Research API
│   │       ├── gaps/route.ts       # Gaps API
│   │       └── ideas/route.ts      # Ideas API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Sticky navigation
│   │   │   └── Sidebar.tsx         # Filter + stat widgets
│   │   ├── research/
│   │   │   └── ResearchCard.tsx    # Research paper card
│   │   └── gaps/
│   │       └── GapCard.tsx         # Research gap card
│   ├── lib/
│   │   ├── supabase.ts             # DB client + schema SQL
│   │   ├── utils.ts                # Helpers + field labels
│   │   ├── fetchers/
│   │   │   ├── arxiv.ts            # arXiv API fetcher
│   │   │   └── rss.ts              # RSS feed fetcher
│   │   ├── ai/
│   │   │   └── processor.ts        # Gemini/OpenAI processor
│   │   └── agent/
│   │       └── pipeline.ts         # Main agent orchestrator
│   └── types/
│       └── index.ts                # TypeScript types
├── vercel.json                     # Vercel cron config
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-school/kir-erobo-ai
cd kir-erobo-ai
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local dengan nilai yang sesuai
```

### 3. Setup Supabase Database

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Jalankan SQL schema dari `src/lib/supabase.ts` (variabel `SCHEMA_SQL`)
4. Copy URL dan API keys ke `.env.local`

### 4. Get AI API Key

**Gemini (Recommended — Free tier tersedia):**
- Daftar di [aistudio.google.com](https://aistudio.google.com)
- Generate API key → paste ke `GEMINI_API_KEY`

**OpenAI (Alternatif):**
- Daftar di [platform.openai.com](https://platform.openai.com)
- Generate API key → paste ke `OPENAI_API_KEY`
- Set `AI_PROVIDER=openai`

### 5. Run Development

```bash
npm run dev
# Buka http://localhost:3000
```

### 6. Test Agent Pipeline Manually

```bash
# Trigger pipeline via API (pastikan server running)
curl -X POST http://localhost:3000/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial KIR EROBO AI"
git push origin main
```

### Step 2: Import ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Import repository
3. Tambahkan semua environment variables dari `.env.local`
4. Deploy

### Step 3: Vercel Cron (Auto-configured)

File `vercel.json` sudah mengkonfigurasi cron job otomatis:
```json
{
  "crons": [{
    "path": "/api/cron",
    "schedule": "0 23 * * *"
  }]
}
```
> Ini berjalan setiap pukul 23:00 UTC = 06:00 WIB

### Step 4: Protect Cron Endpoint

Set `CRON_SECRET` di Vercel environment variables, lalu konfigurasikan
di **Vercel Dashboard → Project → Settings → Cron Jobs**.

---

## Database Schema

### `research_items`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Judul paper |
| source | text | Sumber (arXiv, ScienceDaily, dll) |
| url | text | Link paper (unique) |
| published_at | timestamptz | Tanggal publikasi |
| field | text | Bidang utama (ai, bio, env, ...) |
| summary_ai | text | Ringkasan AI Bahasa Indonesia |
| relevance_score | integer | Skor relevansi siswa SMA (0-100) |
| is_featured | boolean | Apakah ditampilkan di highlight |

### `research_gaps`
| Column | Type | Description |
|--------|------|-------------|
| title | text | Judul gap penelitian |
| field | text | Bidang ilmu |
| reason | text | Alasan mengapa ini gap |
| opportunity | text | Peluang untuk siswa SMA |
| level | text | kritis / moderat / baru / rendah |
| relevance_score | integer | Skor relevansi (0-100) |
| tags | text[] | Tag kata kunci |

### `research_ideas`
| Column | Type | Description |
|--------|------|-------------|
| title | text | Judul ide penelitian |
| description | text | Deskripsi penelitian |
| methodology | text | Metode penelitian |
| difficulty | text | mudah / sedang / sulit |
| feasibility_score | integer | Skor kelayakan (0-100) |

---

## Customization

### Tambah Query arXiv

Edit `src/lib/fetchers/arxiv.ts`:
```typescript
export const ARXIV_QUERIES = [
  // Tambah query baru di sini
  { query: 'water quality sensor Indonesia', field: 'env' },
  { query: 'earthquake prediction machine learning', field: 'phys' },
]
```

### Tambah Sumber RSS

Edit `src/lib/fetchers/rss.ts`:
```typescript
export const RSS_SOURCES = [
  // Tambah sumber RSS baru
  { name: 'New Scientist', url: 'https://www.newscientist.com/feed/home', field: 'other' },
]
```

### Ganti AI Provider

Edit `.env.local`:
```bash
AI_PROVIDER=openai   # Ganti dari gemini ke openai
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Node.js (Next.js API Routes) |
| AI | Gemini 1.5 Flash / GPT-4o-mini |
| Data Sources | arXiv API + RSS Feeds |
| Database | Supabase (PostgreSQL) |
| Scheduler | Vercel Cron Jobs |
| Deploy | Vercel |

---

## License

MIT — Bebas digunakan dan dimodifikasi oleh KIR sekolah lain di Indonesia.

---

*Dibuat oleh Evelly Ketua Umum KIR EROBO — Berpikir Kritis, Berkarya Nyata*
