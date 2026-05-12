import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url }
}

export default function LinkCard({ action, accentColor }) {
  const handleOpen = () => {
    if (action.url) window.open(action.url, '_blank', 'noopener')
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      onClick={handleOpen}
      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left"
      style={{
        background: 'rgba(18,24,32,0.95)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accentColor + '18' }}
      >
        <Globe size={18} style={{ color: accentColor }} strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-text-primary text-[14px] font-semibold">{action.title}</p>
        {action.url && (
          <p className="text-[12px] mt-0.5 truncate" style={{ color: '#3D5066' }}>
            {getDomain(action.url)}
          </p>
        )}
      </div>

      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accentColor + '12' }}
      >
        <ExternalLink size={14} style={{ color: accentColor }} strokeWidth={2} />
      </div>
    </motion.button>
  )
}
