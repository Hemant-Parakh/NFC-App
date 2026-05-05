import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { ACCENT_COLORS } from '../utils/helpers.js'

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {Object.values(ACCENT_COLORS).map(({ key, hex, label }) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(key)}
          title={label}
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
          style={{
            background: hex + '40',
            borderColor: value === key ? hex : 'transparent',
          }}
        >
          {value === key && <Check size={14} style={{ color: hex }} strokeWidth={3} />}
        </motion.button>
      ))}
    </div>
  )
}
