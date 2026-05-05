import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Link2 } from 'lucide-react'

export default function LinkCard({ action, accentColor }) {
  const handleOpen = () => {
    if (action.url) window.open(action.url, '_blank', 'noopener')
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleOpen}
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface2 border border-white/5 active:bg-surface3 transition-colors text-left"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accentColor + '20' }}
      >
        <Link2 size={18} style={{ color: accentColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-sm font-semibold">{action.title}</p>
        {action.url && (
          <p className="text-text-muted text-xs mt-0.5 truncate">{action.url}</p>
        )}
      </div>
      <ExternalLink size={15} className="text-text-muted flex-shrink-0" />
    </motion.button>
  )
}
