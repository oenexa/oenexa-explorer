# OENEXA Developer & AI Agent Strict Enforcement Policy 🛡️

> **MANDATORY POLICY FOR ALL HUMAN DEVELOPERS AND AI AGENTS (Antigravity, Cursor, Copilot, Claude, etc.)**  
> **EFFECTIVE DATE: IMMEDIATE — ZERO TOLERANCE FOR UNVERIFIED CODE**

This document defines the non-negotiable rules and quality gates for contributing to **`oenexa-explorer`**. Every developer and AI assistant operating in this codebase is strictly bound by these rules.

---

## 1. The Zero-Bug & 100% Verification Mandate

1. **No Code Without Verification**: Code must be cleanly typed, defensively written, and verified locally before submission.
2. **100% Build & Type Passing Rate**:
   - Zero TypeScript compilation errors.
   - Zero linter or build warnings.
   - React components must handle loading, empty, and RPC connection failure states gracefully.
3. **Optimized Bundle Production**:
   - Production build (`npm run build`) must pass without errors.

---

## 2. Mandatory Security & RPC Client Safety

Before modifying or adding code that interacts with the blockchain node:

1. **RPC Error Resilience**: Every call to the Web3 JSON-RPC endpoint must handle HTTP timeouts, node disconnections, and invalid JSON payloads without unhandled promise rejections.
2. **Read-Only Explorer Invariant**: This repository is strictly an explorer and client-side telemetry tool. Never bundle private keys, validator credentials, or consensus secrets into client assets.
3. **XSS & Injection Protection**: Sanitize all transaction hashes, addresses, and smart contract inputs before rendering in the DOM.

---

## 3. Strict Main Branch Gate (Pre-Push Enforcement)

**NO CODE MAY BE PUSHED TO THE `main` BRANCH WITHOUT PASSING THE VERIFICATION CHECKLIST:**

### Pre-Push Verification Commands:
```bash
# Must pass with 0 errors and generate clean dist/ bundles
npm run build
```

**AI Agent Rule**: If you are an AI assistant executing commands or proposing commits, you **MUST** run `npm run build` and verify a `0` exit code before executing `git push origin main`. Pushing failing code or skipping tests is a critical protocol violation.
