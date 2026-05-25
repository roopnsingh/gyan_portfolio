import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'

function useOrbitMetrics() {
  const [wide, setWide] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  )

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return wide
    ? { bubble: 76, innerR: 100, outerR: 210, stage: 560 }
    : { bubble: 58, innerR: 72, outerR: 148, stage: 360 }
}

function buildOrbitLayout(count) {
  if (count === 0) return []
  if (count <= 9) {
    return Array.from({ length: count }, (_, i) => ({
      index: i,
      radiusKey: 'outer',
      angle: (i / count) * Math.PI * 2 - Math.PI / 2,
    }))
  }

  const innerCount = Math.min(6, Math.max(4, Math.floor(count * 0.35)))
  return Array.from({ length: count }, (_, i) => {
    if (i < innerCount) {
      return {
        index: i,
        radiusKey: 'inner',
        angle: (i / innerCount) * Math.PI * 2 - Math.PI / 2,
      }
    }
    const outerI = i - innerCount
    const outerCount = count - innerCount
    return {
      index: i,
      radiusKey: 'outer',
      angle: (outerI / outerCount) * Math.PI * 2 - Math.PI / 2,
    }
  })
}

function OrbitBubble({ image, layout, metrics, rotation, isHovered, anyHovered, onHover, onLeave, onOpen }) {
  const [failed, setFailed] = useState(false)
  const radius = layout.radiusKey === 'inner' ? metrics.innerR : metrics.outerR
  const pull = isHovered ? radius * 0.12 : 0
  const r = radius - pull
  const x = Math.cos(layout.angle) * r
  const y = Math.sin(layout.angle) * r
  const scale = isHovered ? 2.35 : anyHovered ? 0.82 : 1
  const half = metrics.bubble / 2

  return (
    <motion.button
      type="button"
      className="watch-orbit-bubble cursor-none"
      style={{
        width: metrics.bubble,
        height: metrics.bubble,
        zIndex: isHovered ? 60 : 10 + layout.index,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        x: x - half,
        y: y - half,
        scale,
        rotate: -rotation,
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      aria-label={`View ${image.alt}`}
    >
      <span className="watch-orbit-bubble-ring" aria-hidden />
      {failed ? (
        <span className="watch-orbit-bubble-fallback" />
      ) : (
        <img
          src={image.src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
      {isHovered && (
        <motion.span
          className="watch-orbit-bubble-glow"
          layoutId="orbit-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )
}

export default function WatchOrbitGallery({ images, onOpen }) {
  const metrics = useOrbitMetrics()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [rotation, setRotation] = useState(0)
  const dragRef = useRef({ active: false, lastX: 0, moved: false })
  const ringRef = useRef(null)

  const layout = useMemo(() => buildOrbitLayout(images.length), [images.length])
  const maxR = metrics.outerR + metrics.bubble
  const ringSize = maxR * 2 + metrics.bubble

  const onRingPointerDown = useCallback((e) => {
    if (e.button !== 0) return
    if (e.target.closest('.watch-orbit-bubble')) return
    dragRef.current = { active: true, lastX: e.clientX, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onRingPointerMove = useCallback((e) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.lastX
    if (Math.abs(dx) > 2) dragRef.current.moved = true
    dragRef.current.lastX = e.clientX
    setRotation((r) => r + dx * 0.35)
  }, [])

  const onRingPointerUp = useCallback((e) => {
    dragRef.current.active = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }, [])

  const onWheel = useCallback((e) => {
    e.preventDefault()
    setRotation((r) => r + e.deltaY * 0.08)
  }, [])

  if (images.length === 0) return null

  return (
    <div
      className="watch-orbit-wrap"
      style={{ minHeight: metrics.stage }}
    >
      <p className="watch-orbit-hint font-inter text-xs tracking-widest uppercase text-cream/30 text-center mb-6">
        Hover to focus · Drag or scroll to explore · Click to open
      </p>

      <div
        className="watch-orbit-stage"
        style={{ width: metrics.stage, height: metrics.stage }}
        onWheel={onWheel}
        onPointerDown={onRingPointerDown}
        onPointerMove={onRingPointerMove}
        onPointerUp={onRingPointerUp}
        onPointerCancel={onRingPointerUp}
      >
        <div className="watch-orbit-center" aria-hidden>
          <span className="font-bebas text-4xl text-cream/10 tracking-widest">◉</span>
        </div>

        <motion.div
          ref={ringRef}
          className="watch-orbit-ring"
          style={{
            width: ringSize,
            height: ringSize,
            marginLeft: -ringSize / 2,
            marginTop: -ringSize / 2,
          }}
          animate={{ rotate: rotation }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          {layout.map((item) => {
            const image = images[item.index]
            return (
              <OrbitBubble
                key={image.src}
                image={image}
                layout={item}
                metrics={metrics}
                isHovered={hoveredIndex === item.index}
                anyHovered={hoveredIndex !== null}
                rotation={rotation}
                onHover={() => setHoveredIndex(item.index)}
                onLeave={() => setHoveredIndex(null)}
                onOpen={() => onOpen(item.index)}
              />
            )
          })}
        </motion.div>

        {hoveredIndex !== null && images[hoveredIndex] && (
          <motion.p
            className="watch-orbit-caption font-inter text-xs text-cream/50 tracking-wide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            key={hoveredIndex}
          >
            {String(hoveredIndex + 1).padStart(2, '0')} — {images[hoveredIndex].alt}
          </motion.p>
        )}
      </div>
    </div>
  )
}
