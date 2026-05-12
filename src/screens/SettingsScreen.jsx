import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Trash2, Info, ChevronRight, Moon, Check, AlertTriangle } from 'lucide-react'
import { exportData, importData, clearAll } from '../utils/storage.js'

function SettingRow({ icon: Icon, iconColor = '#8899AA', label, sublabel, onClick, right, danger }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left"
      style={{ background: 'rgba(18,24,32,0.9)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconColor + '18' }}
      >
        <Icon size={16} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[14px] font-semibold"
          style={{ color: danger ? '#FB7185' : '#D0DCF0' }}
        >
          {label}
        </p>
        {sublabel && (
          <p className="text-[12px] mt-0.5" style={{ color: '#3D5066' }}>{sublabel}</p>
        )}
      </div>
      {right ?? <ChevronRight size={14} style={{ color: '#3D5066' }} />}
    </motion.button>
  )
}

export default function SettingsScreen({ decks, setDecks }) {
  const [toast, setToast] = useState(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const fileRef = useRef()

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2500)
  }

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tapdeck-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Exported successfully')
    } catch {
      showToast('Export failed', false)
    }
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result)
        importData(json)
        setDecks(json.decks)
        showToast(`Imported ${json.decks.length} decks`)
      } catch {
        showToast('Invalid file', false)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClear = () => {
    clearAll()
    setDecks([])
    setShowClearConfirm(false)
    showToast('All data cleared')
  }

  return (
    <div className="px-5 pt-7 pb-8">
      <h1
        className="font-extrabold mb-7"
        style={{ fontSize: '26px', color: '#EEF3FF', letterSpacing: '-0.025em' }}
      >
        Settings
      </h1>

      {/* Appearance */}
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#3D5066' }}>
        Appearance
      </p>
      <div className="mb-6">
        <SettingRow
          icon={Moon}
          iconColor="#A78BFA"
          label="Dark Mode"
          sublabel="Always on — designed for dark"
          right={
            <div
              className="w-10 h-6 rounded-full flex items-center justify-end px-0.5"
              style={{ background: 'rgba(167,139,250,0.25)' }}
            >
              <div className="w-5 h-5 rounded-full" style={{ background: '#A78BFA' }} />
            </div>
          }
        />
      </div>

      {/* Data */}
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#3D5066' }}>
        Data
      </p>
      <div className="space-y-2 mb-6">
        <SettingRow
          icon={Download}
          iconColor="#34D399"
          label="Export decks"
          sublabel={`${decks.length} deck${decks.length !== 1 ? 's' : ''} saved locally`}
          onClick={handleExport}
        />
        <SettingRow
          icon={Upload}
          iconColor="#4A9EFF"
          label="Import decks"
          sublabel="Restore from a backup file"
          onClick={() => fileRef.current?.click()}
        />
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      {/* Danger zone */}
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#3D5066' }}>
        Danger Zone
      </p>
      <div className="mb-8">
        {!showClearConfirm ? (
          <SettingRow
            icon={Trash2}
            iconColor="#FB7185"
            label="Clear all data"
            sublabel="Removes all decks and settings"
            danger
            onClick={() => setShowClearConfirm(true)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl"
            style={{ background: 'rgba(18,24,32,0.95)', border: '1px solid rgba(251,113,133,0.18)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={15} style={{ color: '#FB7185' }} />
              <p className="text-[14px] font-semibold" style={{ color: '#EEF3FF' }}>Clear all data?</p>
            </div>
            <p className="text-[12px] mb-4 leading-relaxed" style={{ color: '#4A5568' }}>
              All {decks.length} deck{decks.length !== 1 ? 's' : ''} will be permanently deleted.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#7A8A9E' }}
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ background: 'rgba(251,113,133,0.12)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.2)' }}
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* About */}
      <div
        className="p-5 rounded-2xl text-center"
        style={{ background: 'rgba(18,24,32,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: 'rgba(74,158,255,0.12)', border: '1px solid rgba(74,158,255,0.18)' }}
        >
          <span className="text-2xl font-black" style={{ color: '#4A9EFF', fontFamily: 'system-ui' }}>T</span>
        </div>
        <p className="font-bold text-[17px]" style={{ color: '#EEF3FF' }}>TapDeck</p>
        <p className="text-[13px] mt-0.5" style={{ color: '#4A5568' }}>One tap. Right routine.</p>
        <p className="text-[12px] mt-3" style={{ color: '#3D5066' }}>Version 1.0.0</p>
        <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: '#3D5066' }}>
          Everything stays on your device. No accounts, no sync, no tracking.
        </p>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold z-50 shadow-card"
            style={{
              background: toast.ok ? 'rgba(52,211,153,0.15)' : 'rgba(251,113,133,0.15)',
              color: toast.ok ? '#34D399' : '#FB7185',
              border: `1px solid ${toast.ok ? 'rgba(52,211,153,0.25)' : 'rgba(251,113,133,0.25)'}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <Check size={15} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
