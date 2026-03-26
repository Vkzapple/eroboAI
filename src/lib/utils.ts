// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ResearchField } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000)
    const diffD = Math.floor(diffH / 24)
    if (diffH < 1) return 'Baru saja'
    if (diffH < 24) return `${diffH} jam lalu`
    if (diffD < 7) return `${diffD} hari lalu`
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export function fieldLabel(field: string): string {
  const map: Record<string, string> = {
    ai:'AI & ML', bio:'Biologi', env:'Lingkungan', phys:'Fisika',
    math:'Matematika', rob:'Robotika', chem:'Kimia', other:'STEM',
  }
  return map[field] || field.toUpperCase()
}

// Filter option lists used across pages
export const RESEARCH_FIELDS = [
  { value: 'semua', label: 'Semua Bidang' },
  { value: 'ai',   label: 'AI & ML' },
  { value: 'bio',  label: 'Biologi' },
  { value: 'env',  label: 'Lingkungan' },
  { value: 'phys', label: 'Fisika & Energi' },
  { value: 'math', label: 'Matematika' },
  { value: 'rob',  label: 'Robotika' },
  { value: 'chem', label: 'Kimia' },
]

export const GAP_LEVELS = [
  { value: 'semua',   label: 'Semua Gap' },
  { value: 'kritis',  label: '🔴 Kritis' },
  { value: 'moderat', label: '🟠 Moderat' },
  { value: 'baru',    label: '🔵 Baru Terdeteksi' },
  { value: 'rendah',  label: '⚪ Rendah' },
]

export function fieldColor(field: string): string {
  const map: Record<string, string> = {
    ai:'bg-green-50 text-green-700',
    bio:'bg-blue-50 text-blue-700',
    env:'bg-emerald-50 text-emerald-700',
    phys:'bg-orange-50 text-orange-700',
    math:'bg-purple-50 text-purple-700',
    rob:'bg-amber-50 text-amber-700',
    chem:'bg-teal-50 text-teal-700',
    other:'bg-gray-50 text-gray-600',
  }
  return map[field] || 'bg-gray-50 text-gray-600'
}
