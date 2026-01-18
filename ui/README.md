# 🌆 CYBERPUNK SUI dApp

> A high-fidelity, decentralized trading interface on the **Sui Network**.

![Status](https://img.shields.io/badge/Status-Prototype-orange)
![Network](https://img.shields.io/badge/Network-Sui_Testnet-blue)
![License](https://img.shields.io/badge/License-MIT-green)

This project is a **Hackathon Prototype** focused on delivering a premium User Experience (UX) for Web3 gaming. It demonstrates advanced React patterns, seamless animations, and direct blockchain integration using the Sui TS SDK.

---

## 📸 Screenshots

| Marketplace Feed | Inventory System | Neural Forge |
|:---:|:---:|:---:|
| ![Marketplace](https://placehold.co/400x300/06090c/00e5ff?text=Market+Feed) | ![Inventory](https://placehold.co/400x300/06090c/ff00ff?text=Inventory+UI) | ![Forge](https://placehold.co/400x300/06090c/00e5ff?text=Crafting+Animation) |

---

## 🚀 Key Features

### 🏪 Marketplace (`/market`)
- **Real-time Filtering**: Sort items by Rarity (Legendary, Epic, Rare) and Element types.
- **Micro-interactions**: Hover effects, loading skeletons, and smooth card reveals.
- **Transaction Feedback**: Custom modal flows for purchase confirmation and error handling.

### 🎒 Inventory & Deck (`/inventory`)
- **Drag-like Logic**: Equip/Unequip cards between your Backpack and Combat Deck.
- **Contextual Feedback**: Global toast notifications for every state change (Capacity full, Item equipped).
- **Empty States**: Helpful visual cues when your inventory is empty.

### ⚔️ Neural Forge (`/chat`)
- **Immersive Crafting**: A chat-based interface to "forge" new cards.
- **Visual FX**: Glitch animations, text decoding, and holographic card generation sequences.
- **Sui Integration**: Direct calls to smart contracts (simulation).

---

## 🛠️ Technology Stack

| Layer | Technology | Usage |
|:---:|:---:|:---|
| **Frontend** | [React 19](https://react.dev/) | Core UI Framework |
| **Bundler** | [Vite](https://vitejs.dev/) | Fast HMR & Build |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling with custom animations |
| **UI Kit** | [Radix UI](https://www.radix-ui.com/) | Accessible primitives |
| **Blockchain** | [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit) | Wallet connection & RPC hooks |
| **State** | React Context + Query | Global Toast & Server State |

---

## ⚙️ Configuration & Smart Contracts

This repository contains the **Frontend** code. The dApp interacts with a specific Move Package on the Sui Testnet.

### 1. Contract Address
The current package ID is hardcoded in:
`src/constants.ts`

```typescript
export const TESTNET_HELLO_WORLD_PACKAGE_ID = "0x4e1cf62ae7d377c7404ac2a617598754a548a5de6a599f236a53603d5674d8b8";
```

> **Note**: If you deploy your own contract, update this value with your new Package ID.

### 2. Network Setting
The app is configured for **Sui Testnet** by default in `src/main.tsx`.

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Sui Wallet Extension installed in your browser

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd ghep/ui_tai
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Run Development Server**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to view the app.

---

## � Project Structure

```text
src/
├── components/         # Reusable UI components
│   ├── duel/           # Deck & Hand management components
│   ├── inventory/      # Backpack & ActiveDeck interfaces
│   └── shared/         # Common UI (Header, PageTransition)
├── context/            # React Contexts (Global Toast)
├── data/               # Mock Data & Type Definitions
├── layouts/            # Layout Wrappers (MainLayout)
├── pages/              # Application Routes
│   ├── chat/           # Neural Forge (Chat Interface)
│   ├── home/           # Landing Page
│   ├── inventory/      # Inventory & Loadout Management
│   └── market/         # Decentralized Marketplace
├── utils/              # Helper Functions (Card Styles, Formatting)
├── App.tsx             # Main App Router & Provider Setup
├── index.css           # Global Styles (Tailwind + Animations)
├── main.tsx            # Entry Point & Sui Client Config
└── networkConfig.ts    # Sui Network Configuration
```

---

## �👥 The Team

built with ❤️ by **Antigravity**

- **[Member Name]**: Frontend Engineer / UX
- **[Member Name]**: Smart Contract Developer
- **[Member Name]**: Design / Creative Lead

*(Update this section with your actual team members)*

---

## 📄 License

This project is licensed under the MIT License - see functionality details in source.
# ui_hackathon
