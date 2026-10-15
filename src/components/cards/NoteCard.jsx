import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronDown, Copy, Check } from 'lucide-react'

export default function NoteCard({ action, accentColor }) {
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(action.content ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const preview = action.content?.split('\n')[0]?.slice(0, 60) || ''

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(18,24,32,0.95)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3.5 px-4 py-4"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '18' }}
        >
          <FileText size={17} style={{ color: accentColor }} strokeWidth={2} />
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="text-text-primary text-[14px] font-semibold">{action.title}</p>
          {collapsed && preview && (
            <p className="text-[12px] mt-0.5 truncate" style={{ color: '#4A5568' }}>{preview}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            onClick={e => { e.stopPropagation(); copy() }}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'check' : 'copy'}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {copied
                  ? <Check size={13} style={{ color: accentColor }} strokeWidth={2.5} />
                  : <Copy size={13} style={{ color: '#5A6A7E' }} />
                }
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.div
            animate={{ rotate: collapsed ? -90 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <ChevronDown size={16} style={{ color: '#3D5066' }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 38, mass: 0.8 }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mb-4 p-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <p
                className="text-[13px] leading-relaxed whitespace-pre-wrap"
                style={{ color: '#8899AA' }}
              >
                {action.content || <span style={{ color: '#3D5066', fontStyle: 'italic' }}>No content</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
