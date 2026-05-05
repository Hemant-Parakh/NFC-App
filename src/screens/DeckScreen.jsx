import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ArrowLeft, Edit2, Heart, Share2, Link2, Copy, Check, Trash2 } from 'lucide-react'
import ActionCard from '../components/ActionCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { accentHex, getDeckUrl } from '../utils/helpers.js'

export default function DeckScreen({ deck, navigate, updateDeck, deleteDeck, toggleFavorite }) {
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!deck) {
    return (
      <div className="p-5">
        <button onClick={() => navigate('home')} className="text-text-secondary text-sm flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
        <EmptyState icon="AlertCircle" title="Deck not found" body="This deck may have been deleted." />
      </div>
    )
  }

  const Icon = Icons[deck.icon] ?? Icons.Star
  const color = accentHex(deck.color)
  const deckUrl = getDeckUrl(deck.id)

  const handleActionUpdate = (updatedAction) => {
    const actions = deck.actions.map(a => a.id === updatedAction.id ? updatedAction : a)
    updateDeck(deck.id, { actions })
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(deckUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = () => {
    deleteDeck(deck.id)
    navigate('home')
  }

  return (
    <div className="pb-8">
      {/* Header / Hero */}
      <div
        className="px-5 pt-5 pb-6 relative"
        style={{ background: `linear-gradient(180deg, ${color}12 0%, transparent 100%)` }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate('home')}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-text-secondary" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => toggleFavorite(deck.id)}
              className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
            >
              <Heart
                size={17}
                style={deck.isFavorite ? { color, fill: color } : {}}
                className={deck.isFavorite ? '' : 'text-text-muted'}
              />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => setShowShare(v => !v)}
              className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
            >
              <Share2 size={17} className="text-text-muted" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => navigate(`edit/${deck.id}`)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-sm"
              style={{ background: color + '18', color }}
            >
              <Edit2 size={14} />
              Edit
            </motion.button>
          </div>
        </div>

        {/* Deck identity */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{ background: color + '22', boxShadow: `0 0 24px ${color}25` }}
          >
            <Icon size={30} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-text-primary text-2xl font-bold tracking-tight">{deck.name}</h1>
            {deck.description && (
              <p className="text-text-secondary text-sm mt-1 leading-relaxed">{deck.description}</p>
            )}
            <p className="text-text-muted text-xs mt-1.5">
              {deck.actions.length} action{deck.actions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Share panel */}
        <AnimatePresence>
          {showShare && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="mt-5 p-4 rounded-2xl bg-surface2 border border-white/5"
            >
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-widest mb-3">
                Deck Link
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 mb-3">
                <Link2 size={13} className="text-text-muted flex-shrink-0" />
                <p className="text-text-secondary text-xs flex-1 truncate font-mono">{deckUrl}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={copyUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: color + '18', color, border: `1px solid ${color}30` }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy link'}
              </motion.button>
              <p className="text-text-muted text-xs text-center mt-3 leading-relaxed">
                Use this link to pin to home screen, write to an NFC tag, or share as a QR code.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 mx-5 mb-6" />

      {/* Actions */}
      <div className="px-5 space-y-3">
        {deck.actions.length === 0 ? (
          <EmptyState
            icon="Plus"
            title="No actions yet"
            body="Edit this deck to add timers, checklists, links, and more."
            action={
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`edit/${deck.id}`)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm"
                style={{ background: color + '18', color }}
              >
                <Edit2 size={15} />
                Edit Deck
              </motion.button>
            }
          />
        ) : (
          deck.actions.map(action => (
            <ActionCard
              key={action.id}
              action={action}
              deckColor={deck.color}
              onUpdate={handleActionUpdate}
            />
          ))
        )}
      </div>

      {/* Delete zone */}
      <div className="px-5 mt-10">
        <div className="h-px bg-white/5 mb-6" />
        {!showDeleteConfirm ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-text-muted text-sm py-2"
          >
            <Trash2 size={15} />
            Delete deck
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-2xl bg-surface2 border border-white/5"
          >
            <p className="text-text-primary text-sm font-semibold mb-1">Delete "{deck.name}"?</p>
            <p className="text-text-muted text-xs mb-4">This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-text-secondary text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/15 text-red-400 text-sm font-semibold border border-red-500/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
