import React, { useState, useEffect, useCallback } from 'react'
import Layout from './components/Layout.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import DecksScreen from './screens/DecksScreen.jsx'
import DeckScreen from './screens/DeckScreen.jsx'
import CreateEditScreen from './screens/CreateEditScreen.jsx'
import ShortcutsScreen from './screens/ShortcutsScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import { useDecks } from './hooks/useDecks.js'

function parseScreen() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (!hash) return 'home'
  return hash
}

export default function App() {
  const [screen, setScreen] = useState(parseScreen)
  const {
    decks, setDecks,
    getDeck, createDeck, updateDeck, deleteDeck,
    touchDeck, toggleFavorite,
  } = useDecks()

  useEffect(() => {
    const handler = () => setScreen(parseScreen())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = useCallback((target) => {
    window.location.hash = '/' + target
    setScreen(target)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const renderScreen = () => {
    if (screen === 'home') {
      return <HomeScreen decks={decks} navigate={navigate} touchDeck={touchDeck} />
    }
    if (screen === 'decks') {
      return <DecksScreen decks={decks} navigate={navigate} touchDeck={touchDeck} />
    }
    if (screen === 'shortcuts') {
      return <ShortcutsScreen />
    }
    if (screen === 'settings') {
      return <SettingsScreen decks={decks} setDecks={setDecks} />
    }
    if (screen === 'create') {
      return (
        <CreateEditScreen
          deck={null}
          navigate={navigate}
          createDeck={createDeck}
          updateDeck={updateDeck}
        />
      )
    }
    if (screen.startsWith('edit/')) {
      const id = screen.slice(5)
      const deck = getDeck(id)
      return (
        <CreateEditScreen
          deck={deck}
          navigate={navigate}
          createDeck={createDeck}
          updateDeck={updateDeck}
        />
      )
    }
    if (screen.startsWith('deck/')) {
      const id = screen.slice(5)
      const deck = getDeck(id)
      return (
        <DeckScreen
          deck={deck}
          navigate={navigate}
          updateDeck={updateDeck}
          deleteDeck={deleteDeck}
          toggleFavorite={toggleFavorite}
        />
      )
    }
    return <HomeScreen decks={decks} navigate={navigate} touchDeck={touchDeck} />
  }

  const showNav = !screen.startsWith('deck/') && !screen.startsWith('edit/') && screen !== 'create'

  return (
    <div className="min-h-dvh bg-bg">
      {showNav ? (
        <Layout screen={screen} navigate={navigate}>
          {renderScreen()}
        </Layout>
      ) : (
        <div className="pb-8">{renderScreen()}</div>
      )}
    </div>
  )
}
