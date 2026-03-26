import React from 'react';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import ContactSection from './sections/ContactSection';
import ProjectsSection from './sections/ProjectsSection';
import './Modal.css';

const SECTION_COMPONENTS = {
  about: AboutSection,
  experience: ExperienceSection,
  contact: ContactSection,
  projects: ProjectsSection,
};

function Modal({ buildingModal, onClose }) {
  if (!buildingModal) return null;

  const SectionComponent = SECTION_COMPONENTS[buildingModal.id];

  return (
    <div
      className="building-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="building-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="building-modal-content">
          {SectionComponent ? (
            <SectionComponent />
          ) : (
            <>
              <h2 className="building-modal-title">{buildingModal.title}</h2>
              <p className="building-modal-body">{buildingModal.body}</p>
            </>
          )}
        </div>
        <button type="button" className="building-modal-close" onClick={onClose}>
          CLOSE
        </button>
        <p className="building-modal-hint">Press Escape to close</p>
      </div>
    </div>
  );
}

export default Modal;
