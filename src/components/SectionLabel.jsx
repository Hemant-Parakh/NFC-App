import React from 'react'

export default function SectionLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3 px-5">
      <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-widest">{children}</h2>
      {action && <div>{action}</div>}
    </div>
  )
}
