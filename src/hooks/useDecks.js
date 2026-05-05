import { useState, useCallback, useEffect } from 'react'
import { loadDecks, saveDecks } from '../utils/storage.js'
import { createSampleDecks } from '../data/sampleDecks.js'
import { generateId } from '../utils/helpers.js'

export function useDecks() {
  const [decks, setDecks] = useState(() => {
    const stored = loadDecks()
    return stored ?? createSampleDecks()
  })

  useEffect(() => {
    saveDecks(decks)
  }, [decks])

  const getDeck = useCallback((id) => decks.find(d => d.id === id), [decks])

  const createDeck = useCallback((data) => {
    const deck = {
      id: generateId(),
      name: data.name || 'New Deck',
      icon: data.icon || 'Star',
      color: data.color || 'blue',
      description: data.description || '',
      isFavorite: data.isFavorite ?? false,
      lastOpened: null,
      createdAt: Date.now(),
      actions: data.actions || [],
    }
    setDecks(prev => [deck, ...prev])
    return deck.id
  }, [])

  const updateDeck = useCallback((id, updates) => {
    setDecks(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
  }, [])

  const deleteDeck = useCallback((id) => {
    setDecks(prev => prev.filter(d => d.id !== id))
  }, [])

  const touchDeck = useCallback((id) => {
    setDecks(prev => prev.map(d => d.id === id ? { ...d, lastOpened: Date.now() } : d))
  }, [])

  const toggleFavorite = useCallback((id) => {
    setDecks(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d))
  }, [])

  const reorderActions = useCallback((deckId, actions) => {
    setDecks(prev => prev.map(d => d.id === deckId ? { ...d, actions } : d))
  }, [])

  const recent = [...decks]
    .filter(d => d.lastOpened)
    .sort((a, b) => b.lastOpened - a.lastOpened)
    .slice(0, 4)

  const favorites = decks.filter(d => d.isFavorite)

  return {
    decks,
    setDecks,
    getDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    touchDeck,
    toggleFavorite,
    reorderActions,
    recent,
    favorites,
  }
}
