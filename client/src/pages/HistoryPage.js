import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoryPage.css';

export default function HistoryPage({ onViewResume }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResumes = async () => {
    try {
      const res = await axios.get('/api/resume');
      setResumes(res.data);
    } catch {
      setError('Could not load history. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  const scoreColor = (s) => s >= 75 ? 'var(--accent)' : s >= 50 ? 'var(--amber)' : 'var(--rose)';

  return (
    <div className="page history-page">
      <div className="history-header fade-up">
        <div>
          <h1 className="history-title">Analysis History</h1>
          <p className="history-sub">Your previously analysed resumes</p>
        </div>
      </div>

      {loading && (
        <div className="history-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card card" />
          ))}
        </div>
      )}

      {error && (
        <div className="history-error card">
          <p>⚠ {error}</p>
        </div>
      )}

      {!loading && !error && resumes.length === 0 && (
        <div className="history-empty card fade-up-1">
          <div className="empty-icon">◎</div>
          <p className="empty-title">No analyses yet</p>
          <p className="empty-sub">Upload a resume to get started.</p>
        </div>
      )}

      {!loading && resumes.length > 0 && (
        <div className="history-list fade-up-1">
          {resumes.map((r, i) => (
            <div
              key={r._id}
              className="history-card card"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => onViewResume(r)}
            >
              <div className="hcard-left">
                <div className="hcard-file-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="hcard-name">{r.fileName}</p>
                  <p className="hcard-date">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="hcard-right">
                <div className="hcard-score" style={{ color: scoreColor(r.analysis?.score) }}>
                  <span className="hcard-score-num">{r.analysis?.score}</span>
                  <span className="hcard-score-label">/100</span>
                </div>
                <button
                  className="btn btn-danger hcard-del"
                  onClick={(e) => handleDelete(r._id, e)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
