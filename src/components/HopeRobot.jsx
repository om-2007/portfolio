import { useState, useRef, useEffect, useCallback } from 'react'
import { streamChat } from '../api/groq'
import downloadResume from '../utils/downloadResume'

/* ── Chat logic ── */

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
    'Send me your resume',
    'What is Blue?',
    'Copy your email',
    'Hire Om?',
]

/* ── PA powers: local actions Hope can perform on your behalf ── */
const SOCIAL = {
    github: 'https://github.com/om-2007',
    linkedin: 'https://linkedin.com/in/om-karande',
    twitter: 'https://x.com/Imergene148310',
    email: 'omnileshkarande@gmail.com',
}

const VISITOR_KEY = 'hope_visitor'

function loadVisitor() {
    try {
        return JSON.parse(localStorage.getItem(VISITOR_KEY) || 'null')
    } catch {
        return null
    }
}

function saveVisitor(data) {
    try {
        localStorage.setItem(VISITOR_KEY, JSON.stringify(data))
    } catch {
        /* ignore */
    }
}

const NAME_STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'to', 'we', 'you', 'he', 'she', 'it', 'they', 'am', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should',
    'may', 'might', 'must', 'this', 'that', 'these', 'those', 'here', 'there', 'not', 'no', 'yes', 'ok', 'okay',
    'fine', 'good', 'great', 'happy', 'sad', 'sorry', 'thanks', 'thank', 'working', 'looking', 'interested',
    'from', 'in', 'on', 'at', 'of', 'for', 'with', 'my', 'your', 'our', 'their', 'just', 'really', 'actually',
])

function extractName(text) {
    const m = text.match(/\b(?:my name is|i am|i'm|i’m|call me|this is)\s+([A-Za-z][A-Za-z'-]+)/i)
    if (!m) return null
    const raw = m[1]
    if (raw.length < 2 || NAME_STOPWORDS.has(raw.toLowerCase())) return null
    return raw.charAt(0).toUpperCase() + raw.slice(1)
}

function detectPAAction(text) {
    const lower = text.toLowerCase()
    if (lower.includes('resume') || lower.includes(' cv') || lower.includes('curriculum')) {
        return { type: 'resume' }
    }
    if (lower.includes('linkedin')) return { type: 'open', url: SOCIAL.linkedin, label: 'LinkedIn' }
    if (lower.includes('github')) return { type: 'open', url: SOCIAL.github, label: 'GitHub' }
    if (lower.includes('twitter') || lower.includes('x.com')) return { type: 'open', url: SOCIAL.twitter, label: 'X' }
    if (lower.includes('copy') && lower.includes('email')) return { type: 'copy-email' }
    if (lower.includes('email') || lower.includes('mail')) return { type: 'open', url: `mailto:${SOCIAL.email}`, label: 'email' }
    return null
}

function performPAAction(pa) {
    switch (pa.type) {
        case 'resume': {
            const el = document.getElementById('resume-pdf-container')
            if (el && el.firstElementChild) {
                downloadResume(el.firstElementChild).catch(() => { })
                return "Sure thing — I'm generating Om's resume PDF for you now, it should download in a moment. Anything else I can help with?"
            }
            return "Hmm, I couldn't find the resume to download right now. You can also grab it from the 'Resume' button in the sidebar."
        }
        case 'open':
            window.open(pa.url, '_blank', 'noopener,noreferrer')
            return `Opening ${pa.label} for you in a new tab.`
        case 'copy-email':
            try {
                navigator.clipboard?.writeText(SOCIAL.email)
                return `Copied Om's email to your clipboard: ${SOCIAL.email}`
            } catch {
                return `Om's email is ${SOCIAL.email}`
            }
        default:
            return 'Done!'
    }
}

function scrollToSection(text) {
    const lower = text.toLowerCase()
    for (const [keyword, id] of Object.entries(sectionMap)) {
        if (lower.includes(keyword)) {
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ block: 'start' })
                return
            }
        }
    }
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

/* ── Robot action / expression types ── */

const ACTIONS = [
    'idle',
    'walking',
    'fishing',
    'dancing',
    'thinking',
    'waving',
    'sleeping',
    'jumping',
    'eating',
    'stretching',
    'playing',
    'spinning',
    'meditating',
    'victory',
    'blowing',
]

const EXPRESSIONS = ['happy', 'neutral', 'excited', 'thinking', 'blink', 'sad', 'sleepy', 'love']

const ACTION_TO_EXPR = {
    idle: 'neutral',
    walking: 'neutral',
    fishing: 'neutral',
    dancing: 'excited',
    thinking: 'thinking',
    waving: 'happy',
    sleeping: 'sleepy',
    jumping: 'excited',
    eating: 'happy',
    stretching: 'happy',
    playing: 'excited',
    spinning: 'excited',
    meditating: 'neutral',
    victory: 'excited',
    blowing: 'happy',
}

/* ── Viewport helper ── */

const ROBOT_W = 160
const ROBOT_H = 190

function clampPosition(x, y, w = ROBOT_W, h = ROBOT_H) {
    const pad = 20
    const maxX = window.innerWidth - w - pad
    const maxY = window.innerHeight - h - pad
    return {
        x: Math.max(pad, Math.min(x, maxX)),
        y: Math.max(pad, Math.min(y, maxY)),
    }
}

/* ── Get perch position ABOVE the chat window (like OpenAI pet) ── */
function getPerchPos() {
    const chatW = 380
    const chatH = 560
    const gap = 14
    const right = 24
    const bottom = 92
    // Center Hope horizontally above the chat window
    const x = window.innerWidth - right - chatW + (chatW - ROBOT_W) / 2
    // Chat window top edge from viewport top
    const chatTop = window.innerHeight - bottom - chatH
    // Hope sits above the chat window with a gap
    const y = chatTop - gap - ROBOT_H
    return clampPosition(x, Math.max(8, y), ROBOT_W, ROBOT_H)
}

const CORNER_NAMES = ['top-left', 'top-right', 'bottom-right']

function getCornerPos(corner) {
    if (typeof window === 'undefined') return { x: 60, y: 60 }
    const pad = window.innerWidth < 480 ? 24 : window.innerWidth < 640 ? 36 : 60
    const w = window.innerWidth
    const h = window.innerHeight
    switch (corner) {
        case 'top-left':
            return clampPosition(pad, pad)
        case 'top-right':
            return clampPosition(w - ROBOT_W - pad, pad)
        case 'bottom-right':
            return clampPosition(w - ROBOT_W - pad, h - ROBOT_H - pad)
        default:
            return clampPosition(pad, pad)
    }
}

function getRandomCornerPos() {
    const corner = CORNER_NAMES[Math.floor(Math.random() * CORNER_NAMES.length)]
    return getCornerPos(corner)
}

function getDefaultCornerPos() {
    return getCornerPos('bottom-right')
}

/* ══════════════════════════════════════════════════════════════
   RobotSVG  —  full character drawing (120×140 viewBox)
   ══════════════════════════════════════════════════════════════ */

function RobotSVG({ action, expression, chatting, headAngle }) {
    const is = (a) => action === a

    /* ── eyes ── */
    const eyeShape = (side) => {
        const x = side === 'l' ? -11 : 11
        switch (expression) {
            case 'happy':
                return `M${x - 5},-1 Q${x},-6 ${x + 5},-1`
            case 'excited':
                return `M${x - 6},0 Q${x},-7 ${x + 6},0`
            case 'thinking':
                if (side === 'l') return `M${x - 5},-1 Q${x},-6 ${x + 5},-1`
                return `M${x - 5},1 Q${x},-2 ${x + 5},1`
            case 'blink':
                return `M${x - 6},0 L${x + 6},0`
            case 'sad':
                return `M${x - 5},1 Q${x},5 ${x + 5},1`
            case 'sleepy':
                return `M${x - 5},2 Q${x},4 ${x + 5},2`
            case 'love':
                return `M${x - 6},-1 Q${x},-5 ${x + 6},-1`
            default:
                return `M${x - 5},0 Q${x},-4 ${x + 5},0`
        }
    }

    const mouthPath = () => {
        switch (expression) {
            case 'happy': return 'M-6,7 Q0,15 6,7'
            case 'excited': return 'M-5,7 Q0,14 5,7'
            case 'thinking': return 'M-5,9 Q0,10 5,9'
            case 'sad': return 'M-6,9 Q0,5 6,9'
            case 'blink': return 'M-5,9 Q0,11 5,9'
            case 'sleepy': return 'M-5,8 Q0,10 5,8'
            case 'love': return 'M-6,6 Q0,14 6,6'
            default: return 'M-5,8 Q0,11 5,8'
        }
    }

    const showBlush = expression === 'happy' || expression === 'excited' || expression === 'love'
    const closedEyes = expression === 'blink' || expression === 'sleepy'

    const headTransform = headAngle
        ? `rotate(${headAngle}, 60, 38)`
        : ''

    return (
        <svg
            className={`hope-robot-svg action-${action} expression-${expression}${chatting ? ' is-chatting' : ''}`}
            viewBox="0 0 120 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="rb" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3a3a6a" />
                    <stop offset="100%" stopColor="#2a2a4a" />
                </linearGradient>
                <linearGradient id="rh" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#40407a" />
                    <stop offset="100%" stopColor="#2e2e54" />
                </linearGradient>
                <linearGradient id="ag" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="rs">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
                </filter>
                <filter id="gf">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Shadow */}
            <ellipse cx="60" cy="136" rx="30" ry="5" fill="rgba(0,0,0,0.25)" className="robot-shadow" />

            {/* ── ANTENNA ── */}
            <g className="robot-antenna">
                <line x1="60" y1="14" x2="60" y2="2" stroke="#8888bb" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="60" cy="2" r="5" fill="#ff6b8a" filter="url(#gf)" />
            </g>

            {/* ── ZZZ (sleeping) ── */}
            {is('sleeping') && (
                <g className="sleeping-bubbles">
                    <text x="82" y="10" fill="#c084fc" fontSize="10" opacity="0.8" className="zzz-1">z</text>
                    <text x="90" y="2" fill="#c084fc" fontSize="8" opacity="0.55" className="zzz-2">z</text>
                    <text x="97" y="-4" fill="#c084fc" fontSize="6" opacity="0.3" className="zzz-3">z</text>
                </g>
            )}

            {/* ── FOOD (eating) ── */}
            {is('eating') && (
                <g className="eating-items">
                    <ellipse cx="48" cy="44" rx="5" ry="3.5" fill="#ff6b8a" className="food-1" />
                    <ellipse cx="72" cy="44" rx="5" ry="3.5" fill="#4ecdc4" className="food-2" />
                </g>
            )}

            {/* ── BALL (playing) ── */}
            {is('playing') && (
                <g className="play-ball">
                    <circle cx="104" cy="112" r="7" fill="#ffd166" className="game-ball" />
                    <path d="M100,108 Q104,105 108,108" stroke="#fff" strokeWidth="1.2" fill="none" />
                </g>
            )}

            {/* ── MEDITATION: Lotus pose ── */}
            {is('meditating') && (
                <g className="meditation-items">
                    <ellipse cx="60" cy="108" rx="22" ry="8" fill="rgba(192,132,252,0.08)" stroke="rgba(192,132,252,0.15)" strokeWidth="1" />
                    <text x="60" y="114" textAnchor="middle" fill="#c084fc" fontSize="8" opacity="0.6">~ om ~</text>
                </g>
            )}

            {/* ── VICTORY: sparkles ── */}
            {is('victory') && (
                <g className="victory-items">
                    <text x="8" y="40" fill="#ffd166" fontSize="10" className="sparkle-1">✦</text>
                    <text x="102" y="36" fill="#ff6b8a" fontSize="8" className="sparkle-2">✦</text>
                    <text x="4" y="70" fill="#4ecdc4" fontSize="7" className="sparkle-3">✦</text>
                </g>
            )}

            {/* ── BLOWING: puff hearts/wind ── */}
            {is('blowing') && (
                <g className="blowing-items">
                    <text x="104" y="52" fill="#ff6b8a" fontSize="8" className="puff-1">♡</text>
                    <text x="112" y="44" fill="#ff6b8a" fontSize="6" className="puff-2">♡</text>
                    <text x="108" y="60" fill="#ff6b8a" fontSize="5" className="puff-3">♡</text>
                </g>
            )}

            {/* ── LEFT ARM ── */}
            <g className="robot-arm left-arm">
                {is('fishing') ? (
                    <>
                        <line x1="28" y1="62" x2="8" y2="90" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                        <line x1="8" y1="90" x2="8" y2="118" stroke="#8888bb" strokeWidth="1.5" strokeLinecap="round" className="fishing-line" />
                        <circle cx="8" cy="118" r="3" fill="#ff6b8a" className="fishing-bobber" />
                    </>
                ) : is('dancing') ? (
                    <>
                        <line x1="28" y1="58" x2="2" y2="35" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="dance-arm" />
                        <circle cx="2" cy="35" r="5" fill="#c084fc" opacity="0.6" className="dance-sparkle" />
                    </>
                ) : is('waving') ? (
                    <>
                        <line x1="28" y1="58" x2="6" y2="40" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="wave-arm" />
                        <circle cx="6" cy="40" r="5" fill="#c084fc" opacity="0.4" />
                    </>
                ) : is('thinking') ? (
                    <>
                        <line x1="28" y1="58" x2="14" y2="48" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                        <circle cx="14" cy="48" r="4" fill="#8888bb" />
                    </>
                ) : is('sleeping') ? (
                    <line x1="28" y1="60" x2="10" y2="78" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('jumping') ? (
                    <line x1="28" y1="58" x2="8" y2="36" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="jump-arm" />
                ) : is('eating') ? (
                    <line x1="28" y1="58" x2="42" y2="44" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="eat-arm" />
                ) : is('stretching') ? (
                    <line x1="28" y1="58" x2="14" y2="18" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="stretch-arm" />
                ) : is('playing') ? (
                    <line x1="28" y1="58" x2="6" y2="44" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="play-arm" />
                ) : is('meditating') ? (
                    <line x1="28" y1="58" x2="34" y2="86" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('victory') ? (
                    <line x1="28" y1="58" x2="6" y2="20" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="victory-arm" />
                ) : is('blowing') ? (
                    <line x1="28" y1="58" x2="82" y2="52" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="blow-arm" />
                ) : (
                    <line x1="28" y1="60" x2="8" y2="75" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                )}
            </g>

            {/* ── RIGHT ARM ── */}
            <g className="robot-arm right-arm">
                {is('fishing') ? (
                    <line x1="92" y1="62" x2="112" y2="78" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('dancing') ? (
                    <>
                        <line x1="92" y1="58" x2="118" y2="35" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="dance-arm" />
                        <circle cx="118" cy="35" r="5" fill="#6366f1" opacity="0.6" className="dance-sparkle" />
                    </>
                ) : is('waving') ? (
                    <line x1="92" y1="58" x2="112" y2="60" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('thinking') ? (
                    <line x1="92" y1="58" x2="110" y2="75" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('sleeping') ? (
                    <line x1="92" y1="60" x2="110" y2="78" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('jumping') ? (
                    <line x1="92" y1="58" x2="112" y2="36" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="jump-arm" />
                ) : is('eating') ? (
                    <line x1="92" y1="58" x2="78" y2="44" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="eat-arm" />
                ) : is('stretching') ? (
                    <line x1="92" y1="58" x2="106" y2="18" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="stretch-arm" />
                ) : is('playing') ? (
                    <line x1="92" y1="58" x2="114" y2="50" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="play-arm" />
                ) : is('meditating') ? (
                    <line x1="92" y1="58" x2="86" y2="86" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : is('victory') ? (
                    <line x1="92" y1="58" x2="114" y2="20" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" className="victory-arm" />
                ) : is('blowing') ? (
                    <line x1="92" y1="58" x2="112" y2="50" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                ) : (
                    <line x1="92" y1="60" x2="112" y2="75" stroke="#3a3a6a" strokeWidth="7" strokeLinecap="round" />
                )}
            </g>

            {/* ── BODY ── */}
            <g className="robot-body">
                <rect x="32" y="56" width="56" height="44" rx="8" fill="url(#rb)" stroke="#5555aa" strokeWidth="1.5" filter="url(#rs)" />
                <rect x="42" y="62" width="36" height="22" rx="4" fill="rgba(192,132,252,0.08)" stroke="rgba(192,132,252,0.15)" strokeWidth="1" />
                <circle cx="60" cy="73" r="5" fill="url(#ag)" className="robot-heart" />
                <path d="M58,71.5 Q60,69 62,71.5 Q64,74 60,76.5 Q56,74 58,71.5Z" fill="#fff" opacity="0.8" />
                <circle cx="46" cy="62" r="2.5" fill="#ff6b8a" opacity="0.7" />
                <circle cx="74" cy="62" r="2.5" fill="#4ecdc4" opacity="0.7" />
            </g>

            {/* ── HEAD with mouse-tracking angle ── */}
            <g className="robot-head" transform={headTransform}>
                <rect x="26" y="14" width="68" height="48" rx="14" fill="url(#rh)" stroke="#5555aa" strokeWidth="1.5" filter="url(#rs)" />
                <rect x="32" y="22" width="56" height="32" rx="8" fill="rgba(0,0,0,0.2)" />

                {/* Eyes */}
                <g className="robot-eyes">
                    <path d={eyeShape('l')} stroke="#e8e8ff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <path d={eyeShape('r')} stroke="#e8e8ff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    {!closedEyes && (
                        <>
                            <circle cx={expression === 'happy' ? 48 : 49} cy={expression === 'happy' ? 27 : 29} r="2" fill="#c084fc" />
                            <circle cx={expression === 'happy' ? 72 : 71} cy={expression === 'happy' ? 27 : 29} r="2" fill="#c084fc" />
                        </>
                    )}
                </g>

                {/* Mouth */}
                <path d={mouthPath()} stroke="#e8e8ff" strokeWidth="2" strokeLinecap="round" fill="none" className="robot-mouth" />

                {/* Blush */}
                {showBlush && (
                    <>
                        <ellipse cx="39" cy="41" rx="5" ry="3" fill="#ff6b8a" opacity="0.25" className="robot-blush" />
                        <ellipse cx="81" cy="41" rx="5" ry="3" fill="#ff6b8a" opacity="0.25" className="robot-blush" />
                    </>
                )}

                {/* Love hearts */}
                {expression === 'love' && (
                    <g className="love-hearts">
                        <text x="18" y="20" fill="#ff6b8a" fontSize="8" opacity="0.7">♡</text>
                        <text x="96" y="16" fill="#ff6b8a" fontSize="6" opacity="0.5">♡</text>
                    </g>
                )}

                {/* Thinking bubbles */}
                {is('thinking') && (
                    <g className="thinking-bubbles">
                        <circle cx="88" cy="20" r="3" fill="#c084fc" opacity="0.6" />
                        <circle cx="96" cy="14" r="5" fill="#c084fc" opacity="0.5" />
                        <circle cx="106" cy="6" r="8" fill="#c084fc" opacity="0.3" />
                    </g>
                )}
            </g>

            {/* ── LEFT LEG ── */}
            <g className="robot-leg left-leg">
                {is('sleeping') ? (
                    <>
                        <line x1="42" y1="98" x2="34" y2="120" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" />
                        <rect x="26" y="118" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                ) : is('jumping') ? (
                    <>
                        <line x1="42" y1="98" x2="32" y2="112" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" className="jump-leg" />
                        <rect x="24" y="110" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                ) : is('meditating') ? (
                    <>
                        <line x1="42" y1="98" x2="30" y2="106" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" />
                        <rect x="22" y="104" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                ) : (
                    <>
                        <line x1="42" y1="98" x2="36" y2="122" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" />
                        <rect x="28" y="120" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                )}
            </g>

            {/* ── RIGHT LEG ── */}
            <g className="robot-leg right-leg">
                {is('sleeping') ? (
                    <>
                        <line x1="78" y1="98" x2="86" y2="120" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" />
                        <rect x="78" y="118" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                ) : is('jumping') ? (
                    <>
                        <line x1="78" y1="98" x2="88" y2="112" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" className="jump-leg" />
                        <rect x="80" y="110" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                ) : is('meditating') ? (
                    <>
                        <line x1="78" y1="98" x2="90" y2="106" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" />
                        <rect x="82" y="104" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                ) : (
                    <>
                        <line x1="78" y1="98" x2="84" y2="122" stroke="#3a3a6a" strokeWidth="8" strokeLinecap="round" />
                        <rect x="76" y="120" width="16" height="8" rx="4" fill="#3a3a6a" stroke="#5555aa" strokeWidth="1" />
                    </>
                )}
            </g>

            {/* Fishing rod extra */}
            {is('fishing') && (
                <g className="fishing-rod">
                    <line x1="28" y1="62" x2="-4" y2="20" stroke="#a08860" strokeWidth="2" strokeLinecap="round" />
                    <line x1="-4" y1="20" x2="8" y2="90" stroke="#8888bb" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                </g>
            )}
        </svg>
    )
}

/* ══════════════════════════════════════════════════════════════
   Main HopeRobot component
   ══════════════════════════════════════════════════════════════ */

export default function HopeRobot() {
    /* ── Chat state ── */
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm Hope, Om's AI assistant. Ask me anything about his work, skills, or projects." },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [streamingText, setStreamingText] = useState('')
    const [followUps, setFollowUps] = useState([])
    const [showLead, setShowLead] = useState(false)
    const [leadEmail, setLeadEmail] = useState('')
    const [leadDone, setLeadDone] = useState(false)

    /* ── Robot state ── */
    /* ── Robot state ── */
    const [pos, setPos] = useState(getDefaultCornerPos)
    const [action, setAction] = useState('idle')
    const [expression, setExpression] = useState('neutral')
    const [chatting, setChatting] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const [headAngle, setHeadAngle] = useState(0)

    /* ── Mobile detection: drop the roaming robot, show a fixed chat FAB ── */
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    )

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)')
        const onChange = (e) => setIsMobile(e.matches)
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    /* ── Refs ── */
    const endRef = useRef(null)
    const inputRef = useRef(null)
    const containerRef = useRef(null)
    const roamTimer = useRef(null)
    const moveEndTimer = useRef(null)
    const actionTimer = useRef(null)
    const mouseTrackRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)

    /* ── Chat scroll ── */
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingText])

    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    /* ── Window resize ── */
    useEffect(() => {
        const onResize = () => {
            if (open) {
                setPos(getPerchPos())
            } else {
                setPos((p) => clampPosition(p.x, p.y))
            }
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [open])

    /* ── Mouse tracking (head follows cursor) ── */
    useEffect(() => {
        if (isMobile) return
        const onMouseMove = (e) => {
            mouseTrackRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener('mousemove', onMouseMove)
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [isMobile])

    /* ── RAF loop for smooth head tracking ── */
    useEffect(() => {
        if (isMobile) return
        const TRACK_RADIUS = 180 // pixels — how close the mouse must be to trigger head turn
        const MAX_ANGLE = 20 // degrees — max head rotation

        const tick = () => {
            if (!containerRef.current) {
                rafRef.current = requestAnimationFrame(tick)
                return
            }
            const rect = containerRef.current.getBoundingClientRect()
            const robotCX = rect.left + rect.width / 2
            const robotCY = rect.top + rect.height / 2
            const mx = mouseTrackRef.current.x
            const my = mouseTrackRef.current.y
            const dx = mx - robotCX
            const dy = my - robotCY
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < TRACK_RADIUS && dist > 5) {
                const rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI
                // Clamp to a reasonable range: we want head to look left/right mostly
                let angle = rawAngle
                // Flip for bottom quadrants so the robot looks down in a natural way
                if (angle > 90) angle = 90
                if (angle < -90) angle = -90
                // Scale the angle based on distance
                const factor = 1 - dist / TRACK_RADIUS
                setHeadAngle(angle * factor * (MAX_ANGLE / 90))
            } else {
                setHeadAngle(0)
            }
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    /* ── Position above chat when open ── */
    useEffect(() => {
        if (open) {
            setPos(getPerchPos())
        }
    }, [open])

    /* ── Random action helper ── */
    const doRandomAction = useCallback(() => {
        const pool = ACTIONS.filter((a) => a !== 'walking' && a !== 'idle')
        const a = pool[Math.floor(Math.random() * pool.length)]
        setAction(a)
        setExpression(ACTION_TO_EXPR[a] || 'neutral')
        clearTimeout(actionTimer.current)
        actionTimer.current = setTimeout(() => {
            setAction('idle')
            setExpression('neutral')
        }, 6000 + Math.random() * 5000) // 6-11 seconds — longer action duration
    }, [])

    /* ── Move to random position (in the bottom-right area or up near chat) ── */
    /* ── Move to a random corner (top-left, top-right, or bottom-right) ── */
    const moveToRandom = useCallback(() => {
        const clamped = getRandomCornerPos()
        setPos(clamped)
        setAction('walking')
        setExpression('neutral')
        setIsMoving(true)
        clearTimeout(moveEndTimer.current)
        moveEndTimer.current = setTimeout(() => {
            setIsMoving(false)
            doRandomAction()
        }, 2500 + Math.random() * 1500)
    }, [doRandomAction])

    /* ── Roaming scheduler ── */
    const scheduleNext = useCallback(() => {
        if (open) {
            roamTimer.current = setTimeout(scheduleNext, 1000)
            return
        }
        const shouldMove = Math.random() > 0.45
        if (shouldMove) {
            moveToRandom()
            roamTimer.current = setTimeout(scheduleNext, 4500 + Math.random() * 2500)
        } else {
            doRandomAction()
            roamTimer.current = setTimeout(scheduleNext, 5000 + Math.random() * 3000)
        }
    }, [open, moveToRandom, doRandomAction])

    useEffect(() => {
        if (isMobile) return
        const t = setTimeout(scheduleNext, 1500)
        return () => {
            clearTimeout(t)
            clearTimeout(roamTimer.current)
            clearTimeout(moveEndTimer.current)
            clearTimeout(actionTimer.current)
        }
    }, [scheduleNext, isMobile])

    /* ── Blink ── */
    useEffect(() => {
        const blink = setInterval(() => {
            if (expression !== 'blink' && !open && !is('sleeping')) {
                setExpression('blink')
                setTimeout(() => setExpression('neutral'), 200)
            }
        }, 4000)
        return () => clearInterval(blink)
    }, [expression, open]) // eslint-disable-line react-hooks/exhaustive-deps

    function is(a) { return action === a }

    /* ── Chat send ── */
    const send = useCallback(async (text) => {
        if (!text.trim() || loading) return
        setInput('')
        setFollowUps([])
        setMessages((prev) => [...prev, { role: 'user', text }])
        setLoading(true)
        setStreamingText('')
        setChatting(true)
        setAction('idle')
        setExpression('neutral')

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
        setChatting(false)
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

    /* ── Toggle chat ── */
    const toggleChat = () => {
        setOpen((prev) => {
            if (!prev) {
                setChatting(true)
                setAction('idle')
                setExpression('happy')
                setPos(getPerchPos())
            } else {
                setChatting(false)
                setAction('idle')
                setExpression('neutral')
                setPos(getDefaultCornerPos())
            }
            return !prev
        })
    }

    /* ── Action badge emoji ── */
    const actionEmoji = {
        dancing: '🎵',
        fishing: '🎣',
        thinking: '💭',
        waving: '👋',
        walking: '🚶',
        sleeping: '💤',
        jumping: '⭐',
        eating: '🍖',
        stretching: '✨',
        playing: '⚽',
        spinning: '🌀',
        meditating: '🧘',
        victory: '🏆',
        blowing: '💨',
    }

    /* ── Render ── */
    return (
        <>
            {/* ── Robot character (corner‑based with perch when chat open) ── */}
            <div
                ref={containerRef}
                className={`hope-robot-container ${open ? 'chat-open' : ''}`}
                style={{ left: pos.x, top: pos.y }}
                onClick={toggleChat}
                role="button"
                tabIndex={0}
                aria-label={open ? 'Close chat' : 'Open chat with Hope'}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleChat()
                    }
                }}
            >
                <RobotSVG action={action} expression={expression} chatting={chatting} headAngle={headAngle} />
                <div className="hope-robot-label">Hope</div>
                {action !== 'idle' && !open && (
                    <div className="hope-action-badge">{actionEmoji[action] || '✨'}</div>
                )}
            </div>

            {/* ── Mobile chat FAB (fixed circular launcher, shown only on mobile) ── */}
            <button
                type="button"
                className={`chat-fab ${open ? 'open' : ''}`}
                onClick={toggleChat}
                aria-label={open ? 'Close chat' : 'Open chat with Hope'}
                aria-expanded={open}
            >
                {open ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2.5" x2="12" y2="6" />
                        <circle cx="12" cy="2.5" r="1.4" fill="currentColor" stroke="none" />
                        <rect x="4" y="6" width="16" height="13" rx="4.5" />
                        <circle cx="9" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                        <circle cx="15" cy="12.5" r="1.3" fill="currentColor" stroke="none" />
                        <line x1="8.5" y1="16.5" x2="15.5" y2="16.5" />
                    </svg>
                )}
            </button>

            {/* ── Chat window ── */}
            <div className={`chat-window ${open ? 'visible' : ''}`}>
                <div className="chat-header">
                    <span className="chat-header-title">
                        <span className="chat-header-robot">🤖</span> Hope
                    </span>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                send(input)
                            }
                        }}
                        placeholder="Ask anything..."
                        disabled={loading}
                    />
                    <button className="chat-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ── Lead modal ── */}
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
