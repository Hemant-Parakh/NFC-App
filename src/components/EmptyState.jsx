import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export default function EmptyState({ icon = 'LayoutGrid', title, body, action }) {
  const Icon = Icons[icon] ?? Icons.LayoutGrid
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div
        className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Icon size={26} style={{ color: '#3D5066' }} />
      </div>
      <p className="text-text-primary font-semibold text-[15px] mb-2 text-balance">{title}</p>
      {body && <p className="text-text-secondary text-sm leading-relaxed text-balance max-w-[240px]">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
