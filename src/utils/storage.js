const DECKS_KEY = 'tapdeck_decks'
const SETTINGS_KEY = 'tapdeck_settings'

export function loadDecks() {
  try {
    const raw = localStorage.getItem(DECKS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDecks(decks) {
  try {
    localStorage.setItem(DECKS_KEY, JSON.stringify(decks))
  } catch (e) {
    console.error('Failed to save decks', e)
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save settings', e)
  }
}

export function clearAll() {
  localStorage.removeItem(DECKS_KEY)
  localStorage.removeItem(SETTINGS_KEY)
}

export function exportData() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    decks: loadDecks(),
    settings: loadSettings(),
  }
}

export function importData(json) {
  if (!json.decks || !Array.isArray(json.decks)) throw new Error('Invalid data format')
  saveDecks(json.decks)
  if (json.settings) saveSettings(json.settings)
}
