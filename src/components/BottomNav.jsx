import React from 'react'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, Wifi, Settings } from 'lucide-react'

const tabs = [
  { id: 'home',      icon: Home,        label: 'Home' },
  { id: 'decks',     icon: LayoutGrid,  label: 'Decks' },
  { id: 'shortcuts', icon: Wifi,        label: 'Shortcuts' },
  { id: 'settings',  icon: Settings,    label: 'Settings' },
]

export default function BottomNav({ screen, navigate }) {
  const activeTab = tabs.find(t => screen?.startsWith(t.id))?.id ?? 'home'

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 safe-bottom glass"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-stretch justify-around px-1 pt-2 pb-1">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl flex-1"
            >
              {active && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(74,158,255,0.08)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <motion.div
                animate={{
                  y: active ? -1 : 0,
                  scale: active ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              >
                <Icon
                  size={21}
                  className={active ? '' : 'text-text-muted'}
                  style={active ? { color: '#4A9EFF' } : {}}
                  strokeWidth={active ? 2.2 : 1.6}
                />
              </motion.div>
              <span
                className="text-[10px] font-semibold tracking-wide leading-none"
                style={{ color: active ? '#4A9EFF' : '#4A5568' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
