import React from 'react'
import { motion } from 'framer-motion'
import { Hand, PinIcon, Wifi, QrCode, Share2, MapPin, BatteryFull } from 'lucide-react'

const steps = [
  {
    icon: Hand,
    color: '#4A9EFF',
    title: 'Open manually',
    body: 'Just open TapDeck and tap any deck. That\'s all you need. Everything works without any setup.',
  },
  {
    icon: PinIcon,
    color: '#34D399',
    title: 'Pin to home screen',
    body: 'Each deck has its own URL. In your browser, tap Share → "Add to Home Screen" with that URL to create a one-tap shortcut on your phone.',
  },
  {
    icon: Wifi,
    color: '#A78BFA',
    title: 'Optional: NFC tag',
    body: 'Write a deck\'s URL to a cheap NFC tag (≈$1 each). Tap your phone to the tag and the deck opens instantly. Great for physical spots like your desk or door.',
  },
  {
    icon: QrCode,
    color: '#FBBF24',
    title: 'Optional: QR code',
    body: 'Generate a QR code from any deck URL using a free QR generator. Print it, stick it somewhere, and scan to open the deck.',
  },
  {
    icon: Share2,
    color: '#F97316',
    title: 'Share with others',
    body: 'Copy a deck link and share it. Anyone with TapDeck can open it directly.',
  },
]

const nots = [
  { icon: MapPin, text: 'No GPS or location tracking' },
  { icon: BatteryFull, text: 'No background processes' },
  { icon: Wifi, text: 'NFC is optional — not required' },
]

export default function ShortcutsScreen() {
  return (
    <div className="px-5 pt-6 pb-8">
      <div className="mb-8">
        <h1 className="text-text-primary text-2xl font-bold tracking-tight mb-2">Shortcuts</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          TapDeck works great on its own. These are optional ways to open decks even faster.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {steps.map(({ icon: Icon, color, title, body }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
            className="flex gap-4 p-4 rounded-2xl bg-surface border border-white/5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: color + '20' }}
            >
              <Icon size={18} style={{ color }} />
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-sm font-semibold mb-1">{title}</p>
              <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Privacy note */}
      <div className="p-4 rounded-2xl bg-surface border border-white/5">
        <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-3">Privacy</p>
        <div className="space-y-2.5">
          {nots.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Icon size={12} className="text-text-muted" />
              </div>
              <p className="text-text-secondary text-sm">{text}</p>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs mt-4 leading-relaxed">
          All data stays on your device in localStorage. Nothing is sent to any server.
        </p>
      </div>
    </div>
  )
}
