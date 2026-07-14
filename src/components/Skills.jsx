const skills = [
    { name: 'TypeScript', level: 88 },
    { name: 'Python', level: 85 },
    { name: 'React / Next.js', level: 90 },
    { name: 'Node.js', level: 80 },
    { name: 'PyTorch', level: 75 },
    { name: 'Git', level: 85 },
    { name: 'Tailwind CSS', level: 88 },
    { name: 'Databases', level: 70 },
]

import useScrollReveal from '../hooks/useScrollReveal'

export default function Skills() {
    const revealRef = useScrollReveal()
    return (
        <section id="skills" ref={revealRef}>
            <h2>Skills & Technologies</h2>
            <div className="skills-grid">
                {skills.map((skill) => (
                    <div key={skill.name} className="skill-card">
                        <div className="skill-info">
                            <span className="skill-name">{skill.name}</span>
                            <span className="skill-percent">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                            <div
                                className="skill-fill"
                                style={{ width: `${skill.level}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
