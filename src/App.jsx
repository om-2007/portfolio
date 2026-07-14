import { useState, useCallback, useEffect } from 'react'
import Background3D from './components/Background3D'
import SocialSidebar from './components/SocialSidebar'
import GradientOrbs from './components/GradientOrbs'
import Hero from './components/Hero'
import CurrentFocus from './components/CurrentFocus'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import HopeRobot from './components/HopeRobot'
import Feedback from './components/Feedback'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
    const [mobileOpen, setMobileOpen] = useState(false)

    const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), [])
    const closeMobile = useCallback(() => setMobileOpen(false), [])

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#focus', label: 'Focus' },
        { href: '#experience', label: 'Timeline' },
        { href: '#skills', label: 'Skills' },
        { href: '#projects', label: 'Projects' },
        { href: '#contact', label: 'Contact' },
    ]

    return (
        <>
            <Background3D />
            <SocialSidebar />
            <GradientOrbs />
            <div className="content">
                <nav className={`navbar${mobileOpen ? ' mobile-open' : ''}`}>
                    <span className="logo">OK</span>
                    <button
                        className={`hamburger${mobileOpen ? ' active' : ''}`}
                        onClick={toggleMobile}
                        aria-label="Toggle navigation menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <div className="nav-links">
                        {navLinks.map(l => (
                            <a key={l.href} href={l.href} onClick={closeMobile}>{l.label}</a>
                        ))}
                    </div>
                    {/* Mobile overlay menu */}
                    <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
                        <div className="mobile-menu-backdrop" onClick={closeMobile} />
                        <div className="mobile-menu-panel">
                            <div className="mobile-menu-header">
                                <span className="mobile-menu-logo">OK</span>
                            </div>
                            <div className="mobile-menu-links">
                                {navLinks.map(l => (
                                    <a key={l.href} href={l.href} onClick={closeMobile} className="mobile-link">
                                        <span>{l.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>
                <Hero />
                <CurrentFocus />
                <About />
                <Experience />
                <Skills />
                <Projects />
                <Contact />
                <Footer />
                <HopeRobot />
                <Feedback />
                <ScrollToTop />
            </div>
        </>
    )
}

export default App
