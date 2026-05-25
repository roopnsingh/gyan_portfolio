import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP scroll-triggered stagger reveal for children with [data-reveal]
 */
export function useGsapReveal({ stagger = 0.12, y = 56, blur = 10 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = root.querySelectorAll('[data-reveal]')
    if (!targets.length) return

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        filter: `blur(${blur}px)`,
        duration: 1.1,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })
    }, root)

    return () => ctx.revert()
  }, [stagger, y, blur])

  return ref
}
