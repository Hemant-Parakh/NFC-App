import { useState, useCallback, useEffect } from 'react'
import { loadDecks, saveDecks } from '../utils/storage.js'
import { generateId } from '../utils/helpers.js'

// `version` lets callers force a reload from storage (after import / clear).
export function useDecks(profileId, version = 0) {
  const key = `${profileId}:${version}`
  const [state, setState] = useState(() => ({ key, pid: profileId, decks: loadDecks(profileId) ?? [] }))

  // Switching profile swaps the whole deck list during render, so the previous
  // profile's decks are never written into the new profile's storage.
  let current = state
  if (state.key !== key) {
    current = { key, pid: profileId, decks: loadDecks(profileId) ?? [] }
    setState(current)
  }
  const { decks } = current

  useEffect(() => {
    saveDecks(state.pid, state.decks)
  }, [state])

  const mutate = useCallback(fn => setState(s => ({ ...s, decks: fn(s.decks) })), [])

  const getDeck = useCallback(id => decks.find(d => d.id === id), [decks])

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
    mutate(prev => [deck, ...prev])
    return deck.id
  }, [mutate])

  const updateDeck = useCallback((id, updates) => {
    mutate(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)))
  }, [mutate])

  const deleteDeck = useCallback((id) => {
    mutate(prev => prev.filter(d => d.id !== id))
  }, [mutate])

  const touchDeck = useCallback((id) => {
    mutate(prev => prev.map(d => (d.id === id ? { ...d, lastOpened: Date.now() } : d)))
  }, [mutate])

  const toggleFavorite = useCallback((id) => {
    mutate(prev => prev.map(d => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)))
  }, [mutate])

  return { decks, getDeck, createDeck, updateDeck, deleteDeck, touchDeck, toggleFavorite }
}

export function copyDeckToProfile(deck, targetProfileId) {
  const clone = {
    ...deck,
    id: generateId(),
    isFavorite: false,
    lastOpened: null,
    createdAt: Date.now(),
    actions: deck.actions.map(a => ({
      ...a,
      id: generateId(),
      ...(a.items ? { items: a.items.map(i => ({ ...i, id: generateId(), checked: false })) } : {}),
    })),
  }
  saveDecks(targetProfileId, [clone, ...(loadDecks(targetProfileId) ?? [])])
}
