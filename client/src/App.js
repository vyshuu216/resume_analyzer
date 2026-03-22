import React, { useState } from 'react';
import './App.css';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';

function App() {
  const [page, setPage] = useState('upload');
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setPage('results');
  };

  const handleViewHistory = (resume) => {
    setAnalysisResult(resume);
    setPage('results');
  };

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />
      <main className="main-content">
        {page === 'upload' && (
          <UploadPage onAnalysisComplete={handleAnalysisComplete} />
        )}
        {page === 'results' && (
          <ResultsPage
            result={analysisResult}
            onBack={() => setPage('upload')}
          />
        )}
        {page === 'history' && (
          <HistoryPage
            onViewResume={handleViewHistory}
          />
        )}
      </main>
    </div>
  );
}

export default App;
