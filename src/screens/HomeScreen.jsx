import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Wifi, ChevronRight, Sparkles } from 'lucide-react'
import DeckCard from '../components/DeckCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getGreeting } from '../utils/helpers.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
}

export default function HomeScreen({ decks, navigate, touchDeck }) {
  const greeting = getGreeting()
  const favorites = decks.filter(d => d.isFavorite)
  const recent = [...decks]
    .filter(d => d.lastOpened)
    .sort((a, b) => b.lastOpened - a.lastOpened)
    .slice(0, 4)
  const suggested = decks.filter(d => !d.lastOpened).slice(0, 4)

  const openDeck = (id) => {
    touchDeck(id)
    navigate(`deck/${id}`)
  }

  return (
    <div className="px-0 pt-6 pb-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5 mb-8"
      >
        <p className="text-text-muted text-sm font-medium mb-1">{greeting}</p>
        <h1 className="text-text-primary text-3xl font-bold leading-tight tracking-tight">
          Your Decks
        </h1>
        <p className="text-text-secondary text-sm mt-2 leading-relaxed">
          Choose a deck for what you're doing now
        </p>
      </motion.div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <motion.section variants={container} initial="hidden" animate="show" className="mb-8">
          <SectionLabel>Pinned</SectionLabel>
          <div className="grid grid-cols-2 gap-3 px-5">
            {favorites.map(deck => (
              <motion.div key={deck.id} variants={item}>
                <DeckCard deck={deck} onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <motion.section variants={container} initial="hidden" animate="show" className="mb-8">
          <SectionLabel>Recent</SectionLabel>
          <div className="flex flex-col gap-2 px-5">
            {recent.map(deck => (
              <motion.div key={deck.id} variants={item}>
                <DeckCard deck={deck} compact onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Suggested */}
      {suggested.length > 0 && (
        <motion.section variants={container} initial="hidden" animate="show" className="mb-8">
          <SectionLabel>
            <span className="flex items-center gap-1.5">
              <Sparkles size={10} />
              All Decks
            </span>
          </SectionLabel>
          <div className="grid grid-cols-2 gap-3 px-5">
            {suggested.map(deck => (
              <motion.div key={deck.id} variants={item}>
                <DeckCard deck={deck} onClick={() => openDeck(deck.id)} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Empty state */}
      {decks.length === 0 && (
        <EmptyState
          icon="LayoutGrid"
          title="No decks yet"
          body="Create your first deck to bundle your routine actions in one place."
          action={
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('create')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm bg-accent-blue text-bg"
            >
              <Plus size={16} />
              Create Deck
            </motion.button>
          }
        />
      )}

      {/* Create FAB */}
      {decks.length > 0 && (
        <div className="px-5 mb-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('create')}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm"
            style={{ background: 'rgba(74,158,255,0.12)', color: '#4A9EFF', border: '1px solid rgba(74,158,255,0.2)' }}
          >
            <Plus size={16} />
            New Deck
          </motion.button>
        </div>
      )}

      {/* Shortcut hint */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('shortcuts')}
        className="mx-5 flex items-center gap-3 p-4 rounded-2xl bg-surface border border-white/5"
      >
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
          <Wifi size={16} className="text-text-muted" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-text-primary text-sm font-medium">Shortcuts & NFC</p>
          <p className="text-text-muted text-xs mt-0.5">Pin decks, use QR codes or NFC tags</p>
        </div>
        <ChevronRight size={15} className="text-text-muted" />
      </motion.button>
    </div>
  )
}
