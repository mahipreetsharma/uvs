import React from 'react';
import { ShieldCheck, Vote, Cpu, Blocks, BarChart3, RefreshCw, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onRefresh, isRefreshing, backendLive, chainValid }) {
  const tabs = [
    { id: 'vote', label: 'Voter Portal', icon: Vote },
    { id: 'admin', label: 'Mining & Admin', icon: Cpu },
    { id: 'blockchain', label: 'Blockchain Explorer', icon: Blocks },
    { id: 'results', label: 'Audit & Results', icon: BarChart3 },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.2 }}>
              UNIVERSAL VOTING SYSTEM
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              SHA-256 Proof of Work Ledger Architecture
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: isActive ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Backend Status & Sync */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {backendLive ? (
            <span className="badge badge-success">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} className="pulse-indicator" />
              Flask :5000 Online
            </span>
          ) : (
            <span className="badge badge-warning" title="Flask server not detected on localhost:5000">
              <AlertTriangle size={13} />
              Local Mock Active
            </span>
          )}

          <button
            onClick={onRefresh}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
            disabled={isRefreshing}
            title="Refresh Blockchain Data"
          >
            <RefreshCw size={14} className={isRefreshing ? 'pulse-indicator' : ''} style={{ transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s' }} />
            Sync
          </button>
        </div>
      </div>
    </header>
  );
}

