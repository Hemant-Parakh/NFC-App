import React from 'react'

export default function SectionLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3 px-5">
      <h2
        className="text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color: '#3D5066' }}
      >
        {children}
      </h2>
      {action && <div>{action}</div>}
    </div>
  )
}
