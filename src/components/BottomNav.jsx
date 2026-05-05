import React from 'react'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, Wifi, Settings } from 'lucide-react'

const tabs = [
  { id: 'home',     icon: Home,        label: 'Home' },
  { id: 'decks',    icon: LayoutGrid,  label: 'Decks' },
  { id: 'shortcuts',icon: Wifi,        label: 'Shortcuts' },
  { id: 'settings', icon: Settings,    label: 'Settings' },
]

export default function BottomNav({ screen, navigate }) {
  const activeTab = tabs.find(t => screen?.startsWith(t.id)) ? screen.split('/')[0] : 'home'

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] glass border-t border-white/5 safe-bottom z-50">
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(({ id, icon: Icon, label }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className="flex flex-col items-center gap-1 py-1 px-4 rounded-2xl relative min-w-[64px]"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl bg-white/5"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={22}
                className={active ? 'text-accent-blue' : 'text-text-muted'}
                strokeWidth={active ? 2 : 1.5}
              />
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-accent-blue' : 'text-text-muted'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
