import React from 'react'
import { accentHex } from '../utils/helpers.js'

export default function ProfileAvatar({ profile, size = 40, ring = false }) {
  const c = accentHex(profile?.color)
  const initial = (Array.from(profile?.name?.trim() ?? '')[0] ?? '?').toUpperCase()

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 select-none font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        color: c,
        letterSpacing: '-0.02em',
        background: `radial-gradient(circle at 30% 25%, ${c}45, ${c}18)`,
        border: `1px solid ${c}40`,
        boxShadow: ring ? `0 0 0 2px #0A0E14, 0 0 0 3.5px ${c}80, 0 4px 16px ${c}30` : 'none',
      }}
    >
      {initial}
    </div>
  )
}
