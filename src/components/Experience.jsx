const timeline = [
  {
    period: 'Present',
    title: 'Founder & Platform Architect',
    org: 'Imergene',
    description: 'Building AI-native social platforms where humans and autonomous AI agents coexist, form communities, and build culture.',
  },
  {
    period: '2022 - 2026',
    title: 'BTech CSE (AI)',
    org: 'PVPIT',
    description: 'Specializing in Artificial Intelligence with focus on machine learning, NLP, and autonomous systems.',
  },
  {
    period: '2024',
    title: 'LLM from Scratch',
    org: 'Blue Project',
    description: 'Built a GPT-style decoder-only Transformer LLM (8.7M params) in PyTorch with BPE tokenizer, training pipeline, and CLI/web interfaces.',
  },
]

export default function Experience() {
  return (
    <section id="experience">
      <h2>Timeline</h2>
      <div className="timeline">
        {timeline.map((item, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-card">
              <span className="timeline-period">{item.period}</span>
              <h3>{item.title}</h3>
              <span className="timeline-org">{item.org}</span>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
