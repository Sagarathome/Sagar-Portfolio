import React from 'react';

const ExperienceSection = () => (
  <div className="modal-section experience">
    <h2>Experience</h2>
    <div className="experience-card">
      <h3>Frontend Developer</h3>
      <p className="experience-company">Jarvis Technology (Current)</p>
      <p className="experience-meta">Dec 2023 - Present</p>
      <ul>
        <li>Built an agnostic UI library compatible with Angular and React</li>
        <li>Scaled a React application to 10M+ users</li>
        <li>Achieved 99.9% uptime and load times under 2 seconds</li>
        <li>Reduced re-renders by 40% through Redux to Zustand migration</li>
        <li>Improved WCAG 2.1 accessibility, resulting in 32-50% higher user satisfaction</li>
        <li>Integrated CI/CD workflows for faster delivery and stable releases</li>
      </ul>
    </div>
    <div className="experience-card">
      <h3>Frontend Developer</h3>
      <p className="experience-company">Pizeonfly</p>
      <p className="experience-meta">Jan 2023 - Dec 2023</p>
      <ul>
        <li>Built reusable UI components, improving development speed by 40%</li>
        <li>Improved application performance by 25%</li>
        <li>Reduced bugs by 30% using TypeScript in core modules</li>
        <li>Optimized bundle size by 15% for faster load and runtime performance</li>
      </ul>
    </div>
  </div>
);

export default ExperienceSection;
