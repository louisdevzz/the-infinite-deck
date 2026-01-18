# The Infinite Deck - Move Smart Contracts

A decentralized card battle game built on Sui blockchain with quadratic random distribution, auto-matchmaking, and integrated player profiles.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Account Setup](#account-setup)
- [Building](#building)
- [Testing](#testing)
- [Deployment](#deployment)
- [Post-Deployment Setup](#post-deployment-setup)
- [Module Overview](#module-overview)
- [CLI Reference](#cli-reference)

---

## 🔧 Prerequisites

- **Sui CLI** (v1.53.2 or later)
- **Git**
- **Rust** (for building from source)

### Install Sui CLI

```bash
# Install via Homebrew (macOS)
brew install sui

# Or install from source
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

Verify installation:

```bash
sui --version
# Should output: sui 1.53.2 or later
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd the-infinite-deck/move/the-infinite-deck
```

---

## 👤 Account Setup

### 1. Create a New Wallet

```bash
# Generate a new keypair
sui client new-address ed25519

# This will output:
# Created new keypair and saved it to keystore.
# - address: 0xYOUR_ADDRESS
# - alias: YOUR_ALIAS
```

### 2. Switch to Testnet

```bash
# Add testnet environment
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443

# Switch to testnet
sui client switch --env testnet

# Verify current environment
sui client active-env
# Should output: testnet
```

### 3. Get Testnet SUI Tokens

**Option A: Discord Faucet**

1. Join [Sui Discord](https://discord.gg/sui)
2. Go to `#testnet-faucet` channel
3. Type: `!faucet YOUR_ADDRESS`

**Option B: Web Faucet**

```bash
# Request tokens via CLI
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "YOUR_ADDRESS"
    }
}'
```

**Option C: Sui CLI**

```bash
sui client faucet
```

### 4. Verify Balance

```bash
sui client gas

# Output:
# ╭────────────────────────────────────────────────────────────────────┬────────────╮
# │ gasCoinId                                                          │ gasBalance │
# ├────────────────────────────────────────────────────────────────────┼────────────┤
# │ 0x...                                                              │ 1000000000 │
# ╰────────────────────────────────────────────────────────────────────┴────────────╯
```

---

## 🔨 Building

### Build the Package

```bash
sui move build
```

Expected output:

```
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING infinite_deck
```

### Check for Errors

If you see errors, check:

- Sui CLI version: `sui --version`
- Move.toml configuration
- Module dependencies

---

## 🧪 Testing

Run all tests:

```bash
sui move test
```

Run specific test:

```bash
sui move test test_name
```

Run with verbose output:

```bash
sui move test --verbose
```

---

## 🚀 Deployment

### 1. Deploy to Testnet

```bash
sui client publish --gas-budget 100000000
```

**Important:** Save the output! You'll need:

- **Package ID**: `0x...` (the published package address)
- **Lobby Object ID**: Shared object created in `matchmaking::init`
- **Transaction Digest**: For verification

Example output:

```
Transaction Digest: ABC123...
╭─────────────────────────────────────────────────────────────────────╮
│ Object Changes                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Created Objects:                                                    │
│  ┌──                                                                │
│  │ ObjectID: 0xLOBBY_ID                                            │
│  │ Sender: 0xYOUR_ADDRESS                                          │
│  │ Owner: Shared                                                    │
│  │ ObjectType: 0xPACKAGE_ID::matchmaking::Lobby                   │
│  └──                                                                │
│ Published Objects:                                                  │
│  ┌──                                                                │
│  │ PackageID: 0xPACKAGE_ID                                         │
│  │ Version: 1                                                       │
│  │ Digest: ...                                                      │
│  └──                                                                │
╰─────────────────────────────────────────────────────────────────────╯
```

### 2. Save Important IDs

Create a `.env` file or note these down:

```bash
export PACKAGE_ID="0x..."
export LOBBY_ID="0x..."
export RANDOM_ID="0x6"  # Sui Random object (fixed on testnet)
```

### 3. Verify Deployment

```bash
# View package
sui client object $PACKAGE_ID

# View lobby object
sui client object $LOBBY_ID
```

---

## ⚙️ Post-Deployment Setup

### 1. Create Your Player Profile

```bash
sui client call \
  --package $PACKAGE_ID \
  --module player_profile \
  --function create_profile_entry \
  --args "YourUsername" \
  --gas-budget 10000000
```

Save the **Profile Object ID** from the output.

### 2. Mint Your First Card

```bash
sui client call \
  --package $PACKAGE_ID \
  --module ai_forge \
  --function forge_card_entry \
  --args "Dragon" "Fire" "https://example.com/image.png" "0x6" \
  --gas-budget 10000000
```

### 3. Select Battle Deck

After minting 5 cards, select them for battle:

```bash
sui client call \
  --package $PACKAGE_ID \
  --module player_profile \
  --function select_battle_deck_entry \
  --args $PROFILE_ID $CARD1_ID $CARD2_ID $CARD3_ID $CARD4_ID $CARD5_ID \
  --gas-budget 10000000
```

### 4. Join Matchmaking

```bash
sui client call \
  --package $PACKAGE_ID \
  --module matchmaking \
  --function join_lobby \
  --args $LOBBY_ID $PROFILE_ID $CARD1_ID $CARD2_ID $CARD3_ID $CARD4_ID $CARD5_ID "0x6" \
  --gas-budget 10000000
```

---

## 📦 Module Overview

| Module                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `infinite-deck.move`    | Core battle system with elemental counters |
| `quadratic_random.move` | Quadratic distribution for power scores    |
| `ai_forge.move`         | Card minting with random stats             |
| `player_profile.move`   | Player stats + integrated deck management  |
| `matchmaking.move`      | Auto-matching lobby system                 |

---

## 📚 CLI Reference

### Common Commands

```bash
# View active address
sui client active-address

# List all addresses
sui client addresses

# Switch address
sui client switch --address ALIAS_OR_ADDRESS

# View objects owned by address
sui client objects

# View specific object
sui client object OBJECT_ID

# View transaction
sui client transaction DIGEST

# Call a function
sui client call \
  --package PACKAGE_ID \
  --module MODULE_NAME \
  --function FUNCTION_NAME \
  --args ARG1 ARG2 ... \
  --gas-budget AMOUNT
```

### Object Types

```bash
# View all objects of a specific type
sui client objects --filter "0xPACKAGE_ID::MODULE::STRUCT"

# Example: View all your cards
sui client objects --filter "0xPACKAGE_ID::game::Card"
```

### Gas Management

```bash
# View gas objects
sui client gas

# Merge gas coins
sui client merge-coin \
  --primary-coin COIN_ID \
  --coin-to-merge COIN_ID \
  --gas-budget 1000000

# Split gas coin
sui client split-coin \
  --coin-id COIN_ID \
  --amounts 1000000000 \
  --gas-budget 1000000
```

---

## 🔍 Debugging

### View Package Source

```bash
sui client verify-source --package-path . --network testnet
```

### View Events

```bash
# View events from a transaction
sui client events --tx-digest DIGEST

# Example: View match found events
sui client events --type "0xPACKAGE_ID::matchmaking::MatchFound"
```

### Dry Run Transaction

```bash
sui client call \
  --package $PACKAGE_ID \
  --module MODULE \
  --function FUNCTION \
  --args ... \
  --gas-budget 10000000 \
  --dry-run
```

---

## 🌐 Network Endpoints

### Testnet

- **RPC**: `https://fullnode.testnet.sui.io:443`
- **Faucet**: `https://faucet.testnet.sui.io/gas`
- **Explorer**: `https://suiscan.xyz/testnet`

### Mainnet

- **RPC**: `https://fullnode.mainnet.sui.io:443`
- **Explorer**: `https://suiscan.xyz/mainnet`

---

## 📖 Additional Resources

- [Sui Documentation](https://docs.sui.io/)
- [Sui CLI Reference](https://docs.sui.io/references/cli/client)
- [Move Language Book](https://move-language.github.io/move/)
- [Sui Examples](https://github.com/MystenLabs/sui/tree/main/examples)

---

## 🐛 Troubleshooting

### "Insufficient gas"

```bash
# Request more testnet tokens
sui client faucet
```

### "Package not found"

```bash
# Verify package ID
sui client object $PACKAGE_ID
```

### "Object not found"

```bash
# Check if you own the object
sui client objects | grep OBJECT_ID
```

### "Invalid transaction"

```bash
# Use dry-run to see error details
sui client call ... --dry-run
```

---

## 📝 License

Apache-2.0

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ on Sui**
