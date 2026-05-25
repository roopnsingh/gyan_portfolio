import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }) {
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

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      >
        {/* Backdrop blur */}
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(4px)' }} />

        {/* Close button */}
        <button
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center glass rounded-full cursor-none hover:border-accent/40 transition-all"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="#0358b9" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Counter */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <span className="font-inter text-xs tracking-widest text-cream/40">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Image */}
        <motion.div
          key={currentIndex}
          className="relative z-10 max-w-5xl max-h-[85vh] mx-8"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.srcFull || image.src}
            alt={image.alt}
            style={{
              maxWidth: '100%',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '4px',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(3,88,185,0.1)',
            }}
          />

          {/* Bottom gradient + info */}
          <div
            className="absolute bottom-0 left-0 right-0 p-6 rounded-b"
            style={{ background: 'linear-gradient(transparent, rgba(5,5,5,0.8))' }}
          >
            <p className="font-inter text-xs tracking-widest text-cream/40 uppercase">{image.alt}</p>
          </div>
        </motion.div>

        {/* Navigation arrows */}
        <button
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 glass rounded-full flex items-center justify-center cursor-none hover:border-accent/40 transition-all group"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:scale-110 transition-transform">
            <path d="M12 4l-6 6 6 6" stroke="#0358b9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-14 h-14 glass rounded-full flex items-center justify-center cursor-none hover:border-accent/40 transition-all group"
          onClick={(e) => { e.stopPropagation(); onNext() }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:scale-110 transition-transform">
            <path d="M8 4l6 6-6 6" stroke="#0358b9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Thumbnail strip */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={(e) => { e.stopPropagation(); /* jump to index handled by parent */ }}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-none ${
                i === currentIndex ? 'bg-accent w-4' : 'bg-cream/30'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
