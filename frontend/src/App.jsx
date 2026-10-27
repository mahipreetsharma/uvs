import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import VoterPortal from './components/VoterPortal';
import AdminConsole from './components/AdminConsole';
import BlockchainExplorer from './components/BlockchainExplorer';
import ResultsView from './components/ResultsView';
import { fetchChain, castVote, triggerMine, DEFAULT_CANDIDATES } from './api';

// Initial fallback genesis block if backend isn't running yet
const INITIAL_DEMO_CHAIN = [
  {
    index: 0,
    timestamp: Math.floor(Date.now() / 1000) - 3600,
    nonce: 1420,
    votes: [{ info: "Genesis Block - Campus General Election Opened" }],
    previous_hash: "0",
    hash: "000a98f12d59bf32e18d6e32bb20d437bb96583921b7ce32fbb477e748d12345"
  },
  {
    index: 1,
    timestamp: Math.floor(Date.now() / 1000) - 1800,
    nonce: 2891,
    votes: [
      { voter_id: "STU-DEMO-01", candidate_id: "cand-1", timestamp: Math.floor(Date.now() / 1000) - 2000 },
      { voter_id: "STU-DEMO-02", candidate_id: "cand-2", timestamp: Math.floor(Date.now() / 1000) - 1900 },
      { voter_id: "STU-DEMO-03", candidate_id: "cand-1", timestamp: Math.floor(Date.now() / 1000) - 1850 }
    ],
    previous_hash: "000a98f12d59bf32e18d6e32bb20d437bb96583921b7ce32fbb477e748d12345",
    hash: "000b467fe289cb15082e66a33b09dd033572d49a05b3879ef79efb9560dc4811"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('vote');
  const [chain, setChain] = useState(INITIAL_DEMO_CHAIN);
  const [isValid, setIsValid] = useState(true);
  const [unminedVotes, setUnminedVotes] = useState([]);
  const [votedIds, setVotedIds] = useState(new Set(["STU-DEMO-01", "STU-DEMO-02", "STU-DEMO-03"]));
  const [candidates, setCandidates] = useState(DEFAULT_CANDIDATES);
  const [backendLive, setBackendLive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulatedTamper, setIsSimulatedTamper] = useState(false);
  const [originalChainBackup, setOriginalChainBackup] = useState(null);

  // Sync data with backend
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    const res = await fetchChain();
    if (res.isLive && res.data && res.data.chain) {
      setBackendLive(true);
      setChain(res.data.chain);
      setIsValid(res.data.is_valid !== undefined ? res.data.is_valid : true);

      // Collect voted IDs from chain
      const collected = new Set();
      res.data.chain.forEach(blk => {
        if (Array.isArray(blk.votes)) {
          blk.votes.forEach(v => {
            if (v.voter_id) collected.add(v.voter_id);
          });
        }
      });
      setVotedIds(collected);
    } else {
      setBackendLive(false);
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
    // Poll every 10 seconds for updates
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle vote submission
  const handleVoteSubmitted = async (voterId, candidateId) => {
    if (votedIds.has(voterId)) {
      return { success: false, error: `Security Alert: Duplicate ballot attempt blocked. Voter "${voterId}" has already cast a vote.` };
    }

    if (backendLive) {
      const res = await castVote(voterId, candidateId);
      if (res.success) {
        setVotedIds(prev => new Set([...prev, voterId]));
        setUnminedVotes(prev => [...prev, { voter_id: voterId, candidate_id: candidateId, timestamp: Date.now() / 1000 }]);
        return { success: true };
      }
      return res;
    } else {
      // Local demo mode simulation
      const newEntry = { voter_id: voterId, candidate_id: candidateId, timestamp: Date.now() / 1000 };
      setUnminedVotes(prev => [...prev, newEntry]);
      setVotedIds(prev => new Set([...prev, voterId]));
      return { success: true, message: "Ballot added to pending mempool (Local Mode)." };
    }
  };

  // Handle on-demand Proof of Work mining
  const handleTriggerMine = async () => {
    if (backendLive) {
      const res = await triggerMine();
      if (res.success) {
        setUnminedVotes([]);
        await loadData();
        return res;
      }
      return res;
    } else {
      // Local simulation of PoW
      if (unminedVotes.length === 0) {
        return { success: false, error: "No unmined votes present in the pool." };
      }

      const lastBlock = chain[chain.length - 1];
      const newIndex = lastBlock.index + 1;
      const fakeNonce = Math.floor(Math.random() * 5000) + 1000;
      const fakeHash = "000" + Array.from({ length: 61 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const forgedBlock = {
        index: newIndex,
        timestamp: Math.floor(Date.now() / 1000),
        votes: [...unminedVotes],
        previous_hash: lastBlock.hash,
        nonce: fakeNonce,
        hash: fakeHash
      };

      setChain(prev => [...prev, forgedBlock]);
      setUnminedVotes([]);
      return {
        success: true,
        data: {
          message: "Block successfully forged and linked with Proof of Work!",
          block: { index: newIndex, hash: fakeHash }
        }
      };
    }
  };

  // Handle candidate addition
  const handleAddCandidate = (newCand) => {
    setCandidates(prev => [...prev, newCand]);
  };

  // Tamper simulation for educational audit demo
  const handleTamperSimulate = (tamper) => {
    if (tamper) {
      if (!originalChainBackup) {
        setOriginalChainBackup([...chain]);
      }
      // Alter the first non-genesis block payload
      if (chain.length > 1) {
        const tamperedChain = chain.map((b, i) => {
          if (i === 1) {
            return {
              ...b,
              hash: "ffff" + b.hash.slice(4), // Corrupt the hash
              tampered: true
            };
          }
          return b;
        });
        setChain(tamperedChain);
        setIsValid(false);
        setIsSimulatedTamper(true);
      }
    } else {
      if (originalChainBackup) {
        setChain(originalChainBackup);
        setOriginalChainBackup(null);
      }
      setIsValid(true);
      setIsSimulatedTamper(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        backendLive={backendLive}
        chainValid={isValid}
      />

      <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 24px 60px' }}>
        <StatsOverview
          chain={chain}
          isValid={isValid}
          unminedCount={unminedVotes.length}
        />

        {activeTab === 'vote' && (
          <VoterPortal
            candidates={candidates}
            onVoteSubmitted={handleVoteSubmitted}
            votedIds={votedIds}
          />
        )}

        {activeTab === 'admin' && (
          <AdminConsole
            unminedVotes={unminedVotes}
            onTriggerMine={handleTriggerMine}
            onAddCandidate={handleAddCandidate}
            candidates={candidates}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainExplorer
            chain={chain}
            isValid={isValid}
            onTamperSimulate={handleTamperSimulate}
            isSimulatedTamper={isSimulatedTamper}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            chain={chain}
            candidates={candidates}
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        Decentralised E-Voting System &bull; Custom Blockchain Architecture with Proof of Work &bull; Universal Voting System
      </footer>
    </div>
  );
}

