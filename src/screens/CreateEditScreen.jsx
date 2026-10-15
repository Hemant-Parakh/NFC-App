import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import * as Icons from 'lucide-react'
import {
  ArrowLeft, Heart, Plus, GripVertical, Trash2, ChevronDown, ChevronUp,
  Link2, CheckSquare, Timer, StickyNote, MessageSquare, Smartphone, X
} from 'lucide-react'
import IconPicker from '../components/IconPicker.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import { accentHex, generateId, ACCENT_COLORS } from '../utils/helpers.js'

const ACTION_TYPES = [
  { type: 'link',        label: 'Link',            icon: Link2,         color: 'text-accent-blue' },
  { type: 'checklist',   label: 'Checklist',       icon: CheckSquare,   color: 'text-accent-mint' },
  { type: 'timer',       label: 'Timer',           icon: Timer,         color: 'text-accent-amber' },
  { type: 'note',        label: 'Note',            icon: StickyNote,    color: 'text-accent-violet' },
  { type: 'message',     label: 'Message',         icon: MessageSquare, color: 'text-accent-coral' },
  { type: 'appshortcut', label: 'App Shortcut',    icon: Smartphone,    color: 'text-accent-sky' },
]

function defaultAction(type) {
  const base = { id: generateId(), type, title: '' }
  switch (type) {
    case 'link':        return { ...base, title: 'Open link', url: '' }
    case 'checklist':   return { ...base, title: 'Checklist', items: [{ id: generateId(), text: '', checked: false }] }
    case 'timer':       return { ...base, title: 'Timer', duration: 25 * 60 }
    case 'note':        return { ...base, title: 'Note', content: '' }
    case 'message':     return { ...base, title: 'Message template', content: '' }
    case 'appshortcut': return { ...base, title: 'Open app', url: '' }
    default:            return base
  }
}

function ActionEditor({ action, onUpdate, onDelete, accentColor }) {
  const [open, setOpen] = useState(true)
  const meta = ACTION_TYPES.find(t => t.type === action.type)
  const MetaIcon = meta?.icon ?? Icons.Star

  return (
    <div className="rounded-2xl bg-surface2 border border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="text-text-muted cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </div>
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
          <MetaIcon size={14} className={meta?.color ?? 'text-text-muted'} />
        </div>
        <input
          type="text"
          value={action.title}
          onChange={e => onUpdate({ ...action, title: e.target.value })}
          placeholder="Action title"
          className="flex-1 text-sm font-semibold text-text-primary bg-transparent"
        />
        <button onClick={() => setOpen(v => !v)} className="p-1">
          {open ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
        </button>
        <button onClick={onDelete} className="p-1">
          <Trash2 size={14} className="text-text-muted" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Link / AppShortcut */}
              {(action.type === 'link' || action.type === 'appshortcut') && (
                <input
                  type="text"
                  value={action.url ?? ''}
                  onChange={e => onUpdate({ ...action, url: e.target.value })}
                  placeholder="https://…"
                  className="w-full text-sm px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-text-primary"
                />
              )}

              {/* Timer */}
              {action.type === 'timer' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={Math.floor((action.duration ?? 0) / 60)}
                    onChange={e => onUpdate({ ...action, duration: Math.max(1, Number(e.target.value)) * 60 })}
                    min={1}
                    max={999}
                    className="w-20 text-sm px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-text-primary text-center"
                  />
                  <span className="text-text-muted text-sm">minutes</span>
                </div>
              )}

              {/* Note / Message */}
              {(action.type === 'note' || action.type === 'message') && (
                <textarea
                  value={action.content ?? ''}
                  onChange={e => onUpdate({ ...action, content: e.target.value })}
                  placeholder={action.type === 'message' ? 'Message to copy…' : 'Note content…'}
                  rows={3}
                  className="w-full text-sm px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 text-text-secondary resize-none leading-relaxed"
                />
              )}

              {/* Checklist items */}
              {action.type === 'checklist' && (
                <div className="space-y-2">
                  {(action.items ?? []).map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border border-white/10 flex-shrink-0" />
                      <input
                        type="text"
                        value={item.text}
                        onChange={e => {
                          const items = action.items.map(it => it.id === item.id ? { ...it, text: e.target.value } : it)
                          onUpdate({ ...action, items })
                        }}
                        placeholder={`Item ${idx + 1}`}
                        className="flex-1 text-sm px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-text-secondary"
                      />
                      <button
                        onClick={() => onUpdate({ ...action, items: action.items.filter(it => it.id !== item.id) })}
                        className="p-1.5 rounded-lg bg-white/5"
                      >
                        <X size={12} className="text-text-muted" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => onUpdate({ ...action, items: [...(action.items ?? []), { id: generateId(), text: '', checked: false }] })}
                    className="flex items-center gap-2 text-xs py-2 px-3 rounded-xl bg-white/5 text-text-secondary w-full"
                  >
                    <Plus size={12} />
                    Add item
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CreateEditScreen({ deck, navigate, createDeck, updateDeck }) {
  const isEdit = !!deck
  const [name, setName] = useState(deck?.name ?? '')
  const [icon, setIcon] = useState(deck?.icon ?? 'Star')
  const [color, setColor] = useState(deck?.color ?? 'blue')
  const [description, setDescription] = useState(deck?.description ?? '')
  const [isFavorite, setIsFavorite] = useState(deck?.isFavorite ?? false)
  const [actions, setActions] = useState(deck?.actions ?? [])
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showAddAction, setShowAddAction] = useState(false)
  const [saving, setSaving] = useState(false)

  const accentColor = accentHex(color)
  const DeckIcon = Icons[icon] ?? Icons.Star

  const updateAction = (updated) => {
    setActions(prev => prev.map(a => a.id === updated.id ? updated : a))
  }

  const deleteAction = (id) => {
    setActions(prev => prev.filter(a => a.id !== id))
  }

  const addAction = (type) => {
    setActions(prev => [...prev, defaultAction(type)])
    setShowAddAction(false)
  }

  const save = () => {
    if (!name.trim()) return
    setSaving(true)
    const data = { name: name.trim(), icon, color, description, isFavorite, actions }
    if (isEdit) {
      updateDeck(deck.id, data)
      navigate(`deck/${deck.id}`)
    } else {
      const id = createDeck(data)
      navigate(`deck/${id}`)
    }
  }

  return (
    <div className="pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate(isEdit ? `deck/${deck.id}` : 'home')}
          className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-text-secondary" />
        </motion.button>
        <h1 className="text-text-primary font-bold text-lg">{isEdit ? 'Edit Deck' : 'New Deck'}</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={save}
          disabled={!name.trim()}
          className="px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-40"
          style={{ background: accentColor, color: '#0A0E14' }}
        >
          {saving ? '…' : 'Save'}
        </motion.button>
      </div>

      <div className="px-5 space-y-5">
        {/* Deck identity row */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/5">
          <button
            onClick={() => setShowIconPicker(v => !v)}
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: accentColor + '22' }}
          >
            <DeckIcon size={28} style={{ color: accentColor }} />
          </button>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Deck name"
              className="w-full text-text-primary text-lg font-bold bg-transparent border-b border-white/10 pb-1 mb-2"
            />
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="w-full text-text-secondary text-sm bg-transparent"
            />
          </div>
          <button onClick={() => setIsFavorite(v => !v)}>
            <Heart
              size={20}
              style={isFavorite ? { color: accentColor, fill: accentColor } : {}}
              className={isFavorite ? '' : 'text-text-muted'}
            />
          </button>
        </div>

        {/* Icon picker */}
        <AnimatePresence>
          {showIconPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-surface border border-white/5">
                <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-3">Icon</p>
                <IconPicker value={icon} onChange={(v) => { setIcon(v); setShowIconPicker(false) }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color picker */}
        <div className="p-4 rounded-2xl bg-surface border border-white/5">
          <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-3">Accent Colour</p>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        {/* Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-widest">Actions</p>
            <span className="text-text-muted text-xs">{actions.length} added</span>
          </div>

          <Reorder.Group axis="y" values={actions} onReorder={setActions} className="space-y-2">
            {actions.map(action => (
              <Reorder.Item key={action.id} value={action} className="list-none">
                <ActionEditor
                  action={action}
                  onUpdate={updateAction}
                  onDelete={() => deleteAction(action.id)}
                  accentColor={accentColor}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>

          {actions.length === 0 && (
            <div className="py-8 text-center text-text-muted text-sm">
              No actions yet. Add one below.
            </div>
          )}

          {/* Add action button */}
          <div className="mt-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAddAction(v => !v)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#8899AA', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Plus size={15} />
              Add Action
            </motion.button>

            <AnimatePresence>
              {showAddAction && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="mt-2 p-3 rounded-2xl bg-surface border border-white/5 grid grid-cols-3 gap-2"
                >
                  {ACTION_TYPES.map(({ type, label, icon: TypeIcon, color: typeColor }) => (
                    <motion.button
                      key={type}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => addAction(type)}
                      className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <TypeIcon size={18} className={typeColor} />
                      <span className="text-text-secondary text-xs font-medium leading-tight text-center">{label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
