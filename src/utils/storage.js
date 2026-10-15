/* ──────────────────────────────────────────────────────────────────────
 * TapDeck local storage.
 * Profile-scoped: each profile has its own decks and settings.
 * Also handles one-time migration from v1 (no profiles) to v2.
 * ────────────────────────────────────────────────────────────────────── */

const PROFILES_KEY        = 'tapdeck_profiles'
const ACTIVE_PROFILE_KEY  = 'tapdeck_active_profile'
const LEGACY_DECKS_KEY    = 'tapdeck_decks'
const LEGACY_SETTINGS_KEY = 'tapdeck_settings'

const DECKS_KEY    = pid => `tapdeck_decks_${pid}`
const SETTINGS_KEY = pid => `tapdeck_settings_${pid}`

/* ── Profiles ─────────────────────────────────────────────────────────── */

export function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveProfiles(profiles) {
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)) }
  catch (e) { console.error('Failed to save profiles', e) }
}

export function loadActiveProfileId() {
  try { return localStorage.getItem(ACTIVE_PROFILE_KEY) }
  catch { return null }
}

export function saveActiveProfileId(id) {
  try { localStorage.setItem(ACTIVE_PROFILE_KEY, id) }
  catch (e) { console.error('Failed to save active profile', e) }
}

/* ── Decks (per profile) ─────────────────────────────────────────────── */

export function loadDecks(profileId) {
  if (!profileId) return null
  try {
    const raw = localStorage.getItem(DECKS_KEY(profileId))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveDecks(profileId, decks) {
  if (!profileId) return
  try { localStorage.setItem(DECKS_KEY(profileId), JSON.stringify(decks)) }
  catch (e) { console.error('Failed to save decks', e) }
}

export function removeDecks(profileId) {
  try { localStorage.removeItem(DECKS_KEY(profileId)) } catch {}
}

/* ── Settings (per profile) ─────────────────────────────────────────── */

export function loadSettings(profileId) {
  if (!profileId) return {}
  try {
    const raw = localStorage.getItem(SETTINGS_KEY(profileId))
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function saveSettings(profileId, settings) {
  if (!profileId) return
  try { localStorage.setItem(SETTINGS_KEY(profileId), JSON.stringify(settings)) }
  catch (e) { console.error('Failed to save settings', e) }
}

export function removeSettings(profileId) {
  try { localStorage.removeItem(SETTINGS_KEY(profileId)) } catch {}
}

/* ── Danger ───────────────────────────────────────────────────────────── */

export function clearAll() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i)
    if (k?.startsWith('tapdeck_')) localStorage.removeItem(k)
  }
}

export function clearProfileData(profileId) {
  removeDecks(profileId)
  removeSettings(profileId)
}

/* ── Export / import ─────────────────────────────────────────────────── */

export function exportData() {
  const profiles = loadProfiles() ?? []
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    profiles,
    activeProfileId: loadActiveProfileId(),
    data: Object.fromEntries(
      profiles.map(p => [p.id, { decks: loadDecks(p.id) ?? [], settings: loadSettings(p.id) }])
    ),
  }
}

export function importData(json) {
  if (!json) throw new Error('Invalid data')

  // v2 — full multi-profile export
  if (json.version === 2 && Array.isArray(json.profiles)) {
    saveProfiles(json.profiles)
    if (json.activeProfileId) saveActiveProfileId(json.activeProfileId)
    for (const [pid, bucket] of Object.entries(json.data || {})) {
      if (bucket.decks)    saveDecks(pid, bucket.decks)
      if (bucket.settings) saveSettings(pid, bucket.settings)
    }
    return
  }

  // v1 — single list of decks, import into the active profile
  if (Array.isArray(json.decks)) {
    const profiles = loadProfiles() ?? []
    const activeId = loadActiveProfileId() ?? profiles[0]?.id
    if (!activeId) throw new Error('No profile to import into')
    saveDecks(activeId, json.decks)
    if (json.settings) saveSettings(activeId, json.settings)
    return
  }

  throw new Error('Invalid data format')
}

/* ── Migration v1 → v2 (called once on first mount) ──────────────────── */

export function migrateIfNeeded(defaultProfileFactory) {
  // Already migrated
  if (loadProfiles()?.length) return

  const legacyDecksRaw    = localStorage.getItem(LEGACY_DECKS_KEY)
  const legacySettingsRaw = localStorage.getItem(LEGACY_SETTINGS_KEY)
  const defaultProfile    = defaultProfileFactory()

  saveProfiles([defaultProfile])
  saveActiveProfileId(defaultProfile.id)

  if (legacyDecksRaw) {
    try { saveDecks(defaultProfile.id, JSON.parse(legacyDecksRaw)) } catch {}
    localStorage.removeItem(LEGACY_DECKS_KEY)
  }
  if (legacySettingsRaw) {
    try { saveSettings(defaultProfile.id, JSON.parse(legacySettingsRaw)) } catch {}
    localStorage.removeItem(LEGACY_SETTINGS_KEY)
  }
}
