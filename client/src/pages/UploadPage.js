import React, { useState, useRef } from 'react';
import axios from 'axios';
import './UploadPage.css';

export default function UploadPage({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 85));
    }, 400);

    try {
      const res = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => onAnalysisComplete(res.data.resume), 400);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setLoading(false);
      setProgress(0);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="page upload-page">
      {/* Hero */}
      <div className="hero fade-up">
        <div className="hero-tag">◈ AI Resume Analyser</div>
        <h1 className="hero-title">
          Get your resume<br />
          <span className="hero-accent">score & insights</span>
        </h1>
        <p className="hero-sub">
          Upload your PDF resume and get instant AI-powered feedback — score, strengths, gaps, and actionable suggestions.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="upload-zone-wrap fade-up-1">
        <div
          className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onClick={() => !file && fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {!file ? (
            <div className="upload-empty">
              <div className="upload-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="upload-main">Drop your resume here</p>
              <p className="upload-sub">or <span>click to browse</span> · PDF only · Max 5MB</p>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="file-info">
                <p className="file-name">{file.name}</p>
                <p className="file-size">{formatSize(file.size)}</p>
              </div>
              <button
                className="file-remove"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
              >✕</button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-msg">
            <span>⚠</span> {error}
          </div>
        )}

        {loading && (
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-label">
              {progress < 50 ? 'Extracting text...' : progress < 85 ? 'Running AI analysis...' : 'Finalising results...'}
            </p>
          </div>
        )}

        <button
          className="btn btn-primary analyse-btn"
          onClick={handleSubmit}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <span className="spinner" /> Analysing...
            </>
          ) : (
            <>
              <span>◈</span> Analyse Resume
            </>
          )}
        </button>
      </div>

      {/* Features */}
      <div className="features fade-up-2">
        {[
          { icon: '◎', label: 'Resume Score', desc: 'Get a 0–100 quality score based on content, structure, and keywords.' },
          { icon: '◉', label: 'Keyword Analysis', desc: 'Discover which industry keywords your resume includes and misses.' },
          { icon: '◈', label: 'AI Suggestions', desc: 'Receive specific, actionable tips to improve your resume immediately.' },
          { icon: '○', label: 'Gap Detection', desc: 'Find missing sections that recruiters and ATS systems expect to see.' },
        ].map((f) => (
          <div className="feature-card card" key={f.label}>
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.label}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
