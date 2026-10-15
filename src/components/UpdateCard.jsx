import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDownToLine, Loader2, ShieldCheck, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react'

const firstLine = s => (s ?? '').split('\n').find(l => l.trim()) ?? ''

function Progress({ value, color }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        animate={{ width: `${Math.max(4, value)}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 26 }}
      />
    </div>
  )
}

function StatusLine({ updater, color }) {
  const { status, progress, error } = updater
  if (status === 'downloading') {
    return (
      <div className="space-y-2">
        <Progress value={progress} color={color} />
        <p className="text-[12px] font-medium" style={{ color: '#8899AA' }}>Downloading… {progress}%</p>
      </div>
    )
  }
  if (status === 'installing') {
    return <p className="text-[12px] font-medium" style={{ color }}>Opening Android installer — tap “Update” there to finish.</p>
  }
  if (status === 'needs-permission') {
    return (
      <p className="flex gap-1.5 text-[12px] leading-relaxed" style={{ color: '#FBBF24' }}>
        <ShieldCheck size={14} className="flex-shrink-0 mt-px" />
        Turn on “Allow from this source” for TapDeck, come back, then tap Update again. One-time step.
      </p>
    )
  }
  if (status === 'error' && error) {
    return (
      <p className="flex gap-1.5 text-[12px] leading-relaxed" style={{ color: '#FB7185' }}>
        <AlertTriangle size={14} className="flex-shrink-0 mt-px" />
        {error}
      </p>
    )
  }
  return null
}

/* Home-screen banner: shown only when a newer version exists and wasn't dismissed. */
export function UpdateBanner({ updater, accent }) {
  const busy = updater.status === 'downloading' || updater.status === 'installing'
  const visible = updater.showBanner || busy

  return (
    <AnimatePresence initial={false}>
      {visible && updater.latest && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 28 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          className="px-5 overflow-hidden"
        >
          <div
            className="p-4 rounded-3xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accent}1C, rgba(18,24,32,0.95) 75%)`,
              border: `1px solid ${accent}35`,
              boxShadow: `0 8px 32px ${accent}14`,
            }}
          >
            <div className="flex items-start gap-3.5">
              <motion.div
                animate={busy ? {} : { y: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: accent + '22' }}
              >
                {busy
                  ? <Loader2 size={20} className="animate-spin" style={{ color: accent }} />
                  : <ArrowDownToLine size={20} style={{ color: accent }} strokeWidth={2.2} />}
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold" style={{ color: '#EEF3FF' }}>Update available</p>
                <p className="text-[12px] mt-0.5" style={{ color: '#5A6A7E' }}>
                  v{updater.current.name} → <span style={{ color: accent }}>v{updater.latest.name}</span> · {updater.latest.sizeMb} MB
                </p>
                {firstLine(updater.latest.notes) && !busy && (
                  <p className="text-[13px] mt-2 leading-snug line-clamp-2" style={{ color: '#A0B0C4' }}>
                    {firstLine(updater.latest.notes)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-3.5">
              <StatusLine updater={updater} color={accent} />
            </div>

            {!busy && (
              <div className="flex gap-2 mt-3.5">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={updater.install}
                  className="flex-1 py-3 rounded-2xl font-bold text-[14px]"
                  style={{ background: accent, color: '#0A0E14' }}
                >
                  Update now
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={updater.dismiss}
                  className="px-5 py-3 rounded-2xl font-semibold text-[14px]"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#8899AA' }}
                >
                  Later
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* Settings section: always shows the installed version and a manual check. */
export function UpdateSettings({ updater, accent }) {
  const { current, supported, latest, available, status, lastChecked } = updater
  const busy = status === 'downloading' || status === 'installing'

  const subtitle = !supported
    ? 'Updates install automatically in the browser version'
    : status === 'checking'
      ? 'Checking for updates…'
      : available
        ? `Version ${latest.name} is ready (${latest.sizeMb} MB)`
        : lastChecked
          ? `Up to date · checked ${new Date(lastChecked).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`
          : 'Not checked yet'

  return (
    <div className="p-4 rounded-2xl" style={{ background: 'rgba(18,24,32,0.9)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (available ? accent : '#34D399') + '18' }}>
          {available
            ? <ArrowDownToLine size={16} style={{ color: accent }} />
            : <CheckCircle2 size={16} style={{ color: '#34D399' }} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold" style={{ color: '#D0DCF0' }}>TapDeck {current.name === 'dev' ? '(dev build)' : `v${current.name}`}</p>
          <p className="text-[12px] mt-0.5" style={{ color: available ? accent : '#3D5066' }}>{subtitle}</p>
        </div>
      </div>

      {supported && (
        <>
          {(status !== 'idle' && status !== 'checking') && (
            <div className="mt-3"><StatusLine updater={updater} color={accent} /></div>
          )}
          {available && latest.notes && !busy && (
            <div className="mt-3 p-3 rounded-xl max-h-40 overflow-y-auto scrollable" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#3D5066' }}>What's new</p>
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: '#8899AA' }}>{latest.notes}</p>
            </div>
          )}
          {!busy && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={status === 'checking'}
              onClick={available ? updater.install : () => updater.check({ force: true })}
              className="w-full mt-3 py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              style={available
                ? { background: accent, color: '#0A0E14' }
                : { background: 'rgba(255,255,255,0.06)', color: '#B8C8DC' }}
            >
              {available
                ? <><ArrowDownToLine size={14} /> Update to v{latest.name}</>
                : <><RefreshCw size={14} className={status === 'checking' ? 'animate-spin' : ''} /> Check for updates</>}
            </motion.button>
          )}
        </>
      )}
    </div>
  )
}
