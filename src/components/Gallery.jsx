import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { loadGalleryImages } from '../utils/imageLoader'
import Lightbox from './Lightbox'
import { ParallaxOrbs } from './Parallax'

const ACCENT = '#0358b9'
const ACCENT_RGBA = 'rgba(3, 88, 185'

/* ─── Single Gallery Item ────────────────────────────────────────────── */
function GalleryItem({ image, index, onClick }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1, rootMargin: '50px' }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12
    setTilt({ x, y })
  }

  const onMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className="gallery-item relative overflow-hidden cursor-none w-full aspect-[4/5]"
      style={{
        borderRadius: '4px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${index * 0.08}s, transform 0.7s ease ${index * 0.08}s`,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: hovered ? tilt.y : 0,
        rotateY: hovered ? tilt.x : 0,
        scale: hovered ? 1.02 : 1,
        zIndex: hovered ? 10 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(index)}
    >
      {failed ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-cream/5 text-cream/30 font-inter text-xs"
          aria-hidden
        >
          Unavailable
        </div>
      ) : (
        <motion.img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={() => setFailed(true)}
          style={{
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease',
            filter: hovered ? 'brightness(1.05) contrast(1.05)' : 'brightness(0.92) saturate(0.95)',
          }}
        />
      )}

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 50%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease 0.1s' }}
      >
        <div className="glass w-14 h-14 rounded-full flex items-center justify-center border border-accent/30">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" stroke={ACCENT} strokeWidth="1.2"/>
            <circle cx="10" cy="10" r="3" stroke={ACCENT} strokeWidth="1.2"/>
          </svg>
        </div>
      </motion.div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: hovered ? `inset 0 0 0 1px ${ACCENT_RGBA},0.2), 0 20px 60px ${ACCENT_RGBA},0.15)` : 'none',
          transition: 'box-shadow 0.4s ease',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />

      <div
        className="absolute top-4 right-4 font-bebas text-xs tracking-widest text-cream/20"
        style={{ opacity: hovered ? 0 : 1, transition: 'opacity 0.3s' }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.div>
  )
}

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
  const gridY = useTransform(scrollYProgress, [0, 1], [60, -30])

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
        className="text-center mb-20 relative z-10"
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
        className="gallery-grid max-w-7xl mx-auto relative z-10"
        style={{ y: gridY }}
      >
        {loading && (
          <p className="col-span-full text-center font-inter text-sm text-cream/40 py-12">
            Loading gallery…
          </p>
        )}
        {!loading && images.map((image, index) => (
          <GalleryItem
            key={image.src}
            image={image}
            index={index}
            onClick={openLightbox}
          />
        ))}
      </motion.div>


      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  )
}
