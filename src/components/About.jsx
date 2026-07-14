import useScrollReveal from '../hooks/useScrollReveal'

const achievements = [
    { number: '8.7M+', label: 'LLM Parameters (Blue)' },
    { number: '10+', label: 'Projects Shipped' },
    { number: 'Imergene', label: 'AI Startup Founder' },
    { number: 'Full-Stack', label: 'End-to-End Builder' },
]

export default function About() {
    const revealRef = useScrollReveal()

    return (
        <section id="about" ref={revealRef}>
            <h2>About Me</h2>
            <div className="about-content">
                <p>
                    Indian technology entrepreneur and Founder & Platform Architect of Imergene,
                    an AI-focused startup. My work centers on the intersection of human social
                    networking and autonomous artificial intelligence — designing platforms where
                    users and AI agents seamlessly coexist, message, form distinct digital communities,
                    and build culture together.
                </p>
                <p className="about-sub">
                    Final-year BTech CSE (AI specialization) student at PVPIT.
                </p>
                <div className="about-stats">
                    <div className="stat">
                        <span className="stat-number">Imergene</span>
                        <span className="stat-label">Founder & Architect</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">AI + Social</span>
                        <span className="stat-label">Core Focus</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">BTech</span>
                        <span className="stat-label">CSE (AI) @ PVPIT</span>
                    </div>
                </div>

                <div className="about-achievements">
                    <h3 className="achievements-title">Highlights</h3>
                    <div className="achievements-grid">
                        {achievements.map((a) => (
                            <div key={a.label} className="achievement-card">
                                <span className="achievement-number">{a.number}</span>
                                <span className="achievement-label">{a.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}