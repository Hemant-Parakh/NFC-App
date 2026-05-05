import React from 'react'
import * as Icons from 'lucide-react'

export default function EmptyState({ icon = 'LayoutGrid', title, body, action }) {
  const Icon = Icons[icon] ?? Icons.LayoutGrid
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
        <Icon size={28} className="text-text-muted" />
      </div>
      <p className="text-text-primary font-semibold text-base mb-2">{title}</p>
      {body && <p className="text-text-secondary text-sm leading-relaxed">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
