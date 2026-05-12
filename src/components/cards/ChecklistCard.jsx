import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, RotateCcw, ChevronDown, Check } from 'lucide-react'

export default function ChecklistCard({ action, accentColor, onUpdate }) {
  const [collapsed, setCollapsed] = useState(false)
  const items = action.items ?? []
  const done = items.filter(i => i.checked).length
  const allDone = items.length > 0 && done === items.length
  const pct = items.length > 0 ? (done / items.length) * 100 : 0

  const toggle = (itemId) => {
    const updated = items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i)
    onUpdate?.({ ...action, items: updated })
  }

  const reset = () => {
    onUpdate?.({ ...action, items: items.map(i => ({ ...i, checked: false })) })
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: allDone
          ? `linear-gradient(135deg, ${accentColor}10, rgba(18,24,32,0.95))`
          : 'rgba(18,24,32,0.95)',
        border: `1px solid ${allDone ? accentColor + '25' : 'rgba(255,255,255,0.05)'}`,
        transition: 'background 0.4s, border-color 0.4s',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3.5 px-4 pt-4 pb-3.5"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '18' }}
        >
          <ListChecks size={18} style={{ color: accentColor }} strokeWidth={2} />
        </div>

        <div className="flex-1 text-left">
          <p className="text-text-primary text-[14px] font-semibold">{action.title}</p>
          <p className="text-[12px] mt-0.5" style={{ color: allDone ? accentColor : '#4A5568' }}>
            {allDone ? 'All done!' : `${done} of ${items.length} done`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {allDone && (
              <motion.button
                key="reset"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                whileTap={{ scale: 0.88 }}
                onClick={e => { e.stopPropagation(); reset() }}
                className="p-1.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <RotateCcw size={13} style={{ color: '#8899AA' }} />
              </motion.button>
            )}
          </AnimatePresence>
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
            <div className="px-4 pb-4">
              {/* Progress bar */}
              {items.length > 0 && (
                <div
                  className="w-full h-1 rounded-full mb-4 overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: accentColor }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  />
                </div>
              )}

              {/* Items */}
              <div className="space-y-1">
                {items.map(item => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => toggle(item.id)}
                    className="flex items-center gap-3 w-full py-2.5 px-2 rounded-xl text-left"
                    style={{ background: 'transparent' }}
                    whileHover={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {/* Animated circle checkbox */}
                    <motion.div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      animate={{
                        background: item.checked ? accentColor + '20' : 'transparent',
                        borderColor: item.checked ? accentColor : 'rgba(255,255,255,0.18)',
                        scale: 1,
                      }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                      style={{ border: '2px solid rgba(255,255,255,0.18)' }}
                    >
                      <AnimatePresence>
                        {item.checked && (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 600, damping: 25 }}
                          >
                            <Check size={11} style={{ color: accentColor }} strokeWidth={3} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.span
                      className="text-[14px] leading-snug"
                      animate={{
                        color: item.checked ? '#3D5066' : '#D0DCF0',
                        textDecoration: item.checked ? 'line-through' : 'none',
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.text}
                    </motion.span>
                  </motion.button>
                ))}
              </div>

              {items.length === 0 && (
                <p className="text-center text-xs py-3" style={{ color: '#3D5066' }}>No items</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
