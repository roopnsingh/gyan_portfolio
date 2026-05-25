import { useEffect } from 'react'
import { useLenis } from './hooks/useLenis'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Experience from './components/Experience'
import Skills from './components/Skills'
import About from './components/About'
import Footer from './components/Footer'
import { ParallaxDivider } from './components/Parallax'

export default function App() {
  // Initialize Lenis smooth scroll
  useLenis()

  return (
    <>
      {/* Grain overlay — fixed, always on top */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main>
        <Hero />
        <ParallaxDivider />
        <About />
        <ParallaxDivider />
        <Gallery />
        <ParallaxDivider />
        <Experience />
        <ParallaxDivider />
        <Skills />
        <Footer />
      </main>
    </>
  )
}
