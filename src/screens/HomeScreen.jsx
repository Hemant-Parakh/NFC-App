import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Pin, ArrowRight } from 'lucide-react'
import DeckCard from '../components/DeckCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getGreeting, accentHex } from '../utils/helpers.js'
import * as Icons from 'lucide-react'

const stagger = {
  hidden: {},
  show:  { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 34, mass: 0.7 } },
}

/* Horizontal shelf card — used for pinned */
function ShelfCard({ deck, onClick }) {
  const Icon = Icons[deck.icon] ?? Icons.Star
  const color = accentHex(deck.color)
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      onClick={onClick}
      className="flex-shrink-0 flex flex-col rounded-3xl overflow-hidden text-left"
      style={{
        width: 152,
        background: 'linear-gradient(160deg, rgba(26,34,50,0.95) 0%, rgba(14,20,30,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 0 ${color}`,
      }}
    >
      {/* Color strip */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${color}, ${color}40)` }} />

      <div className="p-4 flex flex-col gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: `radial-gradient(circle at 35% 35%, ${color}28, ${color}10)` }}
        >
          <Icon size={22} style={{ color }} strokeWidth={2} />
        </div>
        <div>
          <p className="font-bold text-[14px] leading-tight" style={{ color: '#E8EFF8', letterSpacing: '-0.01em' }}>
            {deck.name}
          </p>
          {deck.description && (
            <p className="text-[11px] mt-1 leading-snug line-clamp-2" style={{ color: '#3D5066' }}>
              {deck.description}
            </p>
          )}
        </div>
        <div
          className="text-[11px] font-medium px-2 py-0.5 rounded-full self-start"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#3D5066' }}
        >
          {deck.actions.length} actions
        </div>
      </div>
    </motion.button>
  )
}

export default function HomeScreen({ decks, navigate, touchDeck }) {
  const greeting = getGreeting()
  const favorites  = decks.filter(d => d.isFavorite)
  const recent     = [...decks].filter(d => d.lastOpened).sort((a, b) => b.lastOpened - a.lastOpened).slice(0, 5)
  const allOthers  = decks.filter(d => !d.isFavorite && !recent.find(r => r.id === d.id))
  const allDecks   = decks.filter(d => !d.isFavorite)

  const openDeck = id => { touchDeck(id); navigate(`deck/${id}`) }

  return (
    <div className="pt-7 pb-4">

      {/* ── Hero header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="px-5 mb-8"
      >
        <p className="text-[13px] font-semibold mb-1.5" style={{ color: '#3D5066' }}>
          {greeting}
        </p>
        <h1
          className="font-extrabold leading-none mb-2"
          style={{ fontSize: '30px', color: '#EEF3FF', letterSpacing: '-0.03em' }}
        >
          TapDeck
        </h1>
        <p className="text-[14px] leading-snug" style={{ color: '#5A6A7E' }}>
          Pick a mode for what you're doing right now.
        </p>
      </motion.div>

      {/* ── Pinned shelf ── */}
      {favorites.length > 0 && (
        <motion.section variants={stagger} initial="hidden" animate="show" className="mb-8">
          <SectionLabel>Pinned</SectionLabel>
          <div className="scroll-shelf px-5">
            {favorites.map(deck => (
              <motion.div key={deck.id} variants={fadeUp}>
                <ShelfCard deck={deck} onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Recent ── */}
      {recent.length > 0 && (
        <motion.section variants={stagger} initial="hidden" animate="show" className="mb-8">
          <SectionLabel>Recent</SectionLabel>
          <div className="flex flex-col gap-2 px-5">
            {recent.map(deck => (
              <motion.div key={deck.id} variants={fadeUp}>
                <DeckCard deck={deck} compact onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── All decks (when no pinned/recent to avoid empty feel) ── */}
      {favorites.length === 0 && recent.length === 0 && decks.length > 0 && (
        <motion.section variants={stagger} initial="hidden" animate="show" className="mb-8">
          <SectionLabel>All Decks</SectionLabel>
          <div className="grid grid-cols-2 gap-3 px-5">
            {decks.map(deck => (
              <motion.div key={deck.id} variants={fadeUp}>
                <DeckCard deck={deck} onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── All remaining (when there are pinned/recent) ── */}
      {(favorites.length > 0 || recent.length > 0) && allDecks.filter(d => !recent.find(r => r.id === d.id)).length > 0 && (
        <motion.section variants={stagger} initial="hidden" animate="show" className="mb-8">
          <SectionLabel
            action={
              <button
                onClick={() => navigate('decks')}
                className="text-[11px] font-semibold flex items-center gap-1"
                style={{ color: '#4A9EFF' }}
              >
                See all <ArrowRight size={11} />
              </button>
            }
          >
            More Decks
          </SectionLabel>
          <div className="grid grid-cols-2 gap-3 px-5">
            {allDecks.filter(d => !recent.find(r => r.id === d.id)).slice(0, 4).map(deck => (
              <motion.div key={deck.id} variants={fadeUp}>
                <DeckCard deck={deck} onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Empty state ── */}
      {decks.length === 0 && (
        <EmptyState
          icon="LayoutGrid"
          title="No decks yet"
          body="Create your first deck to bundle your routine actions in one place."
          action={
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('create')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm"
              style={{ background: '#4A9EFF', color: '#0A0E14' }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Deck
            </motion.button>
          }
        />
      )}

      {/* ── New deck button ── */}
      {decks.length > 0 && (
        <div className="px-5 mb-5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            onClick={() => navigate('create')}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-[14px]"
            style={{
              background: 'rgba(74,158,255,0.08)',
              color: '#4A9EFF',
              border: '1px solid rgba(74,158,255,0.16)',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            New Deck
          </motion.button>
        </div>
      )}

      {/* ── Open from anywhere hint ── */}
      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={() => navigate('shortcuts')}
        className="mx-5 flex items-center gap-3.5 px-4 py-4 rounded-2xl text-left"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <Pin size={15} style={{ color: '#4A5568' }} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold" style={{ color: '#7A8A9E' }}>
            Open from anywhere
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: '#3D5066' }}>
            Pin to home screen · QR codes · NFC tags
          </p>
        </div>
        <ArrowRight size={14} style={{ color: '#3D5066' }} />
      </motion.button>
    </div>
  )
}
