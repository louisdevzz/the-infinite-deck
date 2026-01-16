# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

**The Infinite Deck** is a next-generation Tactical Card Game (TCG) on Sui Blockchain.

- **Move Smart Contract** (`/move/`): Contains the Sui Move packages responsible for:
  - **Card Minting:** Handling logic for the AI Forge, VRF integration, and stats generation.
  - **Battle Logic:** Implementing the 1vs1 combat mechanics, elemental counters, and damage formulas.
  - **Evolution:** Managing card EXP, levels, and mutable object updates.
- **React UI** (`/ui/`): Frontend dApp built with React, TypeScript, Vite, and Sui dApp Kit. Handles:
  - **AI Forge UI:** Interface for users to input prompts and view generated cards.
  - **Battle Arena:** Interactive board for playing the card game.
  - **Inventory:** Viewing and managing user cards and decks.

## Common Commands

### Move Package Development

```bash
# Navigate to Move package directory
# Note: Locate the actual package directory within /move/ (e.g., /move/infinite_deck or /move/hello_world)
cd move/<package_name>

# Build the Move package
sui move build

# Publish to testnet (requires Sui CLI setup and wallet funding)
sui client publish --gas-budget 100000000

# Run Move tests
sui move test
```

### Frontend Development

```bash
# Navigate to UI directory
cd ui

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run Linting
pnpm lint
```

## Key Architecture Patterns

### TCG Mechanics (The Infinite Deck)

- **AI Forge:**
  - **Prompt:** User input drives the theme.
  - **VRF (Verifiable Random Function):** Determines **Rarity** and **Total Base Stats** on-chain ensuring fairness.
  - **Sanitation:** Verification ensuring stats do not exceed the 10,000 hard cap.
- **Battle System:**
  - 1vs1 format with 5-card decks.
  - **Elemental Counters:** Fire > Nature > Water > Fire; Light <> Dark.
  - **Damage Formula:** `(ATK_A * Multiplier) - DEF_B`.
- **Evolution:** Cards accumulate EXP and receive permanent stat boosts (Sui Mutable Objects).

### Technical Integration

- **Sui Dynamic Fields:** Used for extensible metadata (battle history, equipment).
- **Walrus Storage:** Decentralized storage for AI-generated card visual assets.
- **zkLogin:** Web2-friendly authentication (Google login).

### Economy (The Sanctuary Economy)

- **Recycle/Burn:** "Crush" weak cards to receive resources from The Vault.
- **Anti-Inflation:** Mechanism to regulate NFT supply and maintain floor prices.

## Prerequisites

- Sui CLI installed and configured.
- Node.js & pnpm.
- Active Sui address with tokens (for Testnet/Mainnet).
