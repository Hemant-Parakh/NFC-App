import React from 'react'
import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'
import { ICON_OPTIONS } from '../utils/helpers.js'

export default function IconPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ICON_OPTIONS.map(name => {
        const Icon = Icons[name]
        if (!Icon) return null
        const active = value === name
        return (
          <motion.button
            key={name}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(name)}
            className="flex items-center justify-center aspect-square rounded-2xl border transition-all"
            style={{
              background: active ? 'rgba(74,158,255,0.15)' : 'rgba(255,255,255,0.04)',
              borderColor: active ? '#4A9EFF' : 'rgba(255,255,255,0.06)',
            }}
          >
            <Icon size={20} className={active ? 'text-accent-blue' : 'text-text-muted'} />
          </motion.button>
        )
      })}
    </div>
  )
}
