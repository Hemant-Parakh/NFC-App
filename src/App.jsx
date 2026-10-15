import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout.jsx'
import ProfileSheet from './components/ProfileSheet.jsx'
import ProfileAvatar from './components/ProfileAvatar.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import DecksScreen from './screens/DecksScreen.jsx'
import DeckScreen from './screens/DeckScreen.jsx'
import CreateEditScreen from './screens/CreateEditScreen.jsx'
import ShortcutsScreen from './screens/ShortcutsScreen.jsx'
import SettingsScreen from './screens/SettingsScreen.jsx'
import { useProfiles } from './hooks/useProfiles.js'
import { useDecks, copyDeckToProfile } from './hooks/useDecks.js'
import { loadDecks } from './utils/storage.js'
import { accentHex } from './utils/helpers.js'

function parseScreen() {
  return window.location.hash.replace(/^#\/?/, '') || 'home'
}

export default function App() {
  const [screen, setScreen] = useState(parseScreen)
  const [dataVersion, setDataVersion] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const profilesApi = useProfiles()
  const { profiles, activeProfile } = profilesApi
  const { decks, getDeck, createDeck, updateDeck, deleteDeck, touchDeck, toggleFavorite } =
    useDecks(activeProfile.id, dataVersion)

  useEffect(() => {
    const handler = () => { setScreen(parseScreen()); setSheetOpen(false) }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  const navigate = useCallback((target) => {
    window.location.hash = '/' + target
    setScreen(target)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const showToast = (msg, profile = null) => setToast({ id: Date.now(), msg, profile })

  // A deck link (QR / NFC / home-screen pin) may belong to another profile.
  useEffect(() => {
    if (!screen.startsWith('deck/')) return
    const id = screen.slice(5)
    if (getDeck(id)) return
    const owner = profiles.find(p => p.id !== activeProfile.id && loadDecks(p.id)?.some(d => d.id === id))
    if (owner) {
      profilesApi.switchProfile(owner.id)
      showToast(`Switched to ${owner.name}`, owner)
    }
  }, [screen, activeProfile.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const deckCounts = useMemo(() => Object.fromEntries(
    profiles.map(p => [p.id, p.id === activeProfile.id ? decks.length : (loadDecks(p.id)?.length ?? 0)])
  ), [profiles, activeProfile.id, decks.length, sheetOpen])

  const handleSwitch = (id) => {
    setSheetOpen(false)
    if (id === activeProfile.id) return
    const p = profiles.find(x => x.id === id)
    profilesApi.switchProfile(id)
    navigate('home')
    showToast(`Switched to ${p.name}`, p)
  }

  const handleCreate = (data) => {
    const p = profilesApi.createProfile(data)
    setSheetOpen(false)
    navigate('home')
    showToast(`Welcome, ${p.name}`, p)
  }

  const handleDelete = (id) => {
    const p = profiles.find(x => x.id === id)
    profilesApi.deleteProfile(id)
    if (id === activeProfile.id) navigate('home')
    showToast(`Deleted ${p.name}`)
  }

  const handleCopyToProfile = (deck, target) => {
    copyDeckToProfile(deck, target.id)
    showToast(`Copied to ${target.name}`, target)
  }

  const handleDataChanged = () => {
    profilesApi.reload()
    setDataVersion(v => v + 1)
    navigate('settings')
  }

  const openProfiles = () => setSheetOpen(true)
  const accent = accentHex(activeProfile.color)

  const renderScreen = () => {
    if (screen === 'home') {
      return (
        <HomeScreen
          decks={decks}
          navigate={navigate}
          touchDeck={touchDeck}
          profile={activeProfile}
          profileCount={profiles.length}
          onOpenProfiles={openProfiles}
        />
      )
    }
    if (screen === 'decks') return <DecksScreen decks={decks} navigate={navigate} touchDeck={touchDeck} />
    if (screen === 'shortcuts') return <ShortcutsScreen />
    if (screen === 'settings') {
      return (
        <SettingsScreen
          decks={decks}
          profile={activeProfile}
          profiles={profiles}
          onOpenProfiles={openProfiles}
          onDataChanged={handleDataChanged}
        />
      )
    }
    if (screen === 'create') {
      return <CreateEditScreen deck={null} navigate={navigate} createDeck={createDeck} updateDeck={updateDeck} />
    }
    if (screen.startsWith('edit/')) {
      return <CreateEditScreen deck={getDeck(screen.slice(5))} navigate={navigate} createDeck={createDeck} updateDeck={updateDeck} />
    }
    if (screen.startsWith('deck/')) {
      return (
        <DeckScreen
          key={`${activeProfile.id}:${screen}`}
          deck={getDeck(screen.slice(5))}
          navigate={navigate}
          updateDeck={updateDeck}
          deleteDeck={deleteDeck}
          toggleFavorite={toggleFavorite}
          otherProfiles={profiles.filter(p => p.id !== activeProfile.id)}
          onCopyToProfile={handleCopyToProfile}
        />
      )
    }
    return <HomeScreen decks={decks} navigate={navigate} touchDeck={touchDeck} profile={activeProfile} profileCount={profiles.length} onOpenProfiles={openProfiles} />
  }

  const showNav = !screen.startsWith('deck/') && !screen.startsWith('edit/') && screen !== 'create'

  return (
    <div className="min-h-dvh bg-bg">
      {showNav ? (
        <Layout screen={screen} pageKey={`${activeProfile.id}:${screen}`} navigate={navigate} accent={accent}>
          {renderScreen()}
        </Layout>
      ) : (
        <div className="pb-8">{renderScreen()}</div>
      )}

      <ProfileSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        profiles={profiles}
        activeId={activeProfile.id}
        deckCounts={deckCounts}
        onSwitch={handleSwitch}
        onCreate={handleCreate}
        onUpdate={profilesApi.updateProfile}
        onDelete={handleDelete}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 460, damping: 32 }}
            className="fixed bottom-24 left-1/2 z-[80] flex items-center gap-2.5 py-2 pr-4 rounded-full"
            style={{
              x: '-50%',
              paddingLeft: toast.profile ? 8 : 16,
              background: 'rgba(22,30,42,0.94)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 10px 32px rgba(0,0,0,0.5)',
            }}
          >
            {toast.profile && <ProfileAvatar profile={toast.profile} size={26} />}
            <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: '#EEF3FF' }}>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
