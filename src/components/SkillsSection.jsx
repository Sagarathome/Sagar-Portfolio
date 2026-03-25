import React from 'react'

const skillGroups = [
  { title: '🚀 Frontend', items: ['React.js', 'Next.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5, CSS3', 'Tailwind CSS, Bootstrap'] },
  { title: '🧠 State Management', items: ['Redux', 'Zustand', 'React Query'] },
  { title: '⚙️ Tools & Technologies', items: ['Git & GitHub', 'Docker (Basics)', 'REST APIs', 'Postman'] },
  { title: '🧩 Other Skills', items: ['UI/UX Development', 'Performance Optimization', 'Component Architecture', 'Debugging & Problem Solving'] }
]

const SkillsSection = () => (
  <div className="modal-section skills">
    <h2>Skills</h2>
    <div className="skills-grid">
      {skillGroups.map((group) => (
        <div key={group.title} className="skill-group">
          <h3>{group.title}</h3>
          <div className="skill-tags">
            {group.items.map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default SkillsSection
