import React, { useState, useEffect, useCallback } from 'react'
import type { OENClient } from '../services/rpcClient'
import type { BlockInfo } from '../types/rpc'

export interface ExplorerTabProps {
  client: OENClient
}

export const ExplorerTab: React.FC<ExplorerTabProps> = ({ client }) => {
  const [query, setQuery] = useState('')
  const [block, setBlock] = useState<BlockInfo | null>(null)
  const [recentBlocks, setRecentBlocks] = useState<BlockInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRecent, setLoadingRecent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecent = useCallback(async () => {
    setLoadingRecent(true)
    try {
      const blocks = await client.getRecentBlocks(8)
      if (Array.isArray(blocks) && blocks.length > 0) {
        setRecentBlocks(blocks)
      }
    } catch {
      // Ignore background refresh errors
    } finally {
      setLoadingRecent(false)
    }
  }, [client])

  useEffect(() => {
    fetchRecent()
    const interval = setInterval(fetchRecent, 6000)
    return () => clearInterval(interval)
  }, [fetchRecent])

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault()
    const trimmed = (customQuery ?? query).trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setBlock(null)

    try {
      if (/^\d+$/.test(trimmed)) {
        const height = parseInt(trimmed, 10)
        const b = await client.getBlockByHeight(height)
        setBlock(b)
      } else {
        const b = await client.getBlockByHash(trimmed)
        setBlock(b)
      }
    } catch (err: any) {
      setError(err.message || 'Block not found')
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (ts: number) => {
    if (!ts) return 'Genesis'
    const ms = ts > 1e12 ? Math.floor(ts / 1e6) : ts * 1000
    return new Date(ms).toUTCString()
  }

  return (
    <section className="tab-pane">
      <div className="tab-header">
        <div>
          <h2 className="tab-title">Block & Transaction Explorer</h2>
          <p className="tab-subtitle">Inspect real-time blocks, post-quantum transactions, and state roots</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSearch(e)} className="search-bar-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Block height or 32-byte hash (e.g., 105 or 0000abcd...)"
          className="search-input"
          aria-label="Search query"
        />
        <button
          type="submit"
          className="btn primary"
          aria-label="Search"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </form>

      {error && (
        <div className="alert-box error mt-4" role="alert">
          <span>⚠️ {error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Fetching block from blockchain...</p>
        </div>
      )}

      {block && (
        <div className="card mt-4">
          <div className="card-header-flex">
            <h3 className="card-title">Block #{block.height} Details</h3>
            <span className="badge success">
              {block.txCount ?? block.tx_count ?? (block.transactions ? block.transactions.length : 0)} Transactions
            </span>
          </div>

          <div className="detail-table">
            <div className="detail-row">
              <span className="detail-key">Block Hash</span>
              <code className="detail-val break-all">{block.hash}</code>
            </div>
            <div className="detail-row">
              <span className="detail-key">Parent Hash</span>
              <code className="detail-val break-all">{block.parentHash || block.prev_hash || 'Genesis (0x0)'}</code>
            </div>
            <div className="detail-row">
              <span className="detail-key">Proposer (Validator)</span>
              <code className="detail-val text-green break-all">{block.proposer || block.validator_addr || 'OEN Validator'}</code>
            </div>
            <div className="detail-row">
              <span className="detail-key">Timestamp</span>
              <span className="detail-val">{formatTimestamp(block.timestamp)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Gas Used</span>
              <span className="detail-val">{(block.gasUsed ?? block.gas_used ?? 0).toLocaleString()} gas</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Base Fee</span>
              <span className="detail-val">{block.baseFee ?? block.base_fee ?? 10} nanoOEN</span>
            </div>
          </div>

          <h4 className="sub-title mt-4">Transactions in this Block</h4>
          {block.transactions && block.transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tx Hash</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value (OEN)</th>
                    <th>Nonce</th>
                    <th>Gas Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {block.transactions.map((tx) => (
                    <tr key={tx.hash}>
                      <td><code className="tx-hash-badge">{tx.hash.slice(0, 12)}...</code></td>
                      <td><span className="type-badge">{tx.type}</span></td>
                      <td><code className="addr-badge">{tx.from.slice(0, 10)}...</code></td>
                      <td><code className="addr-badge">{tx.to ? `${tx.to.slice(0, 10)}...` : 'Contract Deploy'}</code></td>
                      <td className="text-right">
                        {(Number(BigInt(tx.value || '0')) / 1e9).toFixed(4)}
                      </td>
                      <td>{tx.nonce}</td>
                      <td>{(tx.gasLimit || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-text">No transactions included in this block (BFT heartbeat).</p>
          )}
        </div>
      )}

      {/* Live Recent Blocks Feed */}
      <div className="card mt-4">
        <div className="card-header-flex">
          <h3 className="card-title">Live Recent Blocks</h3>
          <button
            onClick={fetchRecent}
            className="btn-sm secondary"
            disabled={loadingRecent}
            aria-label="Refresh recent blocks"
          >
            {loadingRecent ? 'Refreshing...' : '🔄 Refresh Feed'}
          </button>
        </div>

        {recentBlocks.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Height</th>
                  <th>Hash</th>
                  <th>Proposer</th>
                  <th>Tx Count</th>
                  <th>Gas Used</th>
                  <th>Base Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBlocks.map((b) => (
                  <tr key={b.height}>
                    <td><strong className="text-cyan">#{b.height}</strong></td>
                    <td><code className="tx-hash-badge">{b.hash ? b.hash.slice(0, 14) + '...' : '-'}</code></td>
                    <td><code className="addr-badge">{b.validator_addr ? b.validator_addr.slice(0, 12) + '...' : 'Validator'}</code></td>
                    <td><span className="badge secondary">{b.tx_count ?? b.txCount ?? 0} txs</span></td>
                    <td>{(b.gas_used ?? b.gasUsed ?? 0).toLocaleString()}</td>
                    <td>{b.base_fee ?? b.baseFee ?? 10} nanoOEN</td>
                    <td>
                      <button
                        onClick={() => {
                          setBlock(b)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="btn-sm primary"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-text">Loading live blocks from consensus engine...</p>
        )}
      </div>
    </section>
  )
}
