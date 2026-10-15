import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import DeckCard from '../components/DeckCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 34 } },
}

export default function DecksScreen({ decks, navigate, touchDeck }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? decks.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.description?.toLowerCase().includes(query.toLowerCase())
      )
    : decks

  const openDeck = id => { touchDeck(id); navigate(`deck/${id}`) }

  return (
    <div className="px-5 pt-7 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="font-extrabold leading-none"
          style={{ fontSize: '26px', color: '#EEF3FF', letterSpacing: '-0.025em' }}
        >
          All Decks
        </h1>
        <motion.button
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 600, damping: 28 }}
          onClick={() => navigate('create')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-[13px]"
          style={{ background: '#4A9EFF', color: '#0A0E14' }}
        >
          <Plus size={14} strokeWidth={2.8} />
          New
        </motion.button>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6"
        style={{ background: 'rgba(18,24,32,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Search size={15} style={{ color: '#3D5066' }} className="flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search decks…"
          className="flex-1 text-[14px] bg-transparent"
          style={{ color: '#D0DCF0' }}
        />
        {query && (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQuery('')}
          >
            <X size={14} style={{ color: '#3D5066' }} />
          </motion.button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={query ? 'Search' : 'LayoutGrid'}
          title={query ? 'No results' : 'No decks yet'}
          body={query ? `Nothing matches "${query}"` : 'Tap New to create your first deck.'}
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {filtered.map(deck => (
            <motion.div key={deck.id} variants={fadeUp}>
              <DeckCard deck={deck} onClick={() => openDeck(deck.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
