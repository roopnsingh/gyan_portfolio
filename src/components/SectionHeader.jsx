import { motion } from 'framer-motion'

export default function SectionHeader({ label, title, subtitle, className = '' }) {
  return (
    <motion.header
      className={`text-center mb-16 md:mb-20 ${className}`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="divider" />
        <span className="font-bebas text-sm md:text-base tracking-[0.25em] uppercase text-accent/80">
          {label}
        </span>
        <div className="divider" />
      </div>
      <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-cream mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-inter text-sm md:text-base text-cream/45 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}
