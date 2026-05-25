import { SOCIAL_LINKS } from '../constants/social'

export default function Footer() {
  return (
    <footer
      className="py-12 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10"
      style={{ borderTop: '1px solid rgba(3, 88, 185, 0.08)', background: '#050505' }}
    >
      <span
        className="font-bebas text-xl tracking-widest"
        style={{
          background: 'linear-gradient(135deg, #0358b9, #4a8fd4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Portfolio
      </span>
      <p className="font-inter text-xs text-cream/20">
        © {new Date().getFullYear()} — All images reserved. Designed with intention.
      </p>
      <div className="flex items-center gap-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-cream/20 hover:text-accent/60 transition-colors cursor-none"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
    </footer>
  )
}
