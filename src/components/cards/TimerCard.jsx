import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
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
  const SIZE = 130
  const R = 52
  const CIRC = 2 * Math.PI * R
  const mins = Math.floor(total / 60)

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: finished
          ? `linear-gradient(135deg, ${accentColor}12, rgba(18,24,32,0.95))`
          : 'rgba(18,24,32,0.95)',
        border: `1px solid ${finished ? accentColor + '30' : 'rgba(255,255,255,0.05)'}`,
        transition: 'background 0.5s, border-color 0.5s',
      }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: accentColor + '18' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-text-primary text-[14px] font-semibold">{action.title}</p>
          <p className="text-[12px]" style={{ color: '#3D5066' }}>{mins} minute timer</p>
        </div>
      </div>

      {/* Ring + controls */}
      <div className="flex flex-col items-center pb-5 pt-1">
        {/* SVG ring */}
        <div className="relative flex items-center justify-center mb-5">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="5"
            />
            {/* Glow copy (blur effect via filter) */}
            <motion.circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke={accentColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              animate={{ strokeDashoffset: CIRC - progress * CIRC, opacity: 0.25 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ filter: `blur(4px)` }}
            />
            {/* Foreground arc */}
            <motion.circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              fill="none"
              stroke={accentColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              animate={{ strokeDashoffset: CIRC - progress * CIRC }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute flex flex-col items-center">
            <motion.p
              className="tabular-nums font-bold leading-none"
              animate={{ scale: finished ? [1, 1.06, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: '26px',
                color: finished ? accentColor : '#E8EFF8',
                letterSpacing: '-0.03em',
              }}
            >
              {formatDuration(remaining)}
            </motion.p>
            <AnimatePresence>
              {finished && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-semibold mt-1 glow-pulse"
                  style={{ color: accentColor }}
                >
                  Done!
                </motion.p>
              )}
              {running && !finished && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] mt-1"
                  style={{ color: '#3D5066' }}
                >
                  running
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 px-5 w-full">
          <motion.button
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            onClick={() => { setRunning(v => !v); setFinished(false) }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm"
            style={{ background: accentColor, color: '#0A0E14' }}
          >
            <motion.span
              key={running ? 'pause' : 'play'}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            >
              {running ? <Pause size={16} strokeWidth={2.5} /> : <Play size={16} strokeWidth={2.5} />}
            </motion.span>
            {running ? 'Pause' : finished ? 'Restart' : 'Start'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            onClick={reset}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <RotateCcw size={16} style={{ color: '#5A6A7E' }} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
