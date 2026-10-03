export interface RPCRequest<T = any[]> {
  jsonrpc: '2.0'
  method: string
  params: T
  id: number
}

export interface RPCResponse<T = any> {
  jsonrpc: '2.0'
  id: number
  result?: T
  error?: {
    code: number
    message: string
    data?: any
  }
}

export interface ChainInfo {
  chainId?: string | number
  chain_id?: number
  height: number
  tipHash?: string
  tip_hash?: string
  validators?: number
  validator_addr?: string
  round?: number
  mempoolSize?: number
  mempool_len?: number
  baseFee?: number
  base_fee?: number
  gasLimit?: number
  gas_limit?: number
  gasTargetRatio?: number
  gas_target_ratio?: number
  peerCount?: number
  peer_count?: number
  version?: string
  ticker?: string
}

export interface TransactionInfo {
  hash: string
  type: string
  from: string
  to: string
  value: string
  nonce: number
  gasLimit: number
  maxFeePerGas: number
}

export interface BlockInfo {
  height: number
  hash: string
  parentHash?: string
  prev_hash?: string
  timestamp: number
  proposer?: string
  validator_addr?: string
  txCount?: number
  tx_count?: number
  transactions?: TransactionInfo[]
  gasUsed?: number
  gas_used?: number
  gasLimit?: number
  gas_limit?: number
  baseFee?: number
  base_fee?: number
}

export interface FeeEstimate {
  baseFee: number
  slow: number
  standard: number
  fast: number
}

export interface Proposal {
  id: number
  title: string
  description: string
  proposer: string
  votesFor: number
  votesAgainst: number
  quorum: number
  status: 'Active' | 'Passed' | 'Rejected' | 'Executed'
  deadline: number
}

export interface CarbonCredit {
  id: string
  vintage: number
  project: string
  standard: string
  issuer: string
  owner: string
  amountTons: number
  isRetired: boolean
}
