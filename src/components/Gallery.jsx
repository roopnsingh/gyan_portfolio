import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { loadGalleryImages } from '../utils/imageLoader'
import Lightbox from './Lightbox'
import WatchOrbitGallery from './WatchOrbitGallery'
import { ParallaxOrbs } from './Parallax'

/* ─── Gallery Section ────────────────────────────────────────────────── */
export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const headerRef = useRef(null)
  const sectionRef = useRef(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadGalleryImages().then((loaded) => {
      if (!cancelled) setImages(loaded)
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const headerY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const orbitY = useTransform(scrollYProgress, [0, 1], [40, -20])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.2 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => setLightboxIndex(i => (i + 1) % images.length)
  const prevImage = () => setLightboxIndex(i => (i - 1 + images.length) % images.length)

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-32 px-8 md:px-16 relative overflow-hidden"
      style={{ background: '#050505' }}
    >
      <ParallaxOrbs />

      <motion.div
        ref={headerRef}
        className="text-center mb-12 md:mb-16 relative z-10"
        style={{ y: headerY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: headerVisible ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="divider" />
          <span className="font-inter text-xs tracking-widest uppercase text-accent/60">The Collection</span>
          <div className="divider" />
        </div>
        <h2 className="font-playfair text-5xl md:text-6xl text-cream mb-4">
          Visual <em>Stories</em>
        </h2>
        <p className="font-inter text-sm text-cream/40 max-w-md mx-auto">
          Each frame is a conversation between light and shadow, emotion and stillness
        </p>
      </motion.div>

      <motion.div
        className="relative z-10 flex justify-center"
        style={{ y: orbitY }}
      >
        {loading && (
          <p className="text-center font-inter text-sm text-cream/40 py-24">
            Loading gallery…
          </p>
        )}
        {!loading && (
          <WatchOrbitGallery images={images} onOpen={openLightbox} />
        )}
      </motion.div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          onGoTo={setLightboxIndex}
        />
      )}
    </section>
  )
}
