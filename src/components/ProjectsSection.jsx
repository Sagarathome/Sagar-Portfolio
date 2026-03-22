import React from 'react'

const projects = [
  {
    title: 'Kalpit Kids (Educational Platform)',
    tag: 'optimization',
    description: 'Built a platform focused on children\'s learning and engagement',
    highlights: ['Developed interactive UI for better user experience', 'Clean and responsive design', 'User-friendly navigation for kids', 'Performance optimization', 'Focused on making the interface simple, engaging, and accessible']
  },
  {
    title: 'Dating App',
    tag: 'Production-Ready – In Progress',
    description: 'Building a full-stack dating application inspired by modern apps like Bumble/Hinge',
    techStack: { Frontend: 'React Native (Expo)', Backend: 'Node.js + Express', Database: 'MongoDB', Storage: 'Cloudinary' },
    features: ['OTP-based authentication', 'Profile creation with multiple images', 'Like / Match system', 'Nearby users (location-based)', 'Swipe interactions (gesture-based UI)'],
    focus: ['Real-world scalable architecture', 'Smooth mobile UI/UX', 'Performance']
  }
]

const ProjectsSection = () => (
  <div className="modal-section">
    <h2>Projects</h2>
    <div className="projects-list">
      {projects.map((project) => (
        <article key={project.title} className="project-card">
          <div className="project-header">
            <h3>{project.title}</h3>
            <span className="project-tag">🔹 {project.tag}</span>
          </div>
          <p className="project-description">{project.description}</p>
          {project.highlights && <ul>{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul>}
          {project.techStack && (
            <div className="project-tech">
              <h4>Tech Stack:</h4>
              <ul>{Object.entries(project.techStack).map(([k, v]) => <li key={k}><strong>{k}:</strong> {v}</li>)}</ul>
            </div>
          )}
          {project.features && <div className="project-features"><h4>Features:</h4><ul>{project.features.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          {project.focus && <div className="project-focus"><h4>Focus:</h4><ul>{project.focus.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        </article>
      ))}
    </div>
  </div>
)

export default ProjectsSection
