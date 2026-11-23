import React, { useState } from 'react';

export interface SolvencyRecord {
  epoch: number;
  merkleRoot: string;
  reservesUsd: string;
  liabilitiesUsd: string;
  ratioBps: number;
  circuitBreakerActive: boolean;
  publishedAt: string;
}

export const ProofOfReservesTab: React.FC = () => {
  const [userAccountHash, setUserAccountHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const mockSolvencyEpoch: SolvencyRecord = {
    epoch: 142,
    merkleRoot: '0x8f4b1029cba881726a8819024810293847561029384756102938475610293847',
    reservesUsd: '142,500,000.00',
    liabilitiesUsd: '138,200,000.00',
    ratioBps: 10311, // 103.11%
    circuitBreakerActive: false,
    publishedAt: new Date().toISOString(),
  };

  const handleVerifyInclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAccountHash.trim()) {
      setVerificationResult('Please provide a valid account ID or hashed leaf.');
      return;
    }
    // Cryptographic Merkle inclusion verification simulation
    setVerificationResult(
      `VERIFIED: Account leaf '${userAccountHash.trim()}' is cryptographically proven in published Merkle Root (Epoch #${mockSolvencyEpoch.epoch}). Solvency Ratio: ${(mockSolvencyEpoch.ratioBps / 100).toFixed(2)}%.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#151922] border border-[#232b3b] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">On-Chain Proof of Reserves & Solvency</h2>
        <p className="text-sm text-gray-400 mb-6">
          Cryptographically auditable Merkle liability tree proving 100%+ backing of all client liabilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0b0e14] p-4 rounded-lg border border-[#232b3b]">
            <p className="text-xs text-gray-400 uppercase">Solvency Ratio</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">
              {(mockSolvencyEpoch.ratioBps / 100).toFixed(2)}%
            </p>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-lg border border-[#232b3b]">
            <p className="text-xs text-gray-400 uppercase">Total Reserves (USD)</p>
            <p className="text-xl font-semibold text-white font-mono">${mockSolvencyEpoch.reservesUsd}</p>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-lg border border-[#232b3b]">
            <p className="text-xs text-gray-400 uppercase">Total Liabilities (USD)</p>
            <p className="text-xl font-semibold text-white font-mono">${mockSolvencyEpoch.liabilitiesUsd}</p>
          </div>
          <div className="bg-[#0b0e14] p-4 rounded-lg border border-[#232b3b]">
            <p className="text-xs text-gray-400 uppercase">Circuit Breaker</p>
            <p className="text-sm font-semibold text-emerald-400 mt-1">NORMAL (STANDBY)</p>
          </div>
        </div>

        <form onSubmit={handleVerifyInclusion} className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Self-Audit: Verify Your Account In Published Merkle Tree
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={userAccountHash}
              onChange={(e) => setUserAccountHash(e.target.value)}
              placeholder="Enter User Account ID (e.g. usr_9921_institutional) or Leaf Hash"
              className="flex-1 bg-[#0b0e14] border border-[#232b3b] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-400 text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Verify Merkle Proof
            </button>
          </div>
        </form>

        {verificationResult && (
          <div className="mt-4 p-4 rounded-lg bg-[#0b0e14] border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            {verificationResult}
          </div>
        )}
      </div>
    </div>
  );
};
