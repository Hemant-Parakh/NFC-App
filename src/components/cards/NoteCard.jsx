import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StickyNote, ChevronDown, Copy, Check } from 'lucide-react'

export default function NoteCard({ action, accentColor }) {
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(action.content ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-2xl bg-surface2 border border-white/5 overflow-hidden">
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-4"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '20' }}
        >
          <StickyNote size={18} style={{ color: accentColor }} />
        </div>
        <p className="flex-1 text-left text-text-primary text-sm font-semibold">{action.title}</p>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); copy() }}
            className="p-1.5 rounded-lg bg-white/5 active:bg-white/10"
          >
            {copied
              ? <Check size={13} style={{ color: accentColor }} />
              : <Copy size={13} className="text-text-secondary" />
            }
          </motion.button>
          <motion.div animate={{ rotate: collapsed ? -90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-text-muted" />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {action.content || <span className="text-text-muted italic">No content</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
