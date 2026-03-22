import React from 'react'

const contacts = [
  { icon: '📧', href: 'mailto:your-email@example.com', text: 'your-email@example.com' },
  { icon: '📱', href: 'tel:+91-XXXXXXXXXX', text: '+91-XXXXXXXXXX' },
  { icon: '💼', href: 'https://linkedin.com/in/your-profile', text: 'LinkedIn Profile', external: true },
  { icon: '💻', href: 'https://github.com/your-username', text: 'GitHub Profile', external: true }
]

const ContactSection = () => (
  <div className="modal-section">
    <h2>Contact</h2>
    <div className="contact-links">
      {contacts.map(({ icon, href, text, external }) => (
        <a key={text} href={href} className="contact-link" target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          <span className="contact-icon">{icon}</span>
          <span>{text}</span>
        </a>
      ))}
    </div>
  </div>
)

export default ContactSection
