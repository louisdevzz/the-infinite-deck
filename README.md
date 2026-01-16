# The Infinite Deck

## 1. Project Summary

**The Infinite Deck** is a next-generation Tactical Card Game (TCG) built on the **Sui Blockchain**. Unlike traditional games where cards are issued by the developer, The Infinite Deck empowers players to use **Generative AI** to "forge" (mint) unique warriors from natural language.

The project combines the power of **Sui Dynamic NFTs** to create cards capable of evolution, along with a deep combat mechanism based on elemental counters and RPG stats (Health, Attack, Defense), delivering a tactical experience that is infinite and never repetitive.

## 2. The Problem

- **Stale Meta:** Current card games (like Yu-Gi-Oh! or Hearthstone) often suffer from a "Stale Meta" where players just copy the strongest decks, lacking creativity.
- **Static Assets:** NFTs in GameFi are typically static images that do not change value or appearance based on gameplay.
- **Inflation:** Old "Play-to-Earn" games often collapse due to an oversupply of NFTs without reasonable burn mechanisms.

## 3. Solution & Game Mechanics

### 3.1. The AI Forge

Players enter a prompt to create a card. The system combines AI + Randomness (VRF) to generate a **Sui Object**.

The card creation system tightly integrates **AI Creativity** and **Blockchain Authenticity (Sui VRF)** to ensure absolute fairness:

- **Input:** Player enters a Prompt describing their desire (e.g., _"Fire Samurai Warrior"_).
- **Verifiable Randomness ([Sui VRF](https://docs.sui.io/guides/developer/cryptography/ecvrf)):** Before the AI acts, the Smart Contract uses a Verifiable Random Function (VRF) to determine the **Rarity** and **Total Base Stats** of the card. Players cannot use language to manipulate power levels.
  - _Common:_ Total Stats ~ 2,000 - 4,000.
  - _Legendary:_ Total Stats ~ 8,000 - 10,000.
- **AI Generation & Sanitation:** The AI system receives the VRF result and player Prompt to distribute detailed stats and determine the Element:
  - **Stats Limit:** All stats (HP, ATK, DEF) are hard-capped at **10,000**. Any attempts at "Prompt Injection" (e.g., "create card with 1 million HP") will be rejected by the AI and automatically adjusted to the allowed limit for that rarity.
  - **Element Determination:** AI analyzes semantics to assign a suitable element (e.g., "Fire Samurai" -> Fire Element).
  - **Visuals:** Generates unique corresponding imagery.

### 3.2. New Combat Mechanics

The game applies a 1vs1 competitive card battle format with deep tactical depth:

- **Setup:** Each player enters battle with **05 Cards**.
- **Win Condition:** Destroy all 5 of the opponent's cards.
- **Battle Flow:**
  1. Both sides play 1 card to the field.
  2. Compare **Elemental Types** to determine the advantage (Multiplier).
     - 🔥 Fire beats Nature
     - 🌳 Nature beats Water
     - 💧 Water beats Fire
     - ☀️ Light & 🌑 Dark counter each other (Deal massive damage to each other).
  3. **Damage Calculation:**
     $$Damage = (ATK_{A} \times Multiplier) - DEF_{B}$$
  4. **HP Deduction:** The attacked card loses HP. If HP < 0, the card is destroyed and sent to the Graveyard.

### 3.3. Dynamic Evolution

Utilizing **Sui Mutable Objects** technology:

- Cards that win many battles accumulate EXP.
- Upon reaching sufficient levels, cards receive permanent on-chain **Stat Boosts**.

## 4. Technical Architecture

The project maximizes **Native** features of Sui:

- **Sui Move Objects:** Each card is a distinct Object containing Metadata (HP, Atk, Def, Image URL).
- **Sui Dynamic Fields:** Used to store battle history and attached equipment (if any) without needing to mint a new NFT.
- **zkLogin:** Helps Web2 players login easily via Google to start forging cards immediately.
- **Walrus (Decentralized Storage):** Stores AI-generated card images, ensuring decentralization and lower costs compared to AWS/IPFS.

## 5. Sustainable Economy

To address inflation, The Infinite Deck applies **"The Sanctuary Economy"** model:

- **Recycle Mechanism:** Players can "crush" (Burn) weak or unused cards.
- **The Vault:** In exchange, they receive resources from the **Reserve Vault** (Game revenue reserve) or materials to forge better new cards.
  > This helps reduce the card supply in the market and establishes a Floor Price for NFTs.

## 6. Development Roadmap

- **Phase 1: The Genesis (Hackathon Sprint)**
  - Complete Smart Contract for Minting Cards (AI Forge) and Battle Logic (Damage Calc, HP Deduction).
  - Build Frontend Demo for card creation and basic 1vs1 battle.
- **Phase 2: The Awakening**
  - Integrate Evolution system and Leveling.
  - Launch Marketplace (Sui Kiosk) for card trading.
- **Phase 3: The Infinite War**
  - Organize Ranked PvP tournaments.
  - Expand Guild system and Raid Bosses.

## 7. Conclusion

**The Infinite Deck** is not just a game, but an infinite content creation platform. By combining deep RPG combat mechanics with Generative AI on Sui's superior processing speed, we are confident in delivering a truly breakthrough "First Mover" experience for the ecosystem.
