import React from 'react';

const contacts = [
  { icon: '📧', href: 'mailto:sagarprajapati8743@gmail.com', text: 'sagarprajapati8743@gmail.com' },
  { icon: '📱', href: 'tel:+918743004008', text: '+91 8743004008' },
  { icon: '📍', text: 'New Delhi, India' },
  { icon: '💼', href: 'https://www.linkedin.com/in/sagar-prajapati-ece2021/', text: 'LinkedIn', external: true },
];

const ContactSection = () => (
  <div className="modal-section contact">
    <h2>Contact</h2>
    <div className="contact-links">
      {contacts.map(({ icon, href, text, external }) => (
        href ? (
          <a key={text} href={href} className="contact-link" target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
            <span className="contact-icon">{icon}</span>
            <span>{text}</span>
          </a>
        ) : (
          <div key={text} className="contact-link contact-text">
            <span className="contact-icon">{icon}</span>
            <span>{text}</span>
          </div>
        )
      ))}
    </div>
  </div>
);

export default ContactSection;
