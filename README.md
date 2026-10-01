# OENEXA Frontend (`oenexa-frontend`) — Decoupled Web Portal & Explorer

[![React Version](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Decoupled web dashboard, block explorer, and quantum wallet application for the **OENEXA (OEN)** Layer-1 post-quantum blockchain ecosystem.

---

## Architecture Overview

In accordance with Generation-6 blockchain design standards, the frontend is strictly decoupled from the core consensus daemon (`oenexa-node`). This guarantees:
- **Zero Consensus Bloat**: No npm dependencies, web bundlers, or static HTML inside the consensus binary.
- **Independent Release Velocity**: UI improvements, responsive styling, and feature updates ship without hardforks or node restarts.
- **Unified Web3 Interface**: Connects via Web3 JSON-RPC 2.0 (port 8545) and REST node telemetry (`/api/status`).

---

## Features

- **Dashboard**: Live network telemetry, block height, peer count, TPS, and chain health indicators.
- **Block Explorer**: Real-time block inspection, transactions, state roots, and validator proposal details.
- **Post-Quantum Wallet**: NIST ML-DSA-65 address inspection, balances, and transfer broadcasting.
- **Shielded Privacy Pool**: Private note management, viewing key export, and turnstile supply audits.
- **OenexaSwap DEX**: Native AMM constant-product liquidity pools with 0.3% LP incentives.
- **GreenDAO Governance**: Quadratic voting, 10M OEN treasury allocations, and climate validator subsidies.
- **CarbonX ESG Credits**: Verified carbon offset registry with retirement proofs.
- **Oenexa Cortex**: Green Data Center AI Grid, CaaS GPU compute leasing, and tokenized Tier-4 infrastructure bonds.
- **D-Commerce**: Zero-commission physical delivery escrow & merchant POS with 2FA cryptographic QR verification.
- **RPC Console**: Interactive JSON-RPC 2.0 debugging terminal for developers.

---

## Directory Structure & File Naming Conventions

This project strictly adheres to modern React 18 and TypeScript naming standards (distinct from the Go backend naming rules in `oenexa-node`):

```
oenexa-frontend/
├── Dockerfile                  # Multi-stage container build (Node -> Nginx Alpine)
├── package.json                # Dependencies, scripts, and package metadata
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler and test runner configuration
├── src/
│   ├── main.tsx                # Application bootstrap entrypoint
│   ├── App.tsx                 # Root layout & state provider
│   ├── App.css                 # Global modern theme styling (Dark/Light mode)
│   ├── components/             # React UI components (PascalCase.tsx)
│   │   ├── Header.tsx          # Network status, RPC selector, theme toggle
│   │   ├── Tabs.tsx            # Main navigation switcher
│   │   ├── DashboardTab.tsx    # Node metrics & real-time telemetry
│   │   ├── ExplorerTab.tsx     # Block & transaction inspector
│   │   ├── WalletTab.tsx       # Post-quantum key generation & transfer
│   │   ├── ShieldedTab.tsx     # Dual-pool privacy note manager
│   │   ├── DexTab.tsx          # OenexaSwap AMM liquidity pool
│   │   ├── GreenDaoTab.tsx     # Climate governance & quadratic voting
│   │   ├── CarbonXTab.tsx      # ESG carbon offset tokenization
│   │   ├── CortexTab.tsx       # Green AI compute grid & CaaS leasing
│   │   ├── DCommerceTab.tsx    # Zero-commission physical delivery escrow
│   │   └── RpcConsoleTab.tsx   # JSON-RPC terminal & live testbed
│   ├── services/               # API & RPC client services (camelCase.ts)
│   │   └── rpcClient.ts        # Typed JSON-RPC 2.0 client
│   ├── types/                  # TypeScript interface definitions (camelCase.ts)
│   │   └── rpc.ts              # Blockchain & RPC data structures
│   └── test/                   # Automated Vitest test suite (*.test.tsx / *.test.ts)
│       ├── setup.ts            # Testing library matchers setup
│       ├── components.test.tsx # Component rendering & user interaction tests
│       └── rpcClient.test.ts   # RPC client network & serialization tests
```

### Conventions Summary
- **React Components**: `PascalCase.tsx` (e.g., `Header.tsx`, `CortexTab.tsx`).
- **Services & Modules**: `camelCase.ts` (e.g., `rpcClient.ts`).
- **Type Definitions**: `camelCase.ts` (e.g., `rpc.ts`).
- **Tests**: `*.test.tsx` or `*.test.ts` placed under `src/test/`.
- **CSS / Styles**: `kebab-case` for CSS class names with CSS variables for dynamic theming.

---

## Quickstart

### 1. Local Development
```bash
# Install dependencies
npm install

# Run dev server with hot reload (runs at http://localhost:5173)
npm run dev
```

### 2. Run Tests
```bash
npm test
```

### 3. Production Build
```bash
npm run build
```

### 4. Run with Docker
```bash
# Build the container
docker build -t oenexa-frontend:latest .

# Run the container (maps to http://localhost:3000)
docker run -d -p 3000:80 --name oenexa-frontend oenexa-frontend:latest
```

---

## Environment & Connection

The frontend connects by default to `http://127.0.0.1:8545` for JSON-RPC 2.0 and `/api/status`. You can change the target RPC endpoint directly within the web UI header or pass standard environment variables.

---

## License

Licensed under the [MIT License](LICENSE).
