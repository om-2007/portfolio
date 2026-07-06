import Background3D from './components/Background3D'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import Feedback from './components/Feedback'
import './App.css'

function App() {
  return (
    <>
      <Background3D />
      <div className="content">
        <nav className="navbar">
          <span className="logo">OK</span>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#experience">Timeline</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
        <ChatBot />
        <Feedback />
      </div>
    </>
  )
}

export default App
