// API Client for Universal Voting System Flask Backend
const API_BASE = 'http://localhost:5000';

// Built-in list of official candidates for election
export const DEFAULT_CANDIDATES = [
  {
    id: "cand-1",
    name: "Elena Vance",
    role: "Presidential Candidate",
    party: "Innovate Campus Alliance",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
    manifesto: "Enhancing AI research labs, sustainable campus power, and transparent budget allocation."
  },
  {
    id: "cand-2",
    name: "Marcus Aurel",
    role: "Presidential Candidate",
    party: "Student Liberty Coalition",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    manifesto: "24/7 library access, universal mental health counseling, and student tech hackathons."
  },
  {
    id: "cand-3",
    name: "Aisha Chen",
    role: "Presidential Candidate",
    party: "Forward Progress Front",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces",
    manifesto: "Affordable housing stipends, cross-disciplinary maker spaces, and ethical AI governance."
  }
];

export async function fetchChain() {
  try {
    const res = await fetch(`${API_BASE}/get_chain`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with ${res.status}`);
    }
    const data = await res.json();
    return { data, isLive: true };
  } catch (error) {
    return { error: error.message, isLive: false };
  }
}

export async function castVote(voterId, candidateId) {
  try {
    const res = await fetch(`${API_BASE}/add_vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voter_id: voterId, candidate_id: candidateId })
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to submit ballot.");
    }
    return { success: true, message: result.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function triggerMine() {
  try {
    const res = await fetch(`${API_BASE}/mine`);
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || result.message || "Mining failed.");
    }
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

