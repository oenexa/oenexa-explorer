import React, { useState } from 'react'

interface DataCenter {
  id: string
  name: string
  location: string
  powerSource: string
  capacityMW: number
  totalShares: number
  pricePerShare: number
  currentFunding: number
  totalFunding: number
  state: 'ACTIVE' | 'BUILDING' | 'FUNDING'
  gpusAvailable: number
  totalGpus: number
  hourlyRateOen: number
  revenuePool: number
}

const INITIAL_DATA_CENTERS: DataCenter[] = [
  {
    id: 'CORTEX-DC-01',
    name: 'Sierra Nevada Tier-4 Facility',
    location: 'Reno, NV, USA',
    powerSource: '100% Geothermal + Solar',
    capacityMW: 75,
    totalShares: 100000,
    pricePerShare: 10,
    currentFunding: 1000000,
    totalFunding: 1000000,
    state: 'ACTIVE',
    gpusAvailable: 512,
    totalGpus: 1024,
    hourlyRateOen: 2.5,
    revenuePool: 184500,
  },
  {
    id: 'CORTEX-DC-02',
    name: 'Nordic Hydro Compute Hub',
    location: 'Reykjavik, Iceland',
    powerSource: '100% Hydroelectric',
    capacityMW: 120,
    totalShares: 200000,
    pricePerShare: 12.5,
    currentFunding: 1650000,
    totalFunding: 2500000,
    state: 'BUILDING',
    gpusAvailable: 0,
    totalGpus: 2048,
    hourlyRateOen: 2.1,
    revenuePool: 42000,
  },
  {
    id: 'CORTEX-DC-03',
    name: 'Atacama Solar AI Park',
    location: 'Atacama Desert, Chile',
    powerSource: '100% High-Irradiance Solar',
    capacityMW: 200,
    totalShares: 300000,
    pricePerShare: 8.0,
    currentFunding: 920000,
    totalFunding: 2400000,
    state: 'FUNDING',
    gpusAvailable: 0,
    totalGpus: 4096,
    hourlyRateOen: 1.8,
    revenuePool: 0,
  },
]

export const CortexTab: React.FC = () => {
  const [dataCenters, setDataCenters] = useState<DataCenter[]>(INITIAL_DATA_CENTERS)
  const [selectedDc, setSelectedDc] = useState<string>('CORTEX-DC-01')
  const [leaseHours, setLeaseHours] = useState<number>(10)
  const [gpuCount, setGpuCount] = useState<number>(8)
  const [leaseSuccess, setLeaseSuccess] = useState<boolean>(false)
  const [bondShares, setBondShares] = useState<number>(50)
  const [investSuccess, setInvestSuccess] = useState<boolean>(false)

  const activeDc = dataCenters.find((d) => d.id === selectedDc) || dataCenters[0]
  const totalLeaseCost = (gpuCount * leaseHours * activeDc.hourlyRateOen).toFixed(2)
  const totalBondCost = (bondShares * activeDc.pricePerShare).toFixed(2)

  const handleLease = () => {
    if (activeDc.state !== 'ACTIVE') return
    setLeaseSuccess(true)
    setDataCenters((prev) =>
      prev.map((dc) =>
        dc.id === activeDc.id
          ? {
              ...dc,
              gpusAvailable: Math.max(0, dc.gpusAvailable - gpuCount),
              revenuePool: dc.revenuePool + parseFloat(totalLeaseCost),
            }
          : dc
      )
    )
    setTimeout(() => setLeaseSuccess(false), 4000)
  }

  const handleInvest = () => {
    setInvestSuccess(true)
    setDataCenters((prev) =>
      prev.map((dc) =>
        dc.id === activeDc.id
          ? {
              ...dc,
              currentFunding: Math.min(dc.totalFunding, dc.currentFunding + parseFloat(totalBondCost)),
            }
          : dc
      )
    )
    setTimeout(() => setInvestSuccess(false), 4000)
  }

  return (
    <section className="tab-pane">
      <div className="tab-header">
        <div>
          <h2 className="tab-title">Oenexa Cortex: Green Data Center AI Grid</h2>
          <p className="tab-subtitle">
            Tokenized Tier-4 Infrastructure Bonds, Compute-as-a-Service (CaaS) Leasing & Yield Streaming
          </p>
        </div>
        <span className="badge success">100% Renewable AI Compute</span>
      </div>

      <div className="metrics-grid mb-4">
        <div className="metric-card">
          <span className="metric-label">Total Grid Capacity</span>
          <span className="metric-value highlight">395 MW</span>
          <span className="metric-foot">Zero-Emission Geothermal & Hydro</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Compute Nodes Online</span>
          <span className="metric-value">1,024 GPUs</span>
          <span className="metric-foot">NVIDIA H100 / TPU v5p Clusters</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Yield Revenue Pool</span>
          <span className="metric-value highlight">226,500 OEN</span>
          <span className="metric-foot">Autonomous backer dividends</span>
        </div>
      </div>

      {leaseSuccess && (
        <div className="alert-box success mb-4">
          <span>✅ CaaS Compute Lease Verified on Layer-1! GPU allocation reserved for {leaseHours} hours.</span>
        </div>
      )}

      {investSuccess && (
        <div className="alert-box success mb-4">
          <span>✅ Fractional Infrastructure Bonds Minted! {bondShares} shares added to your account.</span>
        </div>
      )}

      <div className="swap-card-container">
        {/* Left: Facilities List & Bonding */}
        <div className="card">
          <h3 className="card-title">Tokenized Data Center Bonds</h3>
          <p className="tab-subtitle mb-3">Fractional infrastructure ownership with proportional yield streaming</p>

          <div className="form-group mb-3">
            <label htmlFor="dc-select">Select Facility:</label>
            <select
              id="dc-select"
              value={selectedDc}
              onChange={(e) => setSelectedDc(e.target.value)}
              className="form-input"
            >
              {dataCenters.map((dc) => (
                <option key={dc.id} value={dc.id}>
                  {dc.name} ({dc.state})
                </option>
              ))}
            </select>
          </div>

          <div className="info-row">
            <span className="info-key">Location:</span>
            <span className="info-val">{activeDc.location}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Clean Power Source:</span>
            <span className="info-val text-green">{activeDc.powerSource}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Facility Capacity:</span>
            <span className="info-val">{activeDc.capacityMW} MW</span>
          </div>
          <div className="info-row">
            <span className="info-key">Funding Status:</span>
            <span className="info-val">
              {activeDc.currentFunding.toLocaleString()} / {activeDc.totalFunding.toLocaleString()} OEN (
              {((activeDc.currentFunding / activeDc.totalFunding) * 100).toFixed(1)}%)
            </span>
          </div>

          <div className="voting-progress mt-3 mb-3">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, (activeDc.currentFunding / activeDc.totalFunding) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="bond-shares">Bond Shares to Purchase:</label>
            <input
              id="bond-shares"
              type="number"
              min="1"
              max="5000"
              value={bondShares}
              onChange={(e) => setBondShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input"
            />
          </div>

          <div className="swap-meta mt-3">
            <div className="meta-row">
              <span>Price per Share:</span>
              <span>{activeDc.pricePerShare} OEN</span>
            </div>
            <div className="meta-row">
              <span>Total Investment:</span>
              <span className="text-cyan">{totalBondCost} OEN</span>
            </div>
          </div>

          <button onClick={handleInvest} className="btn success full-width mt-3">
            💰 Purchase Infrastructure Bonds
          </button>
        </div>

        {/* Right: CaaS Compute Leasing */}
        <div className="card">
          <h3 className="card-title">Compute-as-a-Service (CaaS) Leasing</h3>
          <p className="tab-subtitle mb-3">Lease decentralized green GPU/TPU compute settled natively in OEN</p>

          <div className="info-row">
            <span className="info-key">Facility Status:</span>
            <span className={`badge ${activeDc.state === 'ACTIVE' ? 'success' : 'info'}`}>{activeDc.state}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Cluster Hardware:</span>
            <span className="info-val">NVIDIA H100 80GB SXM5</span>
          </div>
          <div className="info-row">
            <span className="info-key">Available GPUs:</span>
            <span className="info-val">
              {activeDc.gpusAvailable} / {activeDc.totalGpus} Units
            </span>
          </div>
          <div className="info-row">
            <span className="info-key">Hourly Rate:</span>
            <span className="info-val">{activeDc.hourlyRateOen} OEN/GPU/hr</span>
          </div>

          <div className="form-grid mt-3">
            <div className="form-group">
              <label htmlFor="gpu-count">GPU Cluster Size:</label>
              <input
                id="gpu-count"
                type="number"
                min="1"
                max={Math.max(1, activeDc.gpusAvailable)}
                value={gpuCount}
                onChange={(e) => setGpuCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lease-hours">Duration (Hours):</label>
              <input
                id="lease-hours"
                type="number"
                min="1"
                max="720"
                value={leaseHours}
                onChange={(e) => setLeaseHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-input"
              />
            </div>
          </div>

          <div className="swap-meta mt-3">
            <div className="meta-row">
              <span>Lease Settlement:</span>
              <span className="text-cyan font-bold">{totalLeaseCost} OEN</span>
            </div>
            <div className="meta-row">
              <span>Escrow Security:</span>
              <span>Automated Wazero pure-Go VM</span>
            </div>
            <div className="meta-row">
              <span>Backer Dividend Cut:</span>
              <span>100% of lease fee routed to bondholders</span>
            </div>
          </div>

          <button
            onClick={handleLease}
            disabled={activeDc.state !== 'ACTIVE'}
            className={`btn primary full-width mt-3 ${activeDc.state !== 'ACTIVE' ? 'opacity-50' : ''}`}
          >
            🚀 Launch AI Compute Workload
          </button>
        </div>
      </div>
    </section>
  )
}
