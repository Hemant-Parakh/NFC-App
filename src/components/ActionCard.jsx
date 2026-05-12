import React from 'react'
import { accentHex } from '../utils/helpers.js'
import LinkCard from './cards/LinkCard.jsx'
import ChecklistCard from './cards/ChecklistCard.jsx'
import TimerCard from './cards/TimerCard.jsx'
import NoteCard from './cards/NoteCard.jsx'
import MessageCard from './cards/MessageCard.jsx'
import AppShortcutCard from './cards/AppShortcutCard.jsx'

export default function ActionCard({ action, deckColor, onUpdate }) {
  const color = accentHex(deckColor)
  const props = { action, accentColor: color, onUpdate }

  switch (action.type) {
    case 'link':       return <LinkCard {...props} />
    case 'checklist':  return <ChecklistCard {...props} />
    case 'timer':      return <TimerCard {...props} />
    case 'note':       return <NoteCard {...props} />
    case 'message':    return <MessageCard {...props} />
    case 'appshortcut':return <AppShortcutCard {...props} />
    default:           return null
  }
}
