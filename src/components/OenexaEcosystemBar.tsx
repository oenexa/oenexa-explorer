import React from 'react'

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {}

const ECOSYSTEM_LINKS = [
  { id: 'portal', label: 'Portal', href: env.VITE_OENEXA_PORTAL_URL || 'https://app.oenexa.com' },
  { id: 'exchange', label: 'Exchange', href: env.VITE_OENEXA_EXCHANGE_URL || 'https://exchange.oenexa.com/trade' },
  { id: 'wallet', label: 'Wallet', href: env.VITE_OENEXA_WALLET_URL || 'https://wallet.oenexa.com/wallet' },
  { id: 'chain', label: 'Blockchain', href: '/' },
  { id: 'ai', label: 'OENXA AI', href: env.VITE_OENEXA_AI_URL || 'https://ai.oenexa.com' },
  { id: 'oengo', label: 'OENGO', href: env.VITE_OENEXA_OENGO_URL || 'https://oengo.oenexa.com' },
  { id: 'security', label: 'Security Center', href: env.VITE_OENEXA_SECURITY_URL || 'https://app.oenexa.com/security' },
  { id: 'docs', label: 'Docs', href: env.VITE_OENEXA_DOCS_URL || 'https://docs.oenexa.com' },
]

export const OenexaEcosystemBar: React.FC<{ activeProduct?: string }> = ({ activeProduct = 'chain' }) => (
  <div
    data-testid="oenexa-ecosystem-bar"
    style={{
      height: '32px',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--ox-bg-canvas, #0b0e14)',
      borderBottom: '1px solid var(--ox-border-subtle, #232b3b)',
      fontSize: '11px',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontWeight: 700, color: 'var(--ox-accent-primary, #f0b90b)', marginRight: '8px' }}>
        OENEXA ECOSYSTEM
      </span>
      {ECOSYSTEM_LINKS.map((item) => {
        const active = item.id === activeProduct
        return (
          <a
            key={item.id}
            href={item.href}
            target={active ? undefined : '_blank'}
            rel={active ? undefined : 'noopener noreferrer'}
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: active ? 600 : 400,
              backgroundColor: active ? 'var(--ox-bg-elevated, #1f2533)' : 'transparent',
              color: active ? 'var(--ox-text-primary, #f0f3f6)' : 'var(--ox-text-secondary, #8c9ba8)',
            }}
          >
            {item.label}
          </a>
        )
      })}
    </div>
    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--ox-text-muted, #5a6878)' }}>
      SSO · id.oenexa.com
    </span>
  </div>
)
