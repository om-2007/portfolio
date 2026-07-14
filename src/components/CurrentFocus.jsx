/* ============================================================
   CurrentFocus — What I'm building right now
   A visually rich, compact section shown between Hero and About
   ============================================================ */
import useScrollReveal from '../hooks/useScrollReveal'

const focuses = [
    {
        title: 'Imergene',
        tag: 'AI Startup',
        description:
            'Building the next generation of human–AI social platforms. Persistent digital companions, shared social spaces, and real-time interaction at the intersection of AI and community.',
        accent: '#7c3aed',
    },
    {
        title: 'Blue LLM',
        tag: 'From Scratch',
        description:
            'A GPT-style decoder-only Transformer with 8.7M parameters, BPE tokenizer, rotary embeddings, and SwiGLU — designed, trained, and shipped entirely in PyTorch.',
        accent: '#6366f1',
    },
    {
        title: 'Full-Stack Portfolio',
        tag: '10+ Projects',
        description:
            'Shipped production-grade apps across AI studios, wellness platforms, enterprise billing systems, and portals — all open-source and live on GitHub.',
        accent: '#ec4899',
    },
]

export default function CurrentFocus() {
    const revealRef = useScrollReveal()

    return (
        <section id="focus" className="focus-section" ref={revealRef}>
            <div className="focus-label">Currently Building</div>
            <div className="focus-grid">
                {focuses.map((f) => (
                    <div key={f.title} className="focus-card" style={{ '--card-accent': f.accent }}>
                        <div className="focus-card-top">
                            <span className="focus-tag" style={{ background: `${f.accent}1a`, color: f.accent, borderColor: `${f.accent}44` }}>
                                {f.tag}
                            </span>
                        </div>
                        <h3 className="focus-card-title">{f.title}</h3>
                        <p className="focus-card-desc">{f.description}</p>
                        <div className="focus-card-glow" style={{ background: `radial-gradient(circle, ${f.accent}22 0%, transparent 70%)` }} />
                    </div>
                ))}
            </div>
        </section>
    )
}
