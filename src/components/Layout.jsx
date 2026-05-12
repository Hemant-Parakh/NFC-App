import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from './BottomNav.jsx'

const pageVariants = {
  initial: { opacity: 0, y: 10, filter: 'blur(2px)' },
  in:      { opacity: 1, y: 0,  filter: 'blur(0px)' },
  out:     { opacity: 0, y: -6, filter: 'blur(2px)' },
}

const pageTransition = {
  type: 'spring',
  stiffness: 380,
  damping: 36,
  mass: 0.8,
}

export default function Layout({ children, screen, navigate }) {
  return (
    <div className="flex flex-col min-h-dvh bg-bg">
      <div className="safe-top" />

      <main className="flex-1 scrollable pb-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav screen={screen} navigate={navigate} />
    </div>
  )
}
