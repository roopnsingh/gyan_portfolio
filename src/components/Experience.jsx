import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { useGsapReveal } from '../hooks/useGsapReveal'
import { ParallaxOrbs } from './Parallax'

const experiences = [
  {
    id: 'xai',
    company: 'xAI',
    role: 'Image and Video Tutor',
    duration: 'Jan 2025 – Present',
    theme: 'ai',
    bullets: [
      'Provided accurately labeled image and video datasets using proprietary annotation tools, supporting the training and optimization of computer vision AI models.',
      'Reviewed and verified the quality of labeled data submitted by peers, maintaining high annotation standards and contributing to overall data integrity.',
      'Collaborated with cross-functional teams to resolve annotation discrepancies and improve labeling workflows.',
    ],
  },
  {
    id: 'invisible',
    company: 'Invisible Technologies',
    role: 'Advanced AI Trainer',
    duration: 'Nov 2023 – Dec 2024',
    theme: 'software',
    bullets: [
      'Excelled in coding and refining advanced AI models across diverse subject areas to deliver tailored solutions.',
      'Collaborated with cross-functional teams on a Hindi AI training project, improving language model accuracy, localization, and response quality.',
      'Worked on AI projects involving JSON-based data structuring, annotation, validation, and formatting for model training pipelines.',
      'Provided hands-on support in quality testing, ensuring optimal performance and user satisfaction.',
      'Contributed to quality testing across multiple domains by developing and refining code-based solutions.',
    ],
  },
]

function FloatingParticles({ count = 12 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/40"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function ExperienceCard({ exp, index }) {
  const cardRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 20 })
  const [hovered, setHovered] = useState(false)

  const isAi = exp.theme === 'ai'

  const onMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.article
      ref={cardRef}
      data-reveal
      className="relative group cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      onMouseMove={onMouseMove}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      {/* Animated gradient border */}
      <div
        className={`absolute -inset-[1px] rounded-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${hovered ? 'gradient-border-active' : ''}`}
        style={{
          background: isAi
            ? 'linear-gradient(135deg, #0358b9, #4a8fd4, #0358b9, #024a94)'
            : 'linear-gradient(135deg, #0358b9, #1a1a2e, #4a8fd4, #0358b9)',
        }}
      />

      <div className="relative premium-card rounded-lg p-8 md:p-10 overflow-hidden">
        {isAi && <FloatingParticles />}
        {isAi && (
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(3,88,185,0.25) 0%, transparent 50%)',
            }}
          />
        )}

        {/* Mouse-follow glow */}
        <motion.div
          className="absolute w-48 h-48 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            x: glowX,
            y: glowY,
            translateX: '-50%',
            translateY: '-50%',
            background: 'radial-gradient(circle, rgba(3,88,185,0.2) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="font-bebas text-3xl md:text-4xl tracking-wide text-cream">
                {exp.company}
              </span>
              <p className="font-playfair text-lg md:text-xl text-accent/90 mt-1">{exp.role}</p>
            </div>
            <span className="font-inter text-xs tracking-widest uppercase text-cream/40 glass px-4 py-2 rounded-sm shrink-0">
              {exp.duration}
            </span>
          </div>

          <ul className="space-y-3">
            {exp.bullets.map((bullet, i) => (
              <li
                key={i}
                className="font-inter text-sm text-cream/55 leading-relaxed flex gap-3"
              >
                <span className="text-accent/70 mt-1.5 shrink-0">◆</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline node */}
      <div
        className="hidden md:flex absolute -left-[calc(2.5rem+5px)] top-10 w-3 h-3 rounded-full border-2 border-accent bg-obsidian z-20"
        style={{ boxShadow: '0 0 16px rgba(3,88,185,0.6)' }}
      />
    </motion.article>
  )
}

export default function Experience() {
  const sectionRef = useGsapReveal({ stagger: 0.18 })

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-32 px-8 md:px-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #060810 50%, #050505 100%)' }}
    >
      <ParallaxOrbs />

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader
          label="Career"
          title="Experience"
          subtitle="Building AI systems, visual creativity, and next-generation digital experiences."
        />

        {/* Timeline line */}
        <div className="relative">
          <div
            className="hidden md:block absolute left-0 top-32 bottom-8 w-px timeline-line"
            aria-hidden="true"
          />

          <div className="relative md:pl-10 space-y-12 md:space-y-16">
          {experiences.map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
