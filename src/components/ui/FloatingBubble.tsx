"use client"

import { useEffect, useState } from "react"

type Bubble = {
  id: number
  text: string
  x: number
  size: number
}

const MESSAGES = [
  "📡 Fetching arXiv...",
  "🤖 AI analyzing...",
  "🔍 Gap detected",
  "🧠 Idea generated",
  "📊 Trend updated",
]

export default function FloatingBubble() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newBubble: Bubble = {
        id: Date.now(),
        text: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        x: Math.random() * 90,
        size: 0.8 + Math.random() * 0.6,
      }

      setBubbles(prev => [...prev, newBubble])

      // auto remove
      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== newBubble.id))
      }, 3500)
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="absolute bubble"
          style={{
            left: `${b.x}%`,
            bottom: "0%",
            transform: `scale(${b.size})`,
          }}
        >
          {b.text}
        </div>
      ))}
    </div>
  )
}