import React from 'react';
import './ResultsPage.css';

const ScoreRing = ({ score }) => {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#b8ff57' : score >= 50 ? '#ffb547' : '#ff5f7e';

  return (
    <div className="score-ring-wrap">
      <svg className="score-svg" width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="score-inner">
        <span className="score-number" style={{ color }}>{score}</span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
};

const SectionCheck = ({ label, done }) => (
  <div className={`section-check ${done ? 'done' : 'miss'}`}>
    <span className="check-icon">{done ? '✓' : '✗'}</span>
    <span>{label}</span>
  </div>
);

export default function ResultsPage({ result, onBack }) {
  if (!result) return null;
  const { analysis, fileName, createdAt } = result;

  if (!analysis) {
    return (
      <div className="page results-page">
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚠</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-secondary)' }}>Analysis data not found</p>
          <p style={{ marginTop: '8px', fontSize: '14px' }}>Please go back and upload your resume again.</p>
          <button className="btn btn-ghost" style={{ marginTop: '24px' }} onClick={onBack}>← Back</button>
        </div>
      </div>
    );
  }

  const { score, summary, strengths, weaknesses, suggestions, keywords, sections } = analysis;

  const scoreLabel = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
  const scoreClass = score >= 75 ? 'label-green' : score >= 50 ? 'label-amber' : 'label-red';

  const sectionItems = [
    { label: 'Contact Info', key: 'hasContact' },
    { label: 'Summary / Objective', key: 'hasSummary' },
    { label: 'Work Experience', key: 'hasExperience' },
    { label: 'Education', key: 'hasEducation' },
    { label: 'Skills', key: 'hasSkills' },
    { label: 'Projects', key: 'hasProjects' },
  ];

  return (
    <div className="page results-page">
      {/* Header */}
      <div className="results-header fade-up">
        <button className="btn btn-ghost back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="results-meta">
          <span className="results-filename">{fileName}</span>
          <span className="results-date">{new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Score hero */}
      <div className="score-hero card fade-up-1">
        <div className="score-left">
          <ScoreRing score={score} />
          <div>
            <div className={`score-badge ${scoreClass}`}>{scoreLabel}</div>
            <h2 className="score-title">Resume Score</h2>
          </div>
        </div>
        <p className="score-summary">{summary}</p>
      </div>

      {/* Main grid */}
      <div className="results-grid fade-up-2">
        {/* Strengths */}
        <div className="card">
          <p className="section-label">✓ Strengths</p>
          <ul className="insight-list">
            {(strengths || []).map((s, i) => (
              <li key={i} className="insight-item insight-green">
                <span className="insight-bullet">◉</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="card">
          <p className="section-label">⚠ Weaknesses</p>
          <ul className="insight-list">
            {(weaknesses || []).map((w, i) => (
              <li key={i} className="insight-item insight-red">
                <span className="insight-bullet">◎</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card suggestions-card fade-up-3">
        <p className="section-label">◈ AI Suggestions</p>
        <div className="suggestions-grid">
          {(suggestions || []).map((s, i) => (
            <div className="suggestion-item" key={i}>
              <span className="suggestion-num">{String(i + 1).padStart(2, '0')}</span>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords + Sections */}
      <div className="results-grid fade-up-4">
        {/* Keywords */}
        <div className="card">
          <p className="section-label">Keywords Found</p>
          <div className="tags-wrap">
            {(keywords?.found || []).map((k, i) => (
              <span key={i} className="badge badge-green">{k}</span>
            ))}
          </div>
          {(keywords?.missing || []).length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: '20px' }}>Missing Keywords</p>
              <div className="tags-wrap">
                {(keywords.missing || []).map((k, i) => (
                  <span key={i} className="badge badge-red">{k}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sections checklist */}
        <div className="card">
          <p className="section-label">Section Checklist</p>
          <div className="sections-list">
            {sectionItems.map((item) => (
              <SectionCheck key={item.key} label={item.label} done={sections?.[item.key]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
