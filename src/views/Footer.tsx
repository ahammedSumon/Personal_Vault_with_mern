import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🛡️ Personal Safe Vault</h3>
          <p>Securely store and organize your most important data and documents.</p>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>📷 Photos</li>
            <li>📝 Notes</li>
            <li>🎙️ Voice Messages</li>
            <li>📄 Documents</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Security</h4>
          <ul>
            <li>Password Protected</li>
            <li>Personal Use Only</li>
            <li>Local Storage</li>
            <li>Privacy First</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Created with</h4>
          <p>MERN</p>
          <p>For practicing of backend development</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Personal Safe Vault. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
