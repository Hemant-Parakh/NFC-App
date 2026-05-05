import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { accentHex } from '../utils/helpers.js'

export default function DeckCard({ deck, onClick, compact = false }) {
  const Icon = Icons[deck.icon] ?? Icons.Star
  const color = accentHex(deck.color)
  const actionCount = deck.actions?.length ?? 0

  if (compact) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="flex items-center gap-3 w-full p-3 rounded-2xl bg-surface border border-white/5 active:bg-surface2 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + '22' }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-text-primary text-sm font-semibold truncate">{deck.name}</p>
          <p className="text-text-muted text-xs mt-0.5">{actionCount} action{actionCount !== 1 ? 's' : ''}</p>
        </div>
        <Icons.ChevronRight size={16} className="text-text-muted flex-shrink-0" />
      </motion.button>
    )
  }

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex flex-col p-4 rounded-3xl bg-surface border border-white/5 active:bg-surface2 transition-colors text-left shadow-card"
      style={{ borderTopColor: color + '33' }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: color + '20' }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <p className="text-text-primary text-sm font-semibold leading-snug">{deck.name}</p>
      {deck.description ? (
        <p className="text-text-muted text-xs mt-1 leading-relaxed line-clamp-2">{deck.description}</p>
      ) : null}
      <div className="mt-3 flex items-center gap-1.5">
        <span className="text-[10px] text-text-muted font-medium bg-white/5 px-2 py-0.5 rounded-full">
          {actionCount} action{actionCount !== 1 ? 's' : ''}
        </span>
        {deck.isFavorite && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: color + '18', color }}>
            Pinned
          </span>
        )}
      </div>
    </motion.button>
  )
}
