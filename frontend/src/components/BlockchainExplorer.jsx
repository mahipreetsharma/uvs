import React, { useState } from 'react';
import { Blocks, Link2, ShieldCheck, AlertOctagon, Hash, Clock, Key, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function BlockchainExplorer({ chain, isValid, onTamperSimulate, isSimulatedTamper }) {
  const [expandedBlock, setExpandedBlock] = useState(null);

  const toggleExpand = (index) => {
    setExpandedBlock(expandedBlock === index ? null : index);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Explorer Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Blocks size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Distributed Ledger Explorer</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            Real-time inspection of immutable blocks, cryptographic SHA-256 hashes, and Proof-of-Work nonces.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isSimulatedTamper ? (
            <button
              onClick={() => onTamperSimulate(false)}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Restore Authentic Ledger
            </button>
          ) : (
            <button
              onClick={() => onTamperSimulate(true)}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185' }}
              title="Test tamper detection mechanism"
            >
              <AlertOctagon size={15} />
              Simulate Block Tampering
            </button>
          )}
        </div>
      </div>

      {/* Warning banner if tampered */}
      {!isValid && (
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.2)',
          border: '1px solid #f43f5e',
          color: '#fecdd3',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertOctagon size={24} color="#f43f5e" />
          <div>
            <strong style={{ fontSize: '1rem', color: '#fff', display: 'block' }}>SECURITY BREACH DETECTED: Tampered Ledger Link</strong>
            Recalculated SHA-256 block hashes do not match the stored hashes or previous links. The entire subsequent chain is invalidated!
          </div>
        </div>
      )}

      {/* Blocks Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {chain.map((block, idx) => {
          const isGenesis = block.index === 0;
          const isExpanded = expandedBlock === block.index;
          const votesArray = Array.isArray(block.votes) ? block.votes : [];

          return (
            <div key={block.index || idx} style={{ position: 'relative' }}>
              {/* Linking connector line */}
              {idx > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '-12px auto 8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--accent-cyan)'
                }}>
                  <Link2 size={15} />
                </div>
              )}

              {/* Block Card */}
              <div
                className="glass-panel"
                style={{
                  padding: '20px 24px',
                  border: block.tampered ? '2px solid #f43f5e' : '1px solid var(--border)',
                  background: block.tampered ? 'rgba(244, 63, 94, 0.08)' : 'var(--bg-card)'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.825rem' }}>
                      {isGenesis ? 'Genesis Block #0' : `Block #${block.index}`}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {new Date(block.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="font-mono" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', color: 'var(--accent-purple)' }}>
                      Nonce: {block.nonce ?? 0}
                    </span>
                    <button
                      onClick={() => toggleExpand(block.index)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {isExpanded ? 'Hide Payload' : `Payload (${votesArray.length})`}
                    </button>
                  </div>
                </div>

                {/* Hashes section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  {/* Current Block Hash */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Hash size={12} color="var(--accent-emerald)" />
                      Block SHA-256 Hash
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.78rem', wordBreak: 'break-all', color: block.tampered ? '#fb7185' : '#34d399' }}>
                      {block.hash}
                    </div>
                  </div>

                  {/* Previous Block Hash */}
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Link2 size={12} color="var(--primary)" />
                      Previous Block Hash
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.78rem', wordBreak: 'break-all', color: 'var(--text-muted)' }}>
                      {block.previous_hash || '0 (Genesis Root)'}
                    </div>
                  </div>
                </div>

                {/* Expanded Transactions / Votes */}
                {isExpanded && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={13} />
                      Committed Ballots in Block
                    </h4>

                    {votesArray.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No records inside this block.</p>
                    ) : (
                      <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-sm)', padding: '10px', overflowX: 'auto' }}>
                        <pre className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-main)', margin: 0 }}>
                          {JSON.stringify(votesArray, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

