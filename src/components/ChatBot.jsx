import { useState, useRef, useEffect, useCallback } from 'react'
import { streamChat } from '../api/groq'

const sectionMap = {
  about: 'about',
  skill: 'skills',
  project: 'projects',
  blue: 'projects',
  imergene: 'projects',
  timeline: 'experience',
  experience: 'experience',
  contact: 'contact',
  hire: 'contact',
  resume: 'about',
}

const followUpMap = {
  projects: ['What tech stack do you use?', 'Tell me about Imergene', 'What is Blue?'],
  skills: ['What projects have you built?', 'Tell me about your experience', 'Hire Om?'],
  imergene: ['What is Blue?', 'What tech stack do you use?', 'Hire Om?'],
  blue: ['Tell me about Imergene', 'What projects have you built?', 'What is BlueV2?'],
  experience: ['What projects have you built?', 'What tech stack do you use?', 'Tell me about Imergene'],
  contact: ['What projects have you built?', 'Tell me about Imergene', 'What is Blue?'],
  hire: ['Tell me about Imergene', 'What is Blue?', 'What projects have you built?'],
  default: ['What projects have you built?', 'What tech stack do you use?', 'Tell me about Imergene'],
}

const quickActions = [
  'What projects have you built?',
  'What tech stack do you use?',
  'Tell me about Imergene',
  'What is Blue?',
  'Hire Om?',
]

function scrollToSection(text) {
  const lower = text.toLowerCase()
  for (const [keyword, id] of Object.entries(sectionMap)) {
    if (lower.includes(keyword)) {
      const el = document.getElementById(id)
      if (el) {
        console.log(`[scrollToSection] keyword="${keyword}" → id="${id}" — scrolling`)
        el.scrollIntoView({ block: 'start' })
        return
      } else {
        console.warn(`[scrollToSection] keyword="${keyword}" → id="${id}" — element not found`)
      }
    }
  }
  console.warn(`[scrollToSection] no match for "${text}"`)
}

function getFollowUps(text) {
  const lower = text.toLowerCase()
  for (const [keyword, suggestions] of Object.entries(followUpMap)) {
    if (lower.includes(keyword)) return suggestions
  }
  return followUpMap.default
}

function getSuggestionsFromResponse(text) {
  const lower = text.toLowerCase()
  const asked = []
  if (lower.includes('imer gene') || lower.includes('imergene')) asked.push('imergene')
  if (lower.includes('blue')) asked.push('blue')
  if (lower.includes('project') || lower.includes('built') || lower.includes('build')) asked.push('projects')
  if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack')) asked.push('skills')
  if (lower.includes('experience') || lower.includes('background')) asked.push('experience')

  const used = new Set()
  const suggestions = []
  const pool = asked.length > 0 ? followUpMap[asked[0]] || followUpMap.default : followUpMap.default
  for (const s of pool) {
    if (!used.has(s)) {
      suggestions.push(s)
      used.add(s)
    }
    if (suggestions.length >= 3) break
  }
  return suggestions.length > 0 ? suggestions : followUpMap.default
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m Hope, Om\'s AI assistant. Ask me anything about his work, skills, or projects.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [followUps, setFollowUps] = useState([])
  const [showLead, setShowLead] = useState(false)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadDone, setLeadDone] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return
    setInput('')
    setFollowUps([])
    setMessages((prev) => [...prev, { role: 'user', text }])
    setLoading(true)
    setStreamingText('')

    const history = messages.map((m) => ({ role: m.role, content: m.text }))

    scrollToSection(text)

    if (text.toLowerCase().includes('hire') || text.toLowerCase().includes('recruit') || text.toLowerCase().includes('job')) {
      setTimeout(() => setShowLead(true), 500)
    }

    try {
      const full = await streamChat(text, history, (chunk) => {
        setStreamingText(chunk)
      })
      setMessages((prev) => [...prev, { role: 'assistant', text: full }])
      setStreamingText('')
      setFollowUps(getSuggestionsFromResponse(full))
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, I ran into an issue. Try again in a moment.' }])
      setFollowUps(followUpMap.default)
    }
    setLoading(false)
  }, [messages, loading])

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    if (!leadEmail.trim()) return
    const existing = JSON.parse(localStorage.getItem('hope_leads') || '[]')
    existing.push({ email: leadEmail, date: new Date().toISOString() })
    localStorage.setItem('hope_leads', JSON.stringify(existing))
    setLeadDone(true)
    setLeadEmail('')
  }

  return (
    <>
      <button className={`chat-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
          ) : (
            <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>
          )}
        </svg>
      </button>

      <div className={`chat-window ${open ? 'visible' : ''}`}>
        <div className="chat-header">
          <span className="chat-header-title">Hope</span>
          <span className="chat-header-sub">AI assistant — ask me anything</span>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              {msg.text}
            </div>
          ))}
          {streamingText && (
            <div className="chat-msg assistant streaming">
              {streamingText}
              <span className="chat-cursor">|</span>
            </div>
          )}
          {loading && !streamingText && (
            <div className="chat-msg assistant">
              <span className="chat-dot-pulse" />
            </div>
          )}

          {followUps.length > 0 && !loading && (
            <div className="chat-followups">
              {followUps.map((q) => (
                <button key={q} className="chat-chip" onClick={() => send(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={endRef} />
        </div>

        {messages.length === 1 && (
          <div className="chat-quick">
            {quickActions.map((q) => (
              <button key={q} className="chat-chip" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-bar">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }}}
            placeholder="Ask anything..."
            disabled={loading}
          />
          <button className="chat-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {showLead && (
        <div className="lead-overlay" onClick={() => { if (!leadDone) return; setShowLead(false) }}>
          <div className="lead-modal" onClick={(e) => e.stopPropagation()}>
            {!leadDone ? (
              <>
                <h3>Interested in hiring Om?</h3>
                <p>Leave your email and he'll get back to you.</p>
                <form onSubmit={handleLeadSubmit}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <button type="submit" className="btn primary">Send Interest</button>
                </form>
                <button className="lead-skip" onClick={() => { setShowLead(false); setLeadDone(false) }}>Not now</button>
              </>
            ) : (
              <>
                <h3>Got it!</h3>
                <p>Om will be notified. Anything else I can help with?</p>
                <button className="btn primary" onClick={() => { setShowLead(false); setLeadDone(false) }}>Continue</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
