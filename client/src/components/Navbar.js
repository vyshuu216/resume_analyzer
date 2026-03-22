import React from 'react';
import './Navbar.css';

export default function Navbar({ page, setPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo" onClick={() => setPage('upload')}>
          <span className="logo-icon">◈</span>
          <span className="logo-text">Resume<span className="logo-accent">AI</span></span>
        </div>
        <div className="navbar-links">
          <button
            className={`nav-link ${page === 'upload' ? 'active' : ''}`}
            onClick={() => setPage('upload')}
          >
            Analyse
          </button>
          <button
            className={`nav-link ${page === 'history' ? 'active' : ''}`}
            onClick={() => setPage('history')}
          >
            History
          </button>
        </div>
        <div className="navbar-badge">
          <span className="pulse-dot" />
          AI Powered
        </div>
      </div>
    </nav>
  );
}
