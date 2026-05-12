import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Copy, Check } from 'lucide-react'

export default function MessageCard({ action, accentColor }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(action.content ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(18,24,32,0.95)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-3.5 mb-3.5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '18' }}
        >
          <MessageSquare size={17} style={{ color: accentColor }} strokeWidth={2} />
        </div>
        <p className="text-text-primary text-[14px] font-semibold">{action.title}</p>
      </div>

      {/* Message bubble */}
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 mb-4"
        style={{
          background: `linear-gradient(135deg, ${accentColor}14, ${accentColor}08)`,
          border: `1px solid ${accentColor}20`,
        }}
      >
        <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: '#A0B0C4' }}>
          {action.content || <span style={{ color: '#3D5066', fontStyle: 'italic' }}>No message</span>}
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        onClick={copy}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
        style={{
          background: copied ? 'rgba(52,211,153,0.12)' : accentColor + '15',
          color: copied ? '#34D399' : accentColor,
          border: `1px solid ${copied ? 'rgba(52,211,153,0.2)' : accentColor + '25'}`,
          transition: 'background 0.2s, color 0.2s, border-color 0.2s',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'done' : 'copy'}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy message'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
