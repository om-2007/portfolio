import { useState, useEffect } from 'react'

const roles = [
  'Founder & Platform Architect @ Imergene',
  'AI-Native Platform Builder',
  'BTech CSE (AI) @ PVPIT',
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout

    if (!deleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 30)
      } else {
        setDeleting(false)
        setRoleIndex((prev) => (prev + 1) % roles.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, deleting, roleIndex])

  return (
    <section id="hero">
      <div className="hero-content">
        <div className="hero-image-wrapper">
          <div className="hero-glow" />
          <img src="/OM.png" alt="Om Karande" className="hero-image" draggable="false" onContextMenu={(e) => e.preventDefault()} />
        </div>
        <h1 className="hero-name">Om Karande</h1>
        <p className="hero-title">Technology Entrepreneur</p>
        <p className="hero-tagline typewriter">
          {displayText}
          <span className="cursor">|</span>
        </p>
        <div className="hero-stats-bar">
          <div className="hero-stat-item">
            <span className="hero-stat-num">10+</span>
            <span className="hero-stat-label">Projects</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="hero-stat-num">Imergene</span>
            <span className="hero-stat-label">Founder</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="hero-stat-num">AI</span>
            <span className="hero-stat-label">Focus</span>
          </div>
        </div>
        <div className="hero-cta">
          <a href="#projects" className="btn primary">View My Work</a>
          <a href="https://github.com/om-2007" target="_blank" rel="noopener noreferrer" className="btn secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: 8}}>
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
