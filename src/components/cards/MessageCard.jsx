import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Copy, Check, Send } from 'lucide-react'

export default function MessageCard({ action, accentColor }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(action.content ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl bg-surface2 border border-white/5 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '20' }}
        >
          <MessageSquare size={18} style={{ color: accentColor }} />
        </div>
        <p className="text-text-primary text-sm font-semibold">{action.title}</p>
      </div>

      <div className="rounded-xl p-3 bg-white/5 mb-3">
        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
          {action.content || <span className="text-text-muted italic">No message</span>}
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={copy}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm"
        style={{
          background: copied ? 'rgba(52,211,153,0.15)' : accentColor + '18',
          color: copied ? '#34D399' : accentColor,
          border: `1px solid ${copied ? 'rgba(52,211,153,0.25)' : accentColor + '30'}`,
        }}
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied!' : 'Copy message'}
      </motion.button>
    </div>
  )
}
