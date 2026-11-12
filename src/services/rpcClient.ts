import type {
  RPCRequest,
  RPCResponse,
  ChainInfo,
  BlockInfo,
  FeeEstimate,
} from '../types/rpc'

export class RPCError extends Error {
  code: number
  data?: any

  constructor(message: string, code: number, data?: any) {
    super(message)
    this.name = 'RPCError'
    this.code = code
    this.data = data
  }
}

export class ONXCClient {
  private endpoint: string
  private idCounter: number = 0

  constructor(endpoint: string = 'http://localhost:8545') {
    this.endpoint = endpoint
  }

  getEndpoint(): string {
    return this.endpoint
  }

  setEndpoint(url: string): void {
    this.endpoint = url
  }

  private nextId(): number {
    return ++this.idCounter
  }

  async dispatch<T = any>(method: string, params: any[] = []): Promise<T> {
    const id = this.nextId()
    const reqBody: RPCRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    const json: RPCResponse<T> = await response.json()

    if (json.error) {
      throw new RPCError(json.error.message, json.error.code, json.error.data)
    }

    return json.result as T
  }

  async dispatchBatch(calls: { method: string; params: any[] }[]): Promise<any[]> {
    if (calls.length === 0) return []

    const reqBatch: RPCRequest[] = calls.map((c) => ({
      jsonrpc: '2.0',
      method: c.method,
      params: c.params,
      id: this.nextId(),
    }))

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBatch),
    })

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    const jsonList: RPCResponse[] = await response.json()
    return jsonList.map((item) => {
      if (item.error) {
        throw new RPCError(item.error.message, item.error.code, item.error.data)
      }
      return item.result
    })
  }

  async getChainInfo(): Promise<ChainInfo> {
    return this.dispatch<ChainInfo>('onxc_chainInfo', [])
  }

  async getBlockByHeight(height: number): Promise<BlockInfo> {
    return this.dispatch<BlockInfo>('onxc_blockByHeight', [height])
  }

  async getBlockByHash(hash: string): Promise<BlockInfo> {
    return this.dispatch<BlockInfo>('onxc_blockByHash', [hash])
  }

  async getRecentBlocks(count: number = 10): Promise<BlockInfo[]> {
    return this.dispatch<BlockInfo[]>('onxc_recentBlocks', [count])
  }

  async getBalance(address: string): Promise<string> {
    const res = await this.dispatch<any>('onxc_getBalance', [address])
    if (typeof res === 'object' && res !== null) {
      if (res.balance_nano_onxc !== undefined) return String(res.balance_nano_onxc)
      if (res.balance !== undefined) return String(res.balance)
    }
    return String(res ?? '0')
  }

  async getTransactionCount(address: string): Promise<number> {
    return this.dispatch<number>('onxc_getTransactionCount', [address])
  }

  async sendRawTransaction(rawHex: string): Promise<string> {
    return this.dispatch<string>('onxc_sendRawTransaction', [rawHex])
  }

  async getFeeEstimate(): Promise<FeeEstimate> {
    return this.dispatch<FeeEstimate>('onxc_feeEstimate', [])
  }

  async getGasPrice(): Promise<number> {
    return this.dispatch<number>('onxc_gasPrice', [])
  }

  async getShieldedBalance(): Promise<{
    shielded_balance_nano_onxc: number
    tree_leaf_count: number
    tree_root: string
  }> {
    return this.dispatch('onxc_getShieldedBalance', [])
  }

  async getTurnstileStatus(): Promise<{
    transparent_supply_nano_onxc: number
    shielded_supply_nano_onxc: number
    total_supply_nano_onxc: number
    invariant_preserved: boolean
    status: string
  }> {
    return this.dispatch('onxc_getTurnstileStatus', [])
  }

  async getTransactionReceipt(hash: string): Promise<any> {
    return this.dispatch('onxc_getTransactionReceipt', [hash])
  }

  async getTransactionByHash(hash: string): Promise<any> {
    return this.dispatch('onxc_getTransactionByHash', [hash])
  }
}

export const defaultClient = new ONXCClient()
