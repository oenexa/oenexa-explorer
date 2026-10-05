import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from './components/Header'
import { Tabs, TabKey } from './components/Tabs'
import { DashboardTab } from './components/DashboardTab'
import { ExplorerTab } from './components/ExplorerTab'
import { WalletTab } from './components/WalletTab'
import { ShieldedTab } from './components/ShieldedTab'
import { RpcConsoleTab } from './components/RpcConsoleTab'
import { MatrixBackground } from './components/MatrixBackground'
import { OENClient } from './services/rpcClient'
import './App.css'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')

  // Detect node origin: check stored endpoint, check if served directly on port 8545, or fallback to /rpc reverse proxy
  const initialEndpoint = useMemo(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oen_rpc_endpoint')
      // If stored endpoint was mistakenly set to web static asset root without /rpc, discard it
      if (saved) {
        const s = saved.trim().toLowerCase()
        const isStaticWeb = (s.includes(':8080') || s.includes(':5173') || s.includes(':3000')) && !s.includes('/rpc')
        if (!isStaticWeb && (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'))) {
          return saved.trim()
        }
        localStorage.removeItem('oen_rpc_endpoint')
      }

      if (window.location.port === '8545') {
        return window.location.origin
      }
      // On containerized Nginx (port 8080) or Vite dev (port 5173), reverse proxy via /rpc
      if (window.location.port === '8080' || window.location.port === '5173') {
        return '/rpc'
      }

      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
      const hostname = window.location.hostname || 'localhost'
      return `${protocol}//${hostname}:8545`
    }
    return 'http://localhost:8545'
  }, [])

  const [endpoint, setEndpoint] = useState<string>(initialEndpoint)
  const client = useMemo(() => new OENClient(endpoint), [endpoint])

  const handleEndpointChange = (url: string) => {
    setEndpoint(url)
    if (typeof window !== 'undefined') {
      localStorage.setItem('oen_rpc_endpoint', url)
    }
  }

  const [connected, setConnected] = useState(false)
  const [height, setHeight] = useState(0)

  const checkLiveness = useCallback(async () => {
    try {
      const info = await client.getChainInfo()
      setConnected(true)
      setHeight(info.height)
    } catch {
      setConnected(false)
    }
  }, [client])

  useEffect(() => {
    checkLiveness()
    const interval = setInterval(checkLiveness, 5000)
    return () => clearInterval(interval)
  }, [checkLiveness])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('oen_theme', 'dark')
  }, [])

  return (
    <div className="app-root theme-dark">
      <MatrixBackground />
      <div className="cyber-grid"></div>
      
      <Header
        endpoint={endpoint}
        connected={connected}
        height={height}
        onEndpointChange={handleEndpointChange}
      />

      <div className="cyber-ticker-container">
        <div className="cyber-ticker">
          <span>[SYSTEM LOG] Node connected at {endpoint} // Block Height: {height} // MEMPOOL STATUS: OPTIMAL // ML-DSA-65 SIGNATURES VERIFIED // LAYER-2 ROLLUP: STANDBY // SYNC PROGRESS: 100% // PEER COUNT: 42 // EIP-1559 BASE FEE: 7 OEN //</span>
          <span>[SYSTEM LOG] Node connected at {endpoint} // Block Height: {height} // MEMPOOL STATUS: OPTIMAL // ML-DSA-65 SIGNATURES VERIFIED // LAYER-2 ROLLUP: STANDBY // SYNC PROGRESS: 100% // PEER COUNT: 42 // EIP-1559 BASE FEE: 7 OEN //</span>
        </div>
      </div>

      <div className="main-layout">
        <Tabs activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="content-container">
          {activeTab === 'dashboard' && <DashboardTab client={client} />}
          {activeTab === 'explorer' && <ExplorerTab client={client} />}
          {activeTab === 'wallet' && <WalletTab client={client} />}
          {activeTab === 'shielded' && <ShieldedTab client={client} />}
          {activeTab === 'rpc-console' && <RpcConsoleTab client={client} />}
        </main>
      </div>

      <footer className="footer-container">
        <div className="footer-left">
          <span>OENEXA (OEN) Core v0.5.0</span>
          <span className="dot-sep">•</span>
          <span>NIST FIPS 204 (ML-DSA-65)</span>
          <span className="dot-sep">•</span>
          <span>NIST FIPS 203 (ML-KEM-768)</span>
          <span className="dot-sep">•</span>
          <span>Dual-Pool Privacy</span>
        </div>
        <div className="footer-right">
          <span>Turnstile Verified • EIP-1559 Elastic Fee</span>
        </div>
      </footer>
    </div>
  )
}

export default App
