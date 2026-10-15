import { useState, useEffect, useCallback, useRef } from 'react'
import { Capacitor, registerPlugin } from '@capacitor/core'

/* global __APP_VERSION__ */
export const APP_VERSION = __APP_VERSION__

const Updater = registerPlugin('Updater')
const REPO = 'Hemant-Parakh/NFC-App'
const STORE_KEY = 'tapdeck_update'
const CHECK_EVERY_MS = 3 * 60 * 60 * 1000

const readStore = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) ?? {} } catch { return {} }
}
const writeStore = patch => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ ...readStore(), ...patch })) } catch {}
}

function cleanNotes(body = '') {
  return body
    .split('\n')
    .filter(l => !/^(Co-Authored-By|Claude-Session|Signed-off-by):/i.test(l.trim()))
    .join('\n')
    .trim()
}

async function fetchLatest() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`)
  const r = await res.json()
  const m = /^v\d+\.\d+\.(\d+)$/.exec(r.tag_name ?? '')
  const apk = r.assets?.find(a => a.name.endsWith('.apk'))
  if (!m || !apk) return null
  return {
    code: Number(m[1]),
    name: r.tag_name.slice(1),
    notes: cleanNotes(r.body),
    url: apk.browser_download_url,
    sizeMb: (apk.size / 1024 / 1024).toFixed(1),
    publishedAt: r.published_at,
  }
}

// Only the installed Android app self-updates; the browser/PWA build updates via its service worker.
export const canSelfUpdate = () => Capacitor.isNativePlatform() && APP_VERSION.code > 0

export function useUpdater() {
  const stored = readStore()
  const [latest, setLatest] = useState(stored.latest ?? null)
  const [lastChecked, setLastChecked] = useState(stored.lastChecked ?? 0)
  const [dismissedCode, setDismissedCode] = useState(stored.dismissedCode ?? 0)
  const [status, setStatus] = useState('idle') // idle | checking | error | needs-permission | downloading | installing
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const checking = useRef(false)

  const available = !!latest && latest.code > APP_VERSION.code

  const check = useCallback(async ({ force = false } = {}) => {
    if (!canSelfUpdate() || checking.current) return
    if (!force && Date.now() - (readStore().lastChecked ?? 0) < CHECK_EVERY_MS) return
    checking.current = true
    setStatus('checking')
    setError(null)
    try {
      const rel = await fetchLatest()
      const now = Date.now()
      setLatest(rel)
      setLastChecked(now)
      writeStore({ latest: rel, lastChecked: now })
      setStatus('idle')
    } catch (e) {
      setError(e.message)
      setStatus('error')
    } finally {
      checking.current = false
    }
  }, [])

  useEffect(() => {
    check()
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      // Back from the system installer or the permission screen without updating.
      setStatus(s => (s === 'installing' || s === 'needs-permission' ? 'idle' : s))
      check()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [check])

  const install = useCallback(async () => {
    if (!latest) return
    setError(null)
    try {
      const { allowed } = await Updater.canInstall()
      if (!allowed) {
        setStatus('needs-permission')
        await Updater.openInstallPermission()
        return
      }
      setProgress(0)
      setStatus('downloading')
      const sub = await Updater.addListener('progress', ({ percent }) => setProgress(percent))
      try {
        await Updater.downloadAndInstall({ url: latest.url })
        setStatus('installing')
      } finally {
        sub.remove()
      }
    } catch (e) {
      setError(e.message ?? 'Update failed')
      setStatus('error')
    }
  }, [latest])

  const dismiss = useCallback(() => {
    if (!latest) return
    setDismissedCode(latest.code)
    writeStore({ dismissedCode: latest.code })
  }, [latest])

  return {
    current: APP_VERSION,
    supported: canSelfUpdate(),
    latest,
    available,
    showBanner: available && latest.code > dismissedCode,
    status,
    progress,
    error,
    lastChecked,
    check,
    install,
    dismiss,
  }
}
