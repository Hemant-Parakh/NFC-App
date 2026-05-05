import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ArrowLeft, Edit2, Heart, Share2, Link2, Copy, Check, Trash2 } from 'lucide-react'
import ActionCard from '../components/ActionCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { accentHex, getDeckUrl } from '../utils/helpers.js'

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const slideUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 34, mass: 0.8 } },
}

export default function DeckScreen({ deck, navigate, updateDeck, deleteDeck, toggleFavorite }) {
  const [showShare, setShowShare]             = useState(false)
  const [copied, setCopied]                   = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!deck) {
    return (
      <div className="p-5 pt-6">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-sm mb-8"
          style={{ color: '#5A6A7E' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <EmptyState icon="AlertCircle" title="Deck not found" body="This deck may have been deleted." />
      </div>
    )
  }

  const DeckIcon  = Icons[deck.icon] ?? Icons.Star
  const color     = accentHex(deck.color)
  const deckUrl   = getDeckUrl(deck.id)

  const handleActionUpdate = updated => {
    const actions = deck.actions.map(a => a.id === updated.id ? updated : a)
    updateDeck(deck.id, { actions })
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(deckUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pb-10">

      {/* ── Hero ── */}
      <div
        className="relative px-5 pt-5 pb-7"
        style={{ background: `linear-gradient(180deg, ${color}14 0%, transparent 85%)` }}
      >
        {/* Top action bar */}
        <div className="flex items-center justify-between mb-7">
          <motion.button
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 600, damping: 30 }}
            onClick={() => navigate('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <ArrowLeft size={18} style={{ color: '#8899AA' }} />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(deck.id)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <Heart
                size={17}
                style={deck.isFavorite ? { color, fill: color } : { color: '#5A6A7E' }}
              />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowShare(v => !v)}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: showShare ? color + '18' : 'rgba(255,255,255,0.06)',
              }}
            >
              <Share2 size={17} style={{ color: showShare ? color : '#5A6A7E' }} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`edit/${deck.id}`)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-[13px]"
              style={{ background: color + '18', color }}
            >
              <Edit2 size={13} strokeWidth={2.5} />
              Edit
            </motion.button>
          </div>
        </div>

        {/* Deck identity */}
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${color}30, ${color}10)`,
              boxShadow: `0 0 32px ${color}22`,
            }}
          >
            <DeckIcon size={30} style={{ color }} strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0 pt-1">
            <h1
              className="font-extrabold leading-tight"
              style={{ fontSize: '22px', color: '#EEF3FF', letterSpacing: '-0.02em' }}
            >
              {deck.name}
            </h1>
            {deck.description && (
              <p className="text-[13px] mt-1 leading-relaxed" style={{ color: '#5A6A7E' }}>
                {deck.description}
              </p>
            )}
            <p className="text-[12px] mt-1.5 font-medium" style={{ color: '#3D5066' }}>
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
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
              className="mt-5 p-4 rounded-2xl"
              style={{
                background: 'rgba(18,24,32,0.95)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#3D5066' }}>
                Deck link
              </p>
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <Link2 size={12} style={{ color: '#3D5066' }} className="flex-shrink-0" />
                <p className="text-[11px] flex-1 truncate font-mono" style={{ color: '#5A6A7E' }}>
                  {deckUrl}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={copyUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-[13px]"
                style={{ background: color + '18', color, border: `1px solid ${color}25` }}
              >
                {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy link'}
              </motion.button>
              <p className="text-[11px] text-center mt-3 leading-relaxed" style={{ color: '#3D5066' }}>
                Pin to home screen · write to NFC tag · generate QR
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Actions ── */}
      {deck.actions.length === 0 ? (
        <EmptyState
          icon="Layers"
          title="No actions yet"
          body="Edit this deck to add timers, checklists, links and more."
          action={
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`edit/${deck.id}`)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-[13px]"
              style={{ background: color + '18', color }}
            >
              <Edit2 size={14} />
              Edit Deck
            </motion.button>
          }
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="px-5 space-y-2.5"
        >
          {deck.actions.map(action => (
            <motion.div key={action.id} variants={slideUp}>
              <ActionCard
                action={action}
                deckColor={deck.color}
                onUpdate={handleActionUpdate}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Danger zone ── */}
      <div className="px-5 mt-12">
        <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.04)' }} />

        <AnimatePresence mode="wait">
          {!showDeleteConfirm ? (
            <motion.button
              key="delete-btn"
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-[13px]"
              style={{ color: '#3D5066' }}
            >
              <Trash2 size={14} />
              Delete this deck
            </motion.button>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(18,24,32,0.95)',
                border: '1px solid rgba(251,113,133,0.15)',
              }}
            >
              <p className="text-text-primary text-[14px] font-semibold mb-1">
                Delete "{deck.name}"?
              </p>
              <p className="text-[12px] mb-4" style={{ color: '#4A5568' }}>
                This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#7A8A9E' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { deleteDeck(deck.id); navigate('home') }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ background: 'rgba(251,113,133,0.12)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.2)' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
