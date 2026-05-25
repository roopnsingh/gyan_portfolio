import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import { PROFILE_IMAGE, PROFILE_FALLBACK } from '../utils/imageLoader'
import { SOCIAL_LINKS } from '../constants/social'

/* ─── Floating Particles ─────────────────────────────────────────────── */
function Particles({ count = 40 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 3 === 0
              ? `rgba(3, 88, 185, ${p.opacity})`
              : `rgba(255, 255, 255, ${p.opacity * 0.5})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Light Leaks ────────────────────────────────────────────────────── */
function LightLeaks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-left accent glow */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(3,88,185,0.12) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom-right cool leak */}
      <motion.div
        className="absolute -bottom-40 -right-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(100,120,180,0.08) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {/* Center ambient */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(3,88,185,0.04) 0%, transparent 60%)' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  )
}

/* ─── Profile Image ──────────────────────────────────────────────────── */
function ProfileImage({ mouseX, mouseY }) {
  const [imgSrc, setImgSrc] = useState(PROFILE_IMAGE)

  const rotateX = useTransform(mouseY, [-300, 300], [8, -8])
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8])
  const springX = useSpring(rotateX, { stiffness: 100, damping: 30 })
  const springY = useSpring(rotateY, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #0358b9, #4a8fd4, #0358b9, #024a94, #0358b9)',
          padding: '2px',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full bg-obsidian" style={{ background: '#050505' }} />
      </motion.div>

      {/* Floating animation wrapper */}
      <motion.div
        style={{ rotateX: springX, rotateY: springY, transformPerspective: 800 }}
        className="relative z-10"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          {/* Glassmorphism frame */}
          <div
            className="relative overflow-hidden"
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(3, 88, 185, 0.4)',
              boxShadow: '0 0 60px rgba(3,88,185,0.15), 0 0 120px rgba(3,88,185,0.05), inset 0 0 40px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src={imgSrc}
              alt="Photographer portrait"
              onError={() => setImgSrc(PROFILE_FALLBACK)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                filter: 'contrast(1.05) saturate(0.95)',
              }}
            />
            {/* Inner glass overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                borderRadius: '50%',
              }}
            />
          </div>

          {/* Outer glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 0 0 rgba(3,88,185,0.3)' }}
            animate={{ boxShadow: ['0 0 0 0 rgba(3,88,185,0.3)', '0 0 0 20px rgba(3,88,185,0)', '0 0 0 0 rgba(3,88,185,0)'] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Scroll Indicator ───────────────────────────────────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <span className="font-inter text-xs tracking-widest uppercase text-cream/40">Scroll</span>
      <div className="w-px h-12 bg-gradient-to-b from-accent/40 to-transparent relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 h-1/2 bg-accent"
          animate={{ y: ['0%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

/* ─── Hero ───────────────────────────────────────────────────────────── */
export default function Hero() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const scrollBgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const scrollContentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const scrollContentOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.4, 0])
  const scrollProfileY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const scrollProfileScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const bgX = useTransform(mouseX, [-400, 400], [-20, 20])
  const bgY = useTransform(mouseY, [-400, 400], [-20, 20])
  const springBgX = useSpring(bgX, { stiffness: 30, damping: 30 })
  const springBgY = useSpring(bgY, { stiffness: 30, damping: 30 })

  useEffect(() => {
    const onMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [mouseX, mouseY])

  const textVariants = {
    hidden: { opacity: 0, y: 60, skewY: 3 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      skewY: 0,
      transition: { delay: 0.6 + i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const headingVariants = {
    hidden: { opacity: 0, y: 48 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.6 + i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#050505' }}
    >
      {/* Mouse + scroll parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{ x: springBgX, y: springBgY, scale: 1.15 }}
      >
        <motion.div className="absolute inset-0" style={{ y: scrollBgY }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 60% 50% at 30% 40%, rgba(3,88,185,0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 70% 60%, rgba(20,184,166,0.08) 0%, transparent 70%),
              linear-gradient(135deg, #050505 0%, #0d0d0d 50%, #050505 100%)
            `,
          }} />
        </motion.div>
      </motion.div>

      <LightLeaks />
      <Particles />

      {/* Vignette */}
      <div className="vignette" />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-16"
        style={{ y: scrollContentY, opacity: scrollContentOpacity }}
      >

        {/* Left: Text */}
        <div className="flex-1 max-w-xl lg:max-w-2xl overflow-visible">
          {/* Eyebrow */}
          <motion.div
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-accent" />
            <span className="font-inter text-xs tracking-widest uppercase text-accent/70">
              Visual Storyteller / AI Trainer
            </span>
          </motion.div>

          {/* Main heading — no overflow clip (was cutting off "Behind") */}
          <motion.h1
            custom={1}
            variants={headingVariants}
            initial="hidden"
            animate="visible"
            className="font-bebas text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[1.05] text-cream whitespace-nowrap mb-2 block"
          >
            Heart&nbsp;Behind
          </motion.h1>
          <motion.h1
            custom={2}
            variants={headingVariants}
            initial="hidden"
            animate="visible"
            className="font-bebas text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[1.05] whitespace-nowrap mb-6 block"
            style={{
              background: 'linear-gradient(135deg, #0358b9 0%, #4a8fd4 50%, #0358b9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Lens
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="font-playfair text-lg md:text-xl text-cream/60 italic leading-relaxed mb-10"
          >
            Capturing emotion, light,<br />and timeless moments
          </motion.p>

          {/* CTA + contact */}
          <motion.div
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <a
              href="#gallery"
              onClick={(e) => { e.preventDefault(); document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="magnetic-btn w-fit"
            >
              <span>View Work</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="glass flex items-center gap-3 px-5 py-3 cursor-none group"
                  style={{ borderRadius: '4px', transition: 'border-color 0.3s ease' }}
                >
                  <span className="text-accent/60 group-hover:text-accent transition-colors">
                    {link.icon}
                  </span>
                  <span>
                    <span className="font-inter text-[10px] tracking-widest uppercase text-cream/40 block">
                      {link.label}
                    </span>
                    <span className="font-inter text-sm text-cream/70 group-hover:text-cream transition-colors">
                      {link.handle}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Profile Image */}
        <motion.div
          className="flex-shrink-0 md:mr-8 lg:mr-16"
          style={{ y: scrollProfileY, scale: scrollProfileScale }}
        >
          <ProfileImage mouseX={mouseX} mouseY={mouseY} />
        </motion.div>
      </motion.div>

      <ScrollIndicator />
    </section>
  )
}
