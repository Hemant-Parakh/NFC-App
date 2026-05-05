import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Timer, Play, Pause, RotateCcw } from 'lucide-react'
import { formatDuration } from '../../utils/helpers.js'

export default function TimerCard({ action, accentColor }) {
  const total = action.duration ?? 25 * 60
  const [remaining, setRemaining] = useState(total)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setFinished(true)
            return 0
          }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const reset = () => {
    setRunning(false)
    setRemaining(total)
    setFinished(false)
  }

  const progress = 1 - remaining / total
  const r = 36
  const circ = 2 * Math.PI * r

  return (
    <div className="rounded-2xl bg-surface2 border border-white/5 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '20' }}
        >
          <Timer size={18} style={{ color: accentColor }} />
        </div>
        <div>
          <p className="text-text-primary text-sm font-semibold">{action.title}</p>
          <p className="text-text-muted text-xs">{Math.floor(total / 60)} min timer</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        {/* Circular progress */}
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <motion.circle
              cx="50" cy="50" r={r}
              fill="none"
              stroke={accentColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ * (1 - progress) }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-text-primary text-xl font-bold tabular-nums leading-none">
              {formatDuration(remaining)}
            </p>
            {finished && <p className="text-[10px] mt-0.5" style={{ color: accentColor }}>Done!</p>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => { setRunning(v => !v); setFinished(false) }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-bg"
            style={{ background: accentColor }}
          >
            {running ? <Pause size={16} /> : <Play size={16} />}
            {running ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={reset}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm text-text-secondary bg-white/5 active:bg-white/10"
          >
            <RotateCcw size={14} />
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  )
}
