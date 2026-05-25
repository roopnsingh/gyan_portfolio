import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev, onGoTo }) {
  const image = images[currentIndex]

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') onNext()
    if (e.key === 'ArrowLeft') onPrev()
  }, [onClose, onNext, onPrev])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!image) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox"
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
      >
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(8px)' }} />

        <button
          type="button"
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center glass rounded-full cursor-none hover:border-accent/40 transition-all"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="#0358b9" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <span className="font-inter text-xs tracking-widest text-cream/40">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <motion.div
          key={currentIndex}
          className="lightbox-image-wrap relative z-10"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.srcFull || image.src}
            alt={image.alt}
            className="lightbox-image"
          />

          <div
            className="absolute bottom-0 left-0 right-0 p-6 rounded-b"
            style={{ background: 'linear-gradient(transparent, rgba(5,5,5,0.85))' }}
          >
            <p className="font-inter text-xs tracking-widest text-cream/40 uppercase">{image.alt}</p>
          </div>
        </motion.div>

        <button
          type="button"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 glass rounded-full flex items-center justify-center cursor-none hover:border-accent/40 transition-all group"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:scale-110 transition-transform">
            <path d="M12 4l-6 6 6 6" stroke="#0358b9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          type="button"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 glass rounded-full flex items-center justify-center cursor-none hover:border-accent/40 transition-all group"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:scale-110 transition-transform">
            <path d="M8 4l6 6-6 6" stroke="#0358b9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {onGoTo && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={(e) => { e.stopPropagation(); onGoTo(i) }}
                className={`h-1.5 rounded-full transition-all cursor-none ${
                  i === currentIndex ? 'bg-accent w-4' : 'bg-cream/30 w-1.5'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
