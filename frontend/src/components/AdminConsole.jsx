import React, { useState } from 'react';
import { Cpu, Pickaxe, CheckCircle2, AlertCircle, Plus, Users, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminConsole({ unminedVotes, onTriggerMine, onAddCandidate, candidates }) {
  const [mining, setMining] = useState(false);
  const [miningResult, setMiningResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form state for adding candidate
  const [candName, setCandName] = useState('');
  const [candParty, setCandParty] = useState('');
  const [candManifesto, setCandManifesto] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleMine = async () => {
    if (!unminedVotes || unminedVotes.length === 0) {
      setErrorMsg('No unmined votes present in the pool. Voters must submit ballots first.');
      return;
    }

    setMining(true);
    setErrorMsg(null);
    setMiningResult(null);

    // Simulate short computation visual delay for Proof of Work experience
    const res = await onTriggerMine();
    setMining(false);

    if (res.success) {
      setMiningResult(res.data);
    } else {
      setErrorMsg(res.error || 'Mining failed. Check server connection.');
    }
  };

  const handleNewCandidate = (e) => {
    e.preventDefault();
    if (!candName.trim() || !candParty.trim()) return;

    onAddCandidate({
      id: `cand-${Date.now().toString().slice(-4)}`,
      name: candName.trim(),
      party: candParty.trim(),
      role: 'Candidate',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=200&h=200&fit=crop&crop=faces`,
      manifesto: candManifesto.trim() || 'Committed to campus excellence and innovation.'
    });

    setCandName('');
    setCandParty('');
    setCandManifesto('');
    setShowAddForm(false);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Mining Dashboard */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '12px', color: '#a78bfa' }}>
              <Pickaxe size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Proof of Work Mining Station</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Bundle pending ballots into a cryptographic block satisfying difficulty target <code>000...</code>
              </p>
            </div>
          </div>

          <button
            onClick={handleMine}
            className="btn btn-accent"
            disabled={mining || unminedVotes.length === 0}
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            {mining ? (
              <>
                <Cpu size={18} className="pulse-indicator" />
                Mining Block (Solving PoW)...
              </>
            ) : (
              <>
                <Pickaxe size={18} />
                Forge & Mine Block ({unminedVotes.length} Pending)
              </>
            )}
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {miningResult && (
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <CheckCircle2 size={20} />
              <strong style={{ fontSize: '0.95rem' }}>{miningResult.message}</strong>
            </div>
            {miningResult.block && (
              <div className="font-mono" style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
                Block Index: #{miningResult.block.index} | SHA-256 Hash: {miningResult.block.hash}
              </div>
            )}
          </div>
        )}

        {/* Unmined Votes Mempool Table */}
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
          Current Ballot Mempool ({unminedVotes.length} awaiting ledger confirmation)
        </h3>

        {unminedVotes.length === 0 ? (
          <div style={{
            padding: '32px',
            textAlign: 'center',
            border: '1px dashed var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-dim)',
            fontSize: '0.9rem'
          }}>
            Pool is clean. Cast new votes in the Voter Portal to queue them for mining.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '10px 12px' }}>VOTER ID</th>
                  <th style={{ padding: '10px 12px' }}>CANDIDATE CHOSEN</th>
                  <th style={{ padding: '10px 12px' }}>SUBMISSION TIME</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {unminedVotes.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="font-mono" style={{ padding: '10px 12px', color: '#fff' }}>{v.voter_id}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)' }}>{v.candidate_id}</td>
                    <td className="font-mono" style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                      {new Date((v.timestamp || Date.now() / 1000) * 1000).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-warning">Unmined Mempool</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Management Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>Official Candidate Roster</h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <Plus size={14} />
            {showAddForm ? 'Cancel' : 'Register Candidate'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleNewCandidate} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Candidate Name"
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Party / Affiliation</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Party Name"
                  value={candParty}
                  onChange={(e) => setCandParty(e.target.value)}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Manifesto / Key Points</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Brief vision and objectives..."
                value={candManifesto}
                onChange={(e) => setCandManifesto(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Save & Publish Candidate
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {candidates.map((cand) => (
            <div key={cand.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <img src={cand.avatar} alt={cand.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{cand.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{cand.party}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

