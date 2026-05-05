import React from 'react'
import { motion } from 'framer-motion'
import { Hand, Pin, Wifi, QrCode, Share2, ShieldCheck } from 'lucide-react'

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 360, damping: 32 } },
}

const optional = [
  {
    icon: Pin,
    color: '#34D399',
    title: 'Pin to home screen',
    body: 'Each deck has a unique URL. In your browser, tap Share → "Add to Home Screen" to create a one-tap icon on your phone.',
  },
  {
    icon: Wifi,
    color: '#A78BFA',
    title: 'NFC tag',
    body: 'Write a deck URL to a cheap NFC tag (≈$1). Tap your phone to the tag and the deck opens. Perfect for your desk, front door, or laundry room.',
  },
  {
    icon: QrCode,
    color: '#FBBF24',
    title: 'QR code',
    body: 'Use any free QR generator with a deck URL. Print it, stick it somewhere, and scan to jump straight in.',
  },
  {
    icon: Share2,
    color: '#F97316',
    title: 'Share a link',
    body: 'Copy any deck link and send it. Great for sharing routines with family or teammates.',
  },
]

export default function ShortcutsScreen() {
  return (
    <div className="px-5 pt-7 pb-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        className="mb-8"
      >
        <h1
          className="font-extrabold mb-2"
          style={{ fontSize: '26px', color: '#EEF3FF', letterSpacing: '-0.025em' }}
        >
          Open decks faster
        </h1>
        <p className="text-[14px] leading-relaxed" style={{ color: '#5A6A7E' }}>
          TapDeck works perfectly without any setup. These are optional shortcuts.
        </p>
      </motion.div>

      {/* ── Primary: manual opening ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32, delay: 0.05 }}
        className="rounded-3xl p-5 mb-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(74,158,255,0.14), rgba(74,158,255,0.06))',
          border: '1px solid rgba(74,158,255,0.2)',
        }}
      >
        {/* Glow dot */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(74,158,255,0.12), transparent 70%)', transform: 'translate(30%, -30%)' }}
        />

        <div className="flex items-start gap-4 relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(74,158,255,0.18)' }}
          >
            <Hand size={22} style={{ color: '#4A9EFF' }} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="font-bold text-[16px]" style={{ color: '#EEF3FF', letterSpacing: '-0.01em' }}>
                Open manually
              </p>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(74,158,255,0.2)', color: '#4A9EFF' }}
              >
                MAIN WAY
              </span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: '#7A9ABB' }}>
              Just open TapDeck and tap a deck. Everything works instantly with no setup required.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Optional shortcuts ── */}
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#3D5066' }}>
        Optional shortcuts
      </p>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2.5 mb-8">
        {optional.map(({ icon: Icon, color, title, body }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className="flex gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(18,24,32,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: color + '18' }}
            >
              <Icon size={17} style={{ color }} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-[13px]" style={{ color: '#D0DCF0' }}>{title}</p>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#3D5066' }}
                >
                  Optional
                </span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: '#5A6A7E' }}>{body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Privacy card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="p-4 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={15} style={{ color: '#34D399' }} />
          <p className="text-[12px] font-bold" style={{ color: '#34D399' }}>Private by design</p>
        </div>
        <div className="space-y-1.5">
          {[
            'All data stays on your device',
            'No GPS or location tracking',
            'No background processes',
            'NFC is always optional',
          ].map(line => (
            <div key={line} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#3D5066' }} />
              <p className="text-[12px]" style={{ color: '#5A6A7E' }}>{line}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
