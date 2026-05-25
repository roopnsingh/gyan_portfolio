import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const roles = ['Photographer', 'AI Trainer', 'Editor', 'Reels']

export default function About() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgTextY = useTransform(scrollYProgress, [0, 1], [-80, 120])
  const contentY = useTransform(scrollYProgress, [0, 1], [50, -40])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-32 px-8 md:px-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #050810 50%, #050505 100%)' }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(3,88,185,0.05) 0%, transparent 50%),
                            radial-gradient(circle at 80% 50%, rgba(3,88,185,0.03) 0%, transparent 50%)`,
        }}
      />

      <motion.div
        className="font-bebas text-[120px] md:text-[180px] leading-none select-none pointer-events-none absolute left-8 md:left-16 top-1/2 z-0"
        style={{
          y: bgTextY,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(3,88,185,0.06)',
        }}
      >
        ABOUT
      </motion.div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        style={{ y: contentY }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center">

          <div>
            <div
              className="flex items-center gap-4 mb-8"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s ease 0.1s',
              }}
            >
              <div className="divider" />
              <span className="font-inter text-xs tracking-widest uppercase text-accent/60">About</span>
            </div>

            <h2
              className="font-playfair text-4xl md:text-5xl text-cream mb-6 leading-tight"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease 0.2s',
              }}
            >
              {roles.map((role, i) => (
                <span key={role}>
                  {i > 0 && <span className="text-cream/30"> · </span>}
                  <em className={i === 0 ? 'text-accent not-italic' : 'text-cream/80 not-italic font-normal'}>
                    {role}
                  </em>
                </span>
              ))}
            </h2>

            <p
              className="font-inter text-sm leading-loose text-cream/50 mb-10"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s ease 0.3s',
              }}
            >
              Visual work across AI training, photography, editing, and short-form video —
              always chasing the frame that feels honest.
            </p>

          </div>

          <div
            className="glass-strong p-8 md:p-10"
            style={{
              borderRadius: '4px',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.7s ease 0.4s',
            }}
          >
            <p className="font-playfair text-lg md:text-xl italic text-cream/70 leading-relaxed">
              "A photograph is a secret about a secret. The more it tells you,
              the less you know."
            </p>
            <p className="font-inter text-xs tracking-widest text-accent/50 mt-4 uppercase">
              — Diane Arbus
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
