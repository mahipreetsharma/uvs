import React, { useState } from 'react';
import { Vote, CheckCircle, AlertCircle, User, ShieldAlert, Sparkles } from 'lucide-react';

export default function VoterPortal({ candidates, onVoteSubmitted, votedIds }) {
  const [voterId, setVoterId] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Quick prefill helper for fast demo testing
  const sampleVoterIds = ['STU-2026-01', 'STU-2026-02', 'STU-2026-03', 'STU-2026-04'];

  const handleVote = async (e) => {
    e.preventDefault();
    if (!voterId.trim()) {
      setFeedback({ type: 'error', message: 'Please provide your Registered Voter ID.' });
      return;
    }
    if (!selectedCandidate) {
      setFeedback({ type: 'error', message: 'Please select a candidate to vote for.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const result = await onVoteSubmitted(voterId.trim(), selectedCandidate);
    setLoading(false);

    if (result.success) {
      setFeedback({
        type: 'success',
        message: `Success! Ballot for candidate ${selectedCandidate} has been cryptographically registered to the unmined pool for voter "${voterId}".`
      });
      setVoterId('');
      setSelectedCandidate('');
    } else {
      setFeedback({
        type: 'error',
        message: result.error || 'Vote submission failed. Check eligibility or server status.'
      });
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '10px', color: '#60a5fa' }}>
            <Vote size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>Official Ballot Box</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Cast your vote. Every ballot is SHA-256 authenticated and queued for tamper-proof blockchain mining.
            </p>
          </div>
        </div>

        {/* Voter ID Input Section */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            YOUR REGISTERED VOTER ID / STUDENT REGISTRATION NUMBER
          </label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="e.g. STU-2026-01"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
              />
            </div>
          </div>

          {/* Quick preset selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Demo Quick Select:</span>
            {sampleVoterIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setVoterId(id)}
                style={{
                  background: votedIds.has(id) ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: votedIds.has(id) ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border)',
                  color: votedIds.has(id) ? '#fb7185' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title={votedIds.has(id) ? 'Already voted' : 'Click to use'}
              >
                {id} {votedIds.has(id) && '(Voted)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: feedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
          color: feedback.type === 'success' ? '#34d399' : '#fb7185'
        }}>
          {feedback.type === 'success' ? <CheckCircle size={22} /> : <ShieldAlert size={22} />}
          <div style={{ fontSize: '0.925rem', fontWeight: 500 }}>
            {feedback.message}
          </div>
        </div>
      )}

      {/* Candidate Selection Cards */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} color="var(--accent-cyan)" />
        Select Your Candidate
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {candidates.map((cand) => {
          const isSelected = selectedCandidate === cand.id;
          return (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidate(cand.id)}
              className="glass-panel"
              style={{
                padding: '20px',
                cursor: 'pointer',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 24px rgba(59, 130, 246, 0.25)' : 'none',
                transform: isSelected ? 'scale(1.02)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{cand.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{cand.party}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5, minHeight: '50px' }}>
                "{cand.manifesto}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  ID: {cand.id}
                </span>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: isSelected ? '6px solid var(--primary)' : '2px solid var(--text-dim)',
                  background: '#fff',
                  transition: 'all 0.15s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <button
          onClick={handleVote}
          className="btn btn-primary"
          style={{ padding: '14px 40px', fontSize: '1rem', minWidth: '220px' }}
          disabled={loading || !selectedCandidate || !voterId.trim()}
        >
          {loading ? (
            'Submitting & Verifying...'
          ) : (
            <>
              <Vote size={18} />
              Confirm & Cast Secure Ballot
            </>
          )}
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>
          * Once verified, your vote cannot be altered or cast again.
        </p>
      </div>
    </div>
  );
}

