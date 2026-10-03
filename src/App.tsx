import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from './components/Header'
import { Tabs, TabKey } from './components/Tabs'
import { DashboardTab } from './components/DashboardTab'
import { ExplorerTab } from './components/ExplorerTab'
import { WalletTab } from './components/WalletTab'
import { ShieldedTab } from './components/ShieldedTab'
import { RpcConsoleTab } from './components/RpcConsoleTab'
import { OENClient } from './services/rpcClient'
import './App.css'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('oen_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true
  })

  // Detect node origin: check stored endpoint, check if served directly on port 8545, or fallback to node RPC on same host
  const initialEndpoint = useMemo(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oen_rpc_endpoint')
      if (saved) return saved
      if (window.location.port === '8545') {
        return window.location.origin
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
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('oen_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark((prev) => !prev)

  return (
    <div className={`app-root ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <Header
        endpoint={endpoint}
        connected={connected}
        height={height}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onEndpointChange={handleEndpointChange}
      />

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
