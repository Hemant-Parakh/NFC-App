import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import DeckCard from '../components/DeckCard.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function DecksScreen({ decks, navigate, touchDeck }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? decks.filter(d =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.description?.toLowerCase().includes(query.toLowerCase())
      )
    : decks

  const openDeck = (id) => {
    touchDeck(id)
    navigate(`deck/${id}`)
  }

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-text-primary text-2xl font-bold tracking-tight">All Decks</h1>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate('create')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-sm bg-accent-blue text-bg"
        >
          <Plus size={15} />
          New
        </motion.button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-white/5 mb-6">
        <Search size={16} className="text-text-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search decks…"
          className="flex-1 text-sm bg-transparent"
        />
        {query && (
          <button onClick={() => setQuery('')}>
            <X size={14} className="text-text-muted" />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="Search"
          title={query ? 'No results' : 'No decks yet'}
          body={query ? `No decks match "${query}"` : 'Tap New to create your first deck.'}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((deck, i) => (
            <motion.div
              key={deck.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.22 }}
            >
              <DeckCard deck={deck} onClick={() => openDeck(deck.id)} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
