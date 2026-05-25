import { useRef } from 'react'
import { useScroll, useTransform, useSpring } from 'framer-motion'

/**
 * Scroll-linked vertical parallax for a target element.
 * Works with Lenis smooth scroll (window scroll position).
 */
export function useParallax({ speed = 80, offset = ['start end', 'end start'], smooth = true } = {}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 0.95])

  const springY = useSpring(y, { stiffness: 80, damping: 20, mass: 0.5 })

  return {
    ref,
    style: {
      y: smooth ? springY : y,
      opacity: smooth ? undefined : opacity,
      scale: smooth ? undefined : scale,
    },
    scrollYProgress,
    y: smooth ? springY : y,
    opacity,
    scale,
  }
}
