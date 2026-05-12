import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { accentHex } from '../utils/helpers.js'

export default function DeckCard({ deck, onClick, compact = false }) {
  const Icon = Icons[deck.icon] ?? Icons.Star
  const color = accentHex(deck.color)
  const actionCount = deck.actions?.length ?? 0

  /* ── Compact row variant (used in Recent) ── */
  if (compact) {
    return (
      <motion.button
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        onClick={onClick}
        className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl bg-surface active:bg-surface2 text-left"
        style={{ border: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Left color bar */}
        <div
          className="w-0.5 self-stretch rounded-full flex-shrink-0"
          style={{ background: color }}
        />

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + '18' }}
        >
          <Icon size={17} style={{ color }} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-[14px] font-semibold leading-snug truncate">{deck.name}</p>
          <p className="text-text-muted text-xs mt-0.5 leading-none">
            {actionCount} action{actionCount !== 1 ? 's' : ''}
          </p>
        </div>

        <Icons.ChevronRight size={15} className="text-text-muted flex-shrink-0 mr-0.5" />
      </motion.button>
    )
  }

  /* ── Grid card variant ── */
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      onClick={onClick}
      className="relative flex flex-col w-full text-left rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(28,36,52,0.95) 0%, rgba(16,22,30,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: `0 4px 20px rgba(0,0,0,0.35), 0 0 0 0 ${color}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Colored top accent strip */}
      <div
        className="w-full flex-shrink-0 relative"
        style={{
          height: '3px',
          background: `linear-gradient(90deg, ${color} 0%, ${color}40 100%)`,
        }}
      >
        {/* glow under strip */}
        <div
          className="absolute left-0 right-0 -bottom-2 h-3 blur-md opacity-50 pointer-events-none"
          style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }}
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}28, ${color}12)`,
            boxShadow: `0 2px 10px ${color}18`,
          }}
        >
          <Icon size={21} style={{ color }} strokeWidth={2} />
        </div>

        {/* Text */}
        <div className="flex-1">
          <p
            className="font-bold leading-tight"
            style={{ fontSize: '14px', color: '#E8EFF8', letterSpacing: '-0.01em' }}
          >
            {deck.name}
          </p>
          {deck.description && (
            <p className="text-text-muted text-[11px] mt-1 leading-relaxed line-clamp-2">
              {deck.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 mt-auto">
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#5A6A7E' }}
          >
            {actionCount} action{actionCount !== 1 ? 's' : ''}
          </span>
          {deck.isFavorite && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: color + '15', color: color }}
            >
              Pinned
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}
