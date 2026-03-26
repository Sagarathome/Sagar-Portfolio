import React from 'react';

const skillGroups = [
  { title: 'Tech Stack', items: ['React.js', 'Next.js', 'Angular', 'Stencil', 'TypeScript', 'JavaScript', 'Redux', 'Zustand', 'React Query', 'Tailwind CSS', 'Material UI', 'Bootstrap'] },
  { title: 'Performance', items: ['Code Splitting', 'Lazy Loading', 'Caching Strategies', 'Lighthouse Optimization'] },
  { title: 'Tools', items: ['Git', 'GitHub', 'Vite', 'Webpack'] },
];

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
);

export default SkillsSection;
