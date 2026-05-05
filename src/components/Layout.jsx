import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from './BottomNav.jsx'

export default function Layout({ children, screen, navigate }) {
  return (
    <div className="flex flex-col min-h-dvh bg-bg">
      {/* Safe area top */}
      <div className="safe-top" />

      {/* Main scrollable content */}
      <main className="flex-1 scrollable pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <BottomNav screen={screen} navigate={navigate} />
    </div>
  )
}
