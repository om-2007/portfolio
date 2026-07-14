/* ============================================================
   ResumeContent — Premium, modern, beautifully styled resume
   Optimized for PDF capture via html2pdf.js at 2.5× scale
   Clean typography, accent hierarchy, subtle design touches
   ============================================================ */
import { forwardRef } from 'react'

const ResumeContent = forwardRef(function ResumeContent(_props, ref) {
    return (
        <div ref={ref} className="resume-pdf">
            {/* ── TOP ACCENT BAR ── */}
            <div className="resume-accent-bar" />

            {/* ── HEADER ── */}
            <header className="resume-header">
                <div className="resume-header-left">
                    <h1 className="resume-name">Om Karande</h1>
                    <p className="resume-title-line">Technology Entrepreneur &amp; AI-Native Platform Builder</p>
                    <div className="resume-contact-row">
                        <span className="resume-contact-item">
                            <span className="resume-contact-icon">✉</span>
                            omnileshkarande@gmail.com
                        </span>
                        <span className="resume-contact-sep">•</span>
                        <span className="resume-contact-item">
                            <span className="resume-contact-icon">🔗</span>
                            github.com/om-2007
                        </span>
                        <span className="resume-contact-sep">•</span>
                        <span className="resume-contact-item">
                            <span className="resume-contact-icon">🔗</span>
                            linkedin.com/in/om-karande
                        </span>
                        <span className="resume-contact-sep">•</span>
                        <span className="resume-contact-item">
                            <span className="resume-contact-icon">📍</span>
                            Pune, India
                        </span>
                    </div>
                </div>
                <div className="resume-header-right">
                    <div className="resume-initials">OK</div>
                </div>
            </header>

            {/* ── COMPACT METRICS ROW ── */}
            <div className="resume-metrics-row">
                <div className="resume-metric-item">
                    <span className="resume-metric-num">BTech CSE (AI)</span>
                    <span className="resume-metric-label">Final Year • PVPIT</span>
                </div>
                <div className="resume-metric-div" />
                <div className="resume-metric-item">
                    <span className="resume-metric-num">10+</span>
                    <span className="resume-metric-label">Shipped Projects</span>
                </div>
                <div className="resume-metric-div" />
                <div className="resume-metric-item">
                    <span className="resume-metric-num">Founder</span>
                    <span className="resume-metric-label">Imergene Startup</span>
                </div>
                <div className="resume-metric-div" />
                <div className="resume-metric-item">
                    <span className="resume-metric-num">8.7M</span>
                    <span className="resume-metric-label">LLM Parameters</span>
                </div>
            </div>

            {/* ── PROFESSIONAL SUMMARY ── */}
            <section className="resume-section">
                <h2 className="resume-section-title">
                    <span className="resume-section-icon">◆</span> Professional Summary
                </h2>
                <p className="resume-text">
                    Technology entrepreneur and final-year BTech CSE (AI) student with a fierce passion for
                    building AI-native platforms. Founder &amp; Platform Architect of <strong>Imergene</strong>,
                    an early-stage startup creating the next generation of human–AI social platforms. Self-taught
                    builder who designed and trained a GPT-style decoder-only Transformer LLM (<strong>8.7M parameters</strong>)
                    entirely from scratch using PyTorch — one of very few undergraduate students worldwide to do so.
                    Proven full-stack developer with <strong>10+ shipped projects</strong> spanning LLMs, AI studios,
                    wellness platforms, and enterprise billing systems. Deep expertise across the full AI stack:
                    from data preprocessing and model training to deployment and polished web UX.
                </p>
            </section>

            {/* ── KEY SKILLS — Compact Bar Chart ── */}
            <section className="resume-section">
                <h2 className="resume-section-title">
                    <span className="resume-section-icon">◆</span> Technical Skills
                </h2>
                <div className="resume-skills-grid">
                    {[
                        { name: 'React / Next.js', level: 92 },
                        { name: 'TypeScript / JavaScript', level: 90 },
                        { name: 'Python (PyTorch, Flask)', level: 85 },
                        { name: 'Node.js / Express', level: 82 },
                        { name: 'Tailwind CSS / Styling', level: 90 },
                        { name: 'Git & CI/CD Pipelines', level: 85 },
                        { name: 'LLM Architecture & Training', level: 78 },
                        { name: 'Databases (SQL, MongoDB)', level: 72 },
                    ].map((s) => (
                        <div key={s.name} className="resume-skill-item">
                            <div className="resume-skill-name">{s.name}</div>
                            <div className="resume-skill-bar-bg">
                                <div className="resume-skill-bar-fill" style={{ width: `${s.level}%` }} />
                            </div>
                            <span className="resume-skill-pct">{s.level}%</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── EXPERIENCE ── */}
            <section className="resume-section">
                <h2 className="resume-section-title">
                    <span className="resume-section-icon">◆</span> Experience
                </h2>

                <div className="resume-exp-block">
                    <div className="resume-exp-head">
                        <div>
                            <h3 className="resume-exp-role">Founder &amp; Platform Architect</h3>
                            <p className="resume-exp-org">Imergene — AI-Native Social Platform Startup</p>
                        </div>
                        <span className="resume-exp-date">Jan 2025 – Present</span>
                    </div>
                    <ul className="resume-exp-duties">
                        <li>Architecting an AI-native social platform that reimagines human–AI interaction through persistent digital companions and shared social spaces.</li>
                        <li>Leading product strategy, system design, full-stack development (Next.js + TypeScript), and AI integration roadmap.</li>
                        <li>Building a responsive, multi-language front end deployed on Vercel with real-time capabilities.</li>
                    </ul>
                </div>

                <div className="resume-exp-block">
                    <div className="resume-exp-head">
                        <div>
                            <h3 className="resume-exp-role">Independent AI Researcher &amp; Builder</h3>
                            <p className="resume-exp-org">Self-directed — Open Source</p>
                        </div>
                        <span className="resume-exp-date">2024</span>
                    </div>
                    <ul className="resume-exp-duties">
                        <li>Designed and trained <strong>Blue</strong> — a GPT-style decoder-only Transformer LLM with 8.7M parameters, multi-head self-attention (8 heads), rotary positional encoding, SwiGLU activations, and a BPE tokenizer — all built from scratch in PyTorch.</li>
                        <li>Developed <strong>Blue-Studio</strong>, an AI playground with real-time streaming, conversation branching, and Markdown rendering powered by the Groq API (Next.js).</li>
                        <li>Open-sourced both projects on GitHub with comprehensive documentation and architecture diagrams.</li>
                    </ul>
                </div>
            </section>

            {/* ── SELECTED PROJECTS ── */}
            <section className="resume-section">
                <h2 className="resume-section-title">
                    <span className="resume-section-icon">◆</span> Selected Projects
                </h2>

                {[
                    {
                        name: 'Blue LLM',
                        desc: 'Decoder-only Transformer (8.7M params) with BPE tokenizer, RoPE, SwiGLU, and custom training pipeline. Flask web UI. Built from scratch.',
                        tags: ['PyTorch', 'Python', 'Transformer'],
                    },
                    {
                        name: 'Blue-Studio',
                        desc: 'AI studio with real-time streaming, conversation management, and Markdown rendering. Built with Next.js and Groq API.',
                        tags: ['Next.js', 'TypeScript', 'AI'],
                    },
                    {
                        name: 'Anandmay Yogshala',
                        desc: 'Full-featured yoga wellness and career platform with interactive scheduling and responsive design. Deployed on Vercel.',
                        tags: ['Next.js', 'TypeScript', 'Full-Stack'],
                    },
                    {
                        name: 'Shree Stone Crusher',
                        desc: 'Enterprise billing and inventory management with invoice generation, client management, and payment tracking. Mobile-first UI.',
                        tags: ['Next.js', 'Billing', 'Full-Stack'],
                    },
                    {
                        name: 'Blue Portal',
                        desc: 'Full-stack portal with authentication, CRUD operations, and role-based access control.',
                        tags: ['Next.js', 'Auth', 'Full-Stack'],
                    },
                ].map((p) => (
                    <div key={p.name} className="resume-project-line">
                        <span className="resume-project-name">{p.name}</span>
                        <span className="resume-project-sep">—</span>
                        <span className="resume-project-desc">{p.desc}</span>
                        <span className="resume-project-tags">
                            {p.tags.map((t, i) => (
                                <span key={t} className="resume-project-tag">
                                    {t}{i < p.tags.length - 1 ? ' ' : ''}
                                </span>
                            ))}
                        </span>
                    </div>
                ))}
            </section>

            {/* ── EDUCATION ── */}
            <section className="resume-section">
                <h2 className="resume-section-title">
                    <span className="resume-section-icon">◆</span> Education
                </h2>
                <div className="resume-exp-block">
                    <div className="resume-exp-head">
                        <div>
                            <h3 className="resume-exp-role">BTech in Computer Science &amp; Engineering (AI)</h3>
                            <p className="resume-exp-org">PVPIT — Savitribai Phule Pune University</p>
                        </div>
                        <span className="resume-exp-date">2022 – 2026</span>
                    </div>
                    <ul className="resume-exp-duties">
                        <li>Final-year undergraduate specializing in Artificial Intelligence. GPA: 8.5+ (First Class with Distinction).</li>
                        <li>Relevant coursework: Deep Learning, NLP, Data Structures &amp; Algorithms, Software Engineering, Discrete Mathematics.</li>
                        <li>Self-directed research in LLM architecture, transformer internals, attention mechanisms, and AI alignment.</li>
                    </ul>
                </div>
            </section>

            {/* ── ACHIEVEMENTS ── */}
            <section className="resume-section">
                <h2 className="resume-section-title">
                    <span className="resume-section-icon">◆</span> Achievements &amp; Recognition
                </h2>
                <ul className="resume-achievements-list">
                    <li>Built and trained a production-grade GPT-style LLM (8.7M parameters) from scratch — one of very few undergraduate students worldwide to accomplish this.</li>
                    <li>Founded <strong>Imergene</strong>, an AI startup building the next generation of human–AI social platforms, currently in active development.</li>
                    <li>10+ open-source projects shipped, documented, and live on GitHub with active maintenance.</li>
                    <li>Deep expertise spanning the entire AI stack: from data preprocessing and tokenizer training → model architecture → training → deployment → web UX.</li>
                    <li>Self-taught engineer with proven ability to rapidly master new technologies and ship production-quality code independently.</li>
                </ul>
            </section>

            {/* ── FOOTER ── */}
            <footer className="resume-footer">
                <div className="resume-footer-line" />
                <p className="resume-footer-text">Om Karande · omnileshkarande@gmail.com · github.com/om-2007</p>
                <p className="resume-footer-sub">Follow on <strong>X: @Imergene148310</strong> · github.com/om-2007</p>
            </footer>
        </div>
    )
})

export default ResumeContent
