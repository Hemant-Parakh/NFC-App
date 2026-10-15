import { useState } from 'react'
import {
  loadProfiles, saveProfiles, loadActiveProfileId, saveActiveProfileId,
  migrateIfNeeded, loadDecks, saveDecks, clearProfileData,
} from '../utils/storage.js'
import { createSampleDecks } from '../data/sampleDecks.js'
import { generateId } from '../utils/helpers.js'

function bootstrap() {
  migrateIfNeeded(() => ({ id: generateId(), name: 'You', color: 'blue', createdAt: Date.now() }))
  const profiles = loadProfiles() ?? []
  let activeId = loadActiveProfileId()
  if (!profiles.some(p => p.id === activeId)) {
    activeId = profiles[0].id
    saveActiveProfileId(activeId)
  }
  if (loadDecks(activeId) === null) saveDecks(activeId, createSampleDecks())
  return { profiles, activeId }
}

export function useProfiles() {
  const [{ profiles, activeId }, setState] = useState(bootstrap)
  const activeProfile = profiles.find(p => p.id === activeId) ?? profiles[0]

  const commit = (nextProfiles, nextActiveId) => {
    saveProfiles(nextProfiles)
    saveActiveProfileId(nextActiveId)
    setState({ profiles: nextProfiles, activeId: nextActiveId })
  }

  const createProfile = ({ name, color, withStarters }) => {
    const profile = { id: generateId(), name: name.trim(), color, createdAt: Date.now() }
    saveDecks(profile.id, withStarters ? createSampleDecks() : [])
    commit([...profiles, profile], profile.id)
    return profile
  }

  const updateProfile = (id, updates) => {
    commit(profiles.map(p => (p.id === id ? { ...p, ...updates } : p)), activeId)
  }

  const deleteProfile = (id) => {
    if (profiles.length <= 1) return
    const next = profiles.filter(p => p.id !== id)
    clearProfileData(id)
    commit(next, id === activeId ? next[0].id : activeId)
  }

  const switchProfile = (id) => {
    if (profiles.some(p => p.id === id)) commit(profiles, id)
  }

  const reload = () => setState(bootstrap())

  return { profiles, activeProfile, createProfile, updateProfile, deleteProfile, switchProfile, reload }
}
