import { motion } from 'framer-motion'
import { useParallax } from '../hooks/useParallax'

/** Wraps children with vertical scroll parallax */
export function Parallax({ children, speed = 60, className = '' }) {
  const { ref, y } = useParallax({ speed })

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/** Decorative layer — moves at a different rate for depth */
export function ParallaxFloat({ children, speed = 120, className = '' }) {
  const { ref, y } = useParallax({ speed })

  return (
    <motion.div ref={ref} style={{ y }} className={`pointer-events-none ${className}`}>
      {children}
    </motion.div>
  )
}

/** Teal ambient orbs with parallax (place inside a relative section) */
export function ParallaxOrbs() {
  const slow = useParallax({ speed: 100 })
  const fast = useParallax({ speed: 180 })

  return (
    <>
      <motion.div
        ref={slow.ref}
        style={{ y: slow.y }}
        className="absolute -left-20 top-1/4 w-64 h-64 rounded-full pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(3,88,185,0.12) 0%, transparent 70%)' }}
        />
      </motion.div>
      <motion.div
        ref={fast.ref}
        style={{ y: fast.y }}
        className="absolute -right-16 bottom-1/4 w-48 h-48 rounded-full pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,143,212,0.08) 0%, transparent 70%)' }}
        />
      </motion.div>
    </>
  )
}

/** Subtle parallax band between sections */
export function ParallaxDivider() {
  const line = useParallax({ speed: 30, offset: ['start bottom', 'end top'] })
  const glow = useParallax({ speed: 70, offset: ['start bottom', 'end top'] })

  return (
    <div className="relative h-20 md:h-28 overflow-hidden" aria-hidden="true">
      <motion.div
        ref={glow.ref}
        style={{ y: glow.y }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-30"
      >
        <div
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle, rgba(3,88,185,0.2) 0%, transparent 70%)' }}
        />
      </motion.div>
      <motion.div
        ref={line.ref}
        style={{ y: line.y }}
        className="absolute inset-x-8 md:inset-x-24 top-1/2 -translate-y-1/2 h-px"
      >
        <div
          className="w-full h-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(3,88,185,0.4), transparent)' }}
        />
      </motion.div>
    </div>
  )
}
