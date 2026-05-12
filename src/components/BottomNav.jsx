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
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-stretch justify-around px-2 pt-2.5 pb-1.5">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="relative flex flex-col items-center gap-1 py-1.5 px-2 rounded-2xl flex-1"
            >
              {active && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(74,158,255,0.12), rgba(74,158,255,0.04))',
                    border: '1px solid rgba(74,158,255,0.18)',
                    boxShadow: '0 2px 12px rgba(74,158,255,0.18)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.7 }}
                />
              )}
              <motion.div
                animate={{
                  y: active ? -1 : 0,
                  scale: active ? 1.08 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="relative"
              >
                <Icon
                  size={20}
                  style={active ? { color: '#4A9EFF' } : { color: '#3D5066' }}
                  strokeWidth={active ? 2.3 : 1.7}
                />
              </motion.div>
              <span
                className="text-[10px] font-semibold tracking-wide leading-none relative"
                style={{ color: active ? '#4A9EFF' : '#3D5066' }}
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
