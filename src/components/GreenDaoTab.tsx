import React, { useState } from 'react'
import type { Proposal } from '../types/rpc'

const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 1,
    title: 'Renewable Validator Subsidy',
    description: 'Allocate 50,000 OEN monthly block reward bonus to validators and Oenexa Cortex AI Data Centers operating 100% on certified renewable energy.',
    proposer: 'OEN_GREEN_FOUNDATION',
    votesFor: 1250000,
    votesAgainst: 120000,
    quorum: 1000000,
    status: 'Active',
    deadline: 1726500000,
  },
  {
    id: 2,
    title: 'Zero-Carbon Emission Gas Rebate',
    description: 'Provide an automated 15% gas fee rebate for smart contract transactions interacting with CarbonX carbon offset credits on-chain.',
    proposer: 'ECO_VALIDATOR_ALLIANCE',
    votesFor: 890000,
    votesAgainst: 45000,
    quorum: 1000000,
    status: 'Active',
    deadline: 1726800000,
  },
  {
    id: 3,
    title: 'EnergyX P2P Microgrid Settlement Pilot',
    description: 'Grant 150,000 OEN for municipal solar & battery storage IoT smart meter integration, enabling decentralized peer-to-peer clean power trading.',
    proposer: 'ENERGYX_COMMUNITY_COOP',
    votesFor: 620000,
    votesAgainst: 18000,
    quorum: 1000000,
    status: 'Active',
    deadline: 1727200000,
  },
]

export const GreenDaoTab: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS)
  const [votedId, setVotedId] = useState<number | null>(null)

  const handleVote = (id: number, support: boolean) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          votesFor: support ? p.votesFor + 10000 : p.votesFor,
          votesAgainst: !support ? p.votesAgainst + 10000 : p.votesAgainst,
        }
      })
    )
    setVotedId(id)
    setTimeout(() => setVotedId(null), 3000)
  }

  return (
    <section className="tab-pane">
      <div className="tab-header">
        <div>
          <h2 className="tab-title">GreenDAO Environmental Governance</h2>
          <p className="tab-subtitle">Decentralized quadratic governance voting on renewable energy & climate impact</p>
        </div>
        <span className="badge success">Quadratic Voting: Power = √OEN</span>
      </div>

      <div className="metrics-grid mb-4">
        <div className="metric-card">
          <span className="metric-label">Treasury Reserve</span>
          <span className="metric-value highlight">10,000,000 OEN</span>
          <span className="metric-foot">Dedicated to zero-emission infrastructure</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Voting Quorum</span>
          <span className="metric-value">20.0%</span>
          <span className="metric-foot">60% supermajority required to pass</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Active Proposals</span>
          <span className="metric-value">3</span>
          <span className="metric-foot">Milestone-based tranche execution</span>
        </div>
      </div>

      {votedId !== null && (
        <div className="alert-box success mb-4">
          <span>✅ Vote Recorded with Post-Quantum Proof!</span>
        </div>
      )}

      <div className="proposals-grid">
        {proposals.map((prop) => {
          const total = prop.votesFor + prop.votesAgainst
          const pctFor = total > 0 ? ((prop.votesFor / total) * 100).toFixed(1) : '0'

          return (
            <div key={prop.id} className="card proposal-card">
              <div className="card-header-flex">
                <span className="badge info">Proposal #{prop.id}</span>
                <span className="badge success">{prop.status}</span>
              </div>

              <h3 className="proposal-title">{prop.title}</h3>
              <p className="proposal-desc">{prop.description}</p>

              <div className="info-row">
                <span className="info-key">Proposer:</span>
                <code className="info-val">{prop.proposer}</code>
              </div>

              <div className="voting-progress mt-3">
                <div className="progress-labels">
                  <span>Votes For: {prop.votesFor.toLocaleString()} ({pctFor}%)</span>
                  <span>Against: {prop.votesAgainst.toLocaleString()}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pctFor}%` }}
                  ></div>
                </div>
              </div>

              <div className="btn-group mt-4">
                <button
                  onClick={() => handleVote(prop.id, true)}
                  className="btn success flex-1"
                >
                  👍 Vote For
                </button>
                <button
                  onClick={() => handleVote(prop.id, false)}
                  className="btn danger flex-1"
                >
                  👎 Vote Against
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
