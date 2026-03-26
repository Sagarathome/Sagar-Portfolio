import React from 'react';

const projects = [
  {
    title: 'Kalpit Kids Website',
    tag: 'React.js | Bootstrap',
    description: 'Built a fully responsive educational website with accessibility-focused UI and a clean UX for parents and students.',
    highlights: ['Fully responsive design', 'Accessibility-focused UI', 'Clean UX for parents and students'],
  },
  {
    title: 'Dating App',
    featured: true,
    tag: 'In Progress | React Native, Node.js, MongoDB',
    description: 'A modern dating platform inspired by Bumble and Hinge, focused on smooth matching and real-time interaction.',
    features: ['Swipe-based matching system', 'Real-time chat using sockets', 'Modern, intuitive mobile-first UI'],
  },
];

const ProjectsSection = () => (
  <div className="modal-section projects">
    <h2>Projects</h2>
    <div className="projects-list">
      {projects.map((project) => (
        <article key={project.title} className={`project-card ${project.featured ? 'project-card-featured' : ''}`}>
          <div className="project-header">
            <h3>{project.title}</h3>
            <span className="project-tag">{project.featured ? '⭐ ' : '🔹 '}{project.tag}</span>
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
        </article>
      ))}
    </div>
  </div>
);

export default ProjectsSection;
