import React, { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * Renders ONE page at a time (no document scrolling).
 * Each entry: { id, label, component: <JSX/> }
 */
export default function PageDeck({ pages, page, setPage }) {
  const index = Math.max(0, pages.findIndex(p => p.id === page))

  const go = useCallback(
    (dir) => {
      const next = index + dir
      if (next >= 0 && next < pages.length) setPage(pages[next].id)
    },
    [index, pages, setPage]
  )

  // Keyboard navigation: ← → PageUp PageDown
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const active = pages[index]

  return (
    <>
      {/* Sync cross-fade: the incoming page mounts immediately instead of
          waiting on the exit animation, so page swaps never stall. */}
      <AnimatePresence initial={false}>
        <motion.main
          key={active.id}
          initial={{ opacity: 0, y: 24, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.995 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="page-deck-viewport"
        >
          {active.component}
        </motion.main>
      </AnimatePresence>

      {/* Side dot navigation */}
      <nav className="deck-dots" aria-label="Page navigation">
        {pages.map((p, i) => (
          <button
            key={p.id}
            className={i === index ? 'deck-dot active' : 'deck-dot'}
            title={p.label}
            aria-label={p.label}
            onClick={() => setPage(p.id)}
          />
        ))}
      </nav>

      {/* Prev / Next pills */}
      <div className="deck-arrows">
        <button
          className="deck-arrow"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous page"
        >
          <FiChevronLeft size={18} />
        </button>
        <span className="deck-counter">
          {String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
        </span>
        {index < pages.length - 1 && (
          <span className="deck-next-label" key={active.id}>
            Next: {pages[index + 1].label}
          </span>
        )}
        <button
          className="deck-arrow deck-arrow-next"
          onClick={() => go(1)}
          disabled={index === pages.length - 1}
          aria-label="Next page"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </>
  )
}
