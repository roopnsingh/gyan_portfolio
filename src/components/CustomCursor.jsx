import { useEffect, useRef } from 'react'

/**
 * CustomCursor — accent dot + ring cursor with hover expansion
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let animId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top = mouseY + 'px'
    }

    const animate = () => {
      // Ring lags behind for smooth trailing effect
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      animId = requestAnimationFrame(animate)
    }

    const onMouseEnterHover = () => {
      dot.classList.add('hovering')
      ring.classList.add('hovering')
    }

    const onMouseLeaveHover = () => {
      dot.classList.remove('hovering')
      ring.classList.remove('hovering')
    }

    // Add hover class to interactive elements
    const addListeners = () => {
      document.querySelectorAll('a, button, .magnetic-btn, img, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterHover)
        el.addEventListener('mouseleave', onMouseLeaveHover)
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    addListeners()
    animId = requestAnimationFrame(animate)

    // Re-add listeners on DOM changes (lazy loaded content)
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
