import React from 'react';
import { Award, BarChart3, CheckCircle2, ShieldCheck, Users, Vote } from 'lucide-react';

export default function ResultsView({ chain, candidates }) {
  // Aggregate vote count directly from the immutable blocks
  const tally = {};
  candidates.forEach(c => { tally[c.id] = 0; });

  let totalVotes = 0;

  chain?.forEach(block => {
    if (Array.isArray(block.votes)) {
      block.votes.forEach(vote => {
        if (vote.candidate_id && tally[vote.candidate_id] !== undefined) {
          tally[vote.candidate_id] += 1;
          totalVotes += 1;
        }
      });
    }
  });

  // Sort candidates by votes descending
  const sortedCandidates = [...candidates].sort((a, b) => (tally[b.id] || 0) - (tally[a.id] || 0));
  const leadingCandidate = sortedCandidates[0];
  const hasVotes = totalVotes > 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Overview Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: '#34d399' }}>
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Official Election Results & Audit</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                All counts computed directly by auditing the validated blockchain blocks.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Certified Ballots</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{totalVotes}</div>
          </div>
        </div>

        {/* Winner Banner if votes present */}
        {hasVotes && (
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={leadingCandidate.avatar}
                alt={leadingCandidate.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }}
              />
              <div>
                <span className="badge badge-success" style={{ marginBottom: '4px' }}>
                  <Award size={12} /> Current Projected Winner
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{leadingCandidate.name}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>{leadingCandidate.party}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa' }}>
                {tally[leadingCandidate.id] || 0} votes
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {totalVotes > 0 ? ((tally[leadingCandidate.id] / totalVotes) * 100).toFixed(1) : 0}% of total vote
              </span>
            </div>
          </div>
        )}

        {/* Candidate Tally Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {sortedCandidates.map((cand, idx) => {
            const count = tally[cand.id] || 0;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

            return (
              <div key={cand.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', width: '20px' }}>
                      #{idx + 1}
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{cand.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({cand.party})</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{count} votes </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>({percentage}%)</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: idx === 0 ? 'linear-gradient(90deg, #3b82f6, #06b6d4)' : 'linear-gradient(90deg, #8b5cf6, #ec4899)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease-out'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cryptographic Audit Certificate Footer */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <ShieldCheck size={32} color="#10b981" />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>SHA-256 Ledger Audit Certification</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Every individual ballot counted above corresponds to a verified transaction sealed within an immutable, Proof-of-Work mined block.
          </p>
        </div>
      </div>
    </div>
  );
}

