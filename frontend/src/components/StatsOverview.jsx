import React from 'react';
import { Blocks, ShieldCheck, CheckCircle2, AlertOctagon, Hash, Layers } from 'lucide-react';

export default function StatsOverview({ chain, isValid, unminedCount }) {
  const totalBlocks = chain?.length || 0;
  
  // Calculate verified votes committed across all blocks
  const committedVotesCount = chain?.reduce((acc, block) => {
    if (Array.isArray(block.votes)) {
      // Exclude genesis block message {"info": ...}
      const realVotes = block.votes.filter(v => v.voter_id);
      return acc + realVotes.length;
    }
    return acc;
  }, 0) || 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      margin: '24px 0'
    }}>
      {/* Total Blocks */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(59, 130, 246, 0.12)',
          color: '#60a5fa'
        }}>
          <Blocks size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Chain Height
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {totalBlocks} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>blocks</span>
          </h3>
        </div>
      </div>

      {/* Committed Votes */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#34d399'
        }}>
          <CheckCircle2 size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Mined Ballots
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {committedVotesCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>immutable</span>
          </h3>
        </div>
      </div>

      {/* Unmined Pool */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#fbbf24'
        }}>
          <Layers size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pending Mempool
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            {unminedCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>unmined</span>
          </h3>
        </div>
      </div>

      {/* PoW Difficulty */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(139, 92, 246, 0.12)',
          color: '#a78bfa'
        }}>
          <Hash size={26} />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Mining Difficulty
          </span>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
            Diff 3 <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>(000...)</span>
          </h3>
        </div>
      </div>

      {/* Chain Integrity */}
      <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: isValid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          color: isValid ? '#34d399' : '#fb7185'
        }}>
          {isValid ? <ShieldCheck size={26} /> : <AlertOctagon size={26} />}
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Ledger Integrity
          </span>
          <div style={{ marginTop: '2px' }}>
            {isValid ? (
              <span className="badge badge-success">Cryptographically Valid</span>
            ) : (
              <span className="badge badge-danger">Tampering Detected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

