export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Still up?'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getDeckUrl(deckId) {
  const base = window.location.origin + window.location.pathname
  return `${base}#/deck/${deckId}`
}

export const ACCENT_COLORS = {
  blue:   { key: 'blue',   hex: '#4A9EFF', tw: 'accent-blue',   label: 'Blue' },
  mint:   { key: 'mint',   hex: '#34D399', tw: 'accent-mint',   label: 'Mint' },
  violet: { key: 'violet', hex: '#A78BFA', tw: 'accent-violet', label: 'Violet' },
  amber:  { key: 'amber',  hex: '#FBBF24', tw: 'accent-amber',  label: 'Amber' },
  rose:   { key: 'rose',   hex: '#FB7185', tw: 'accent-rose',   label: 'Rose' },
  coral:  { key: 'coral',  hex: '#F97316', tw: 'accent-coral',  label: 'Coral' },
  sky:    { key: 'sky',    hex: '#38BDF8', tw: 'accent-sky',    label: 'Sky' },
}

export function accentHex(colorKey) {
  return ACCENT_COLORS[colorKey]?.hex ?? '#4A9EFF'
}

export const ICON_OPTIONS = [
  'Monitor', 'Moon', 'UtensilsCrossed', 'DoorOpen', 'WashingMachine',
  'Plane', 'ShoppingCart', 'Dumbbell', 'Car', 'Book', 'Music',
  'Coffee', 'Briefcase', 'Home', 'MapPin', 'Star', 'Zap',
  'Heart', 'Camera', 'Gamepad2', 'Bike', 'Sunset', 'Baby',
  'Leaf', 'Dog', 'Stethoscope', 'PenLine', 'Palette', 'Code2',
]
