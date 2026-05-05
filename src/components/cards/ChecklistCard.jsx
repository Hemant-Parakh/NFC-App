import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Square, RotateCcw, ChevronDown } from 'lucide-react'
import { generateId } from '../../utils/helpers.js'

export default function ChecklistCard({ action, accentColor, onUpdate }) {
  const [collapsed, setCollapsed] = useState(false)
  const items = action.items ?? []
  const done = items.filter(i => i.checked).length

  const toggle = (itemId) => {
    const updated = items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i)
    onUpdate?.({ ...action, items: updated })
  }

  const reset = () => {
    onUpdate?.({ ...action, items: items.map(i => ({ ...i, checked: false })) })
  }

  return (
    <div className="rounded-2xl bg-surface2 border border-white/5 overflow-hidden">
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3 px-4 pt-4 pb-3"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '20' }}
        >
          <CheckSquare size={18} style={{ color: accentColor }} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-text-primary text-sm font-semibold">{action.title}</p>
          <p className="text-text-muted text-xs mt-0.5">{done}/{items.length} done</p>
        </div>
        <div className="flex items-center gap-2">
          {done === items.length && items.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); reset() }}
              className="p-1.5 rounded-lg bg-white/5 active:bg-white/10"
            >
              <RotateCcw size={13} className="text-text-secondary" />
            </motion.button>
          )}
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
            <div className="px-4 pb-4 space-y-2">
              {/* Progress bar */}
              {items.length > 0 && (
                <div className="w-full h-1 rounded-full bg-white/5 mb-3">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: accentColor }}
                    animate={{ width: `${(done / items.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              {items.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(item.id)}
                  className="flex items-center gap-3 w-full py-2 px-3 rounded-xl active:bg-white/5 transition-colors"
                >
                  {item.checked ? (
                    <CheckSquare size={18} style={{ color: accentColor }} className="flex-shrink-0" />
                  ) : (
                    <Square size={18} className="text-text-muted flex-shrink-0" />
                  )}
                  <span className={`text-sm text-left ${item.checked ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                    {item.text}
                  </span>
                </motion.button>
              ))}
              {items.length === 0 && (
                <p className="text-text-muted text-xs text-center py-2">No items yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
