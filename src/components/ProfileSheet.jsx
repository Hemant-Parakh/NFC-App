import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, ArrowLeft, Check, Pencil, UserPlus, Trash2, Lock } from 'lucide-react'
import ProfileAvatar from './ProfileAvatar.jsx'
import ColorPicker from './ColorPicker.jsx'
import { accentHex, ACCENT_COLORS } from '../utils/helpers.js'

const swap = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -16 },
  transition: { type: 'spring', stiffness: 420, damping: 38 },
}

function ProfileForm({ initial, defaultColor, submitLabel, showStarters, onSubmit, onDelete, canDelete }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState(initial?.color ?? defaultColor)
  const [withStarters, setWithStarters] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const c = accentHex(color)
  const valid = name.trim().length > 0

  const submit = (e) => {
    e.preventDefault()
    if (valid) onSubmit({ name: name.trim(), color, withStarters })
  }

  return (
    <form onSubmit={submit}>
      <div className="flex justify-center mb-6">
        <motion.div key={color} initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
          <ProfileAvatar profile={{ name: name || '?', color }} size={76} ring />
        </motion.div>
      </div>

      <label className="block text-[11px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#3D5066' }}>
        Name
      </label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="e.g. Work, Priya, Kids"
        maxLength={24}
        autoFocus={!initial}
        className="w-full px-4 py-3.5 rounded-2xl mb-5 font-semibold"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${valid ? c + '40' : 'rgba(255,255,255,0.07)'}`, color: '#EEF3FF' }}
      />

      <label className="block text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#3D5066' }}>
        Colour
      </label>
      <div className="mb-5">
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {showStarters && (
        <button
          type="button"
          onClick={() => setWithStarters(v => !v)}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-5 text-left"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex-1">
            <p className="text-[14px] font-semibold" style={{ color: '#D0DCF0' }}>Start with sample decks</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#3D5066' }}>Desk, Bed, Kitchen, Front Door and more</p>
          </div>
          <div
            className="w-11 h-6 rounded-full flex items-center px-0.5 transition-colors"
            style={{ background: withStarters ? c + '50' : 'rgba(255,255,255,0.1)', justifyContent: withStarters ? 'flex-end' : 'flex-start' }}
          >
            <motion.div layout transition={{ type: 'spring', stiffness: 600, damping: 32 }} className="w-5 h-5 rounded-full" style={{ background: withStarters ? c : '#5A6A7E' }} />
          </div>
        </button>
      )}

      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        disabled={!valid}
        className="w-full py-3.5 rounded-2xl font-bold text-[15px] disabled:opacity-40"
        style={{ background: c, color: '#0A0E14', boxShadow: valid ? `0 6px 24px ${c}40` : 'none' }}
      >
        {submitLabel}
      </motion.button>

      {onDelete && (
        <div className="mt-4">
          {!canDelete ? (
            <p className="flex items-center justify-center gap-1.5 text-[12px] py-2" style={{ color: '#3D5066' }}>
              <Lock size={12} /> The only profile can't be deleted
            </p>
          ) : !confirmDelete ? (
            <button type="button" onClick={() => setConfirmDelete(true)} className="w-full flex items-center justify-center gap-2 py-3 text-[13px] font-medium" style={{ color: '#FB7185' }}>
              <Trash2 size={14} /> Delete profile
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl" style={{ background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.18)' }}>
              <p className="text-[13px] font-semibold mb-1" style={{ color: '#EEF3FF' }}>Delete “{initial.name}”?</p>
              <p className="text-[12px] mb-3" style={{ color: '#5A6A7E' }}>All of this profile's decks will be removed from this device.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl text-[13px] font-medium" style={{ background: 'rgba(255,255,255,0.06)', color: '#7A8A9E' }}>Cancel</button>
                <button type="button" onClick={onDelete} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold" style={{ background: 'rgba(251,113,133,0.14)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.25)' }}>Delete</button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </form>
  )
}

export default function ProfileSheet({ open, onClose, profiles, activeId, deckCounts, onSwitch, onCreate, onUpdate, onDelete }) {
  const [mode, setMode] = useState('list') // 'list' | 'create' | <profileId> (edit)
  const dragControls = useDragControls()

  useEffect(() => { if (open) setMode('list') }, [open])

  const editing = profiles.find(p => p.id === mode)
  const usedColors = new Set(profiles.map(p => p.color))
  const nextColor = Object.keys(ACCENT_COLORS).find(k => !usedColors.has(k)) ?? 'violet'
  const title = mode === 'list' ? 'Who’s using TapDeck?' : mode === 'create' ? 'New profile' : 'Edit profile'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[60]"
            style={{ background: 'rgba(2,4,8,0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-label="Profiles"
            className="fixed bottom-0 left-1/2 w-full max-w-[430px] z-[70] rounded-t-[28px] safe-bottom flex flex-col"
            style={{
              x: '-50%',
              maxHeight: '88dvh',
              background: 'linear-gradient(180deg, #161D2A 0%, #0E131B 100%)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.6)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 100 || info.velocity.y > 600) onClose() }}
          >
            {/* Drag handle + header */}
            <div className="pt-3 pb-2 px-5 touch-none cursor-grab" onPointerDown={e => dragControls.start(e)}>
              <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <div className="flex items-center gap-3">
                {mode !== 'list' && (
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMode('list')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }} aria-label="Back">
                    <ArrowLeft size={17} style={{ color: '#8899AA' }} />
                  </motion.button>
                )}
                <h2 className="flex-1 font-extrabold text-[20px]" style={{ color: '#EEF3FF', letterSpacing: '-0.02em' }}>{title}</h2>
                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }} aria-label="Close">
                  <X size={17} style={{ color: '#8899AA' }} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollable px-5 pt-3 pb-6">
              <AnimatePresence mode="wait" initial={false}>
                {mode === 'list' && (
                  <motion.div key="list" {...swap}>
                    <div className="space-y-2">
                      {profiles.map(p => {
                        const active = p.id === activeId
                        const c = accentHex(p.color)
                        const n = deckCounts[p.id] ?? 0
                        return (
                          <motion.div
                            layout
                            key={p.id}
                            className="flex items-center gap-2 p-2.5 rounded-[20px]"
                            style={{
                              background: active ? `linear-gradient(135deg, ${c}16, ${c}06)` : 'rgba(255,255,255,0.025)',
                              border: `1px solid ${active ? c + '35' : 'rgba(255,255,255,0.05)'}`,
                            }}
                          >
                            <motion.button whileTap={{ scale: 0.98 }} onClick={() => onSwitch(p.id)} className="flex-1 flex items-center gap-3.5 min-w-0 text-left">
                              <ProfileAvatar profile={p} size={46} ring={active} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-bold truncate" style={{ color: '#EEF3FF' }}>{p.name}</p>
                                <p className="text-[12px] mt-0.5" style={{ color: active ? c : '#3D5066' }}>
                                  {active ? 'Using now · ' : ''}{n} deck{n !== 1 ? 's' : ''}
                                </p>
                              </div>
                              {active && (
                                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: c }}>
                                  <Check size={13} strokeWidth={3} style={{ color: '#0A0E14' }} />
                                </div>
                              )}
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.88 }} onClick={() => setMode(p.id)} className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }} aria-label={`Edit ${p.name}`}>
                              <Pencil size={14} style={{ color: '#5A6A7E' }} />
                            </motion.button>
                          </motion.div>
                        )
                      })}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMode('create')}
                      className="w-full flex items-center gap-3.5 p-2.5 mt-2 rounded-[20px] text-left"
                      style={{ border: '1.5px dashed rgba(255,255,255,0.1)' }}
                    >
                      <div className="w-[46px] h-[46px] rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <UserPlus size={19} style={{ color: '#8899AA' }} />
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold" style={{ color: '#B8C8DC' }}>Add profile</p>
                        <p className="text-[12px] mt-0.5" style={{ color: '#3D5066' }}>For family, a partner, or a work mode</p>
                      </div>
                    </motion.button>

                    <p className="text-[11px] text-center leading-relaxed mt-6 px-4" style={{ color: '#3D5066' }}>
                      Each profile has its own decks, pins and history. Everything stays on this phone.
                    </p>
                  </motion.div>
                )}

                {mode === 'create' && (
                  <motion.div key="create" {...swap}>
                    <ProfileForm defaultColor={nextColor} submitLabel="Create profile" showStarters onSubmit={onCreate} />
                  </motion.div>
                )}

                {editing && (
                  <motion.div key={`edit-${editing.id}`} {...swap}>
                    <ProfileForm
                      initial={editing}
                      submitLabel="Save changes"
                      onSubmit={({ name, color }) => { onUpdate(editing.id, { name, color }); setMode('list') }}
                      onDelete={() => { onDelete(editing.id); setMode('list') }}
                      canDelete={profiles.length > 1}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
