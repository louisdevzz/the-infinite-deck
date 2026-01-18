# The Infinite Deck - Move Smart Contract

A production-ready Sui Move smart contract for a tactical 1vs1 card battle game with elemental counters and turn-based combat.

## Features

- ✅ **Card NFTs** with mutable battle stats (HP, ATK, DEF)
- ✅ **5-Card Deck System** with graveyard management
- ✅ **Elemental Counter System** (Fire > Plant > Water > Fire; Light ↔ Dark)
- ✅ **Turn-Based Combat** with simultaneous card selection
- ✅ **Random Initiative** using Sui VRF
- ✅ **Damage Formula**: `(ATK × Multiplier) - DEF`
- ✅ **Win Condition**: Destroy all 5 opponent cards

## Game Flow

### Battle Phases

1. **Setup** - Players join with 5 cards each
2. **Summon** - Both players select a card face-down (blind)
3. **Reveal** - Cards are revealed simultaneously
4. **Combat** - Random initiative, attack + counter-attack
5. **Resolution** - Handle deaths, check win condition, next round

### Elemental Multipliers

| Attacker | Defender | Multiplier |
| -------- | -------- | ---------- |
| 🔥 Fire  | 🌳 Plant | **1.5x**   |
| 💧 Water | 🔥 Fire  | **1.5x**   |
| 🌳 Plant | 💧 Water | **1.5x**   |
| ☀️ Light | 🌑 Dark  | **2.0x**   |
| 🌑 Dark  | ☀️ Light | **2.0x**   |
| 🔥 Fire  | 💧 Water | **0.5x**   |
| 🌳 Plant | 🔥 Fire  | **0.5x**   |
| 💧 Water | 🌳 Plant | **0.5x**   |

## Building & Testing

```bash
# Build the package
sui move build

# Run tests
sui move test

# Publish to testnet
sui client publish --gas-budget 100000000
```

## Usage Examples

### Minting a Card

```move
use infinite_deck::game;

public fun mint_my_card(ctx: &mut TxContext) {
    let card = game::mint_card(
        string::utf8(b"Fire Dragon"),
        0, // ELEMENT_FIRE
        5000, // HP
        3000, // ATK
        2000, // DEF
        string::utf8(b"https://example.com/fire-dragon.png"),
        ctx
    );

    transfer::public_transfer(card, ctx.sender());
}
```

### Creating a Battle

```move
use infinite_deck::game;

public fun start_battle(
    player1_cards: vector<ID>, // Must be exactly 5 cards
    player2: address,
    player2_cards: vector<ID>, // Must be exactly 5 cards
    ctx: &mut TxContext
) {
    let (battle, cap1, cap2) = game::create_battle(
        player1_cards,
        player2,
        player2_cards,
        ctx
    );

    // Share battle object
    transfer::share_object(battle);

    // Give capabilities to players
    transfer::public_transfer(cap1, ctx.sender());
    transfer::public_transfer(cap2, player2);
}
```

### Playing a Round

```move
// Phase 1: Both players summon cards
game::summon_card(&mut battle, &cap, card_id, ctx);

// Phase 2: Reveal happens automatically when both summon

// Phase 3: Execute combat (requires Random object)
game::execute_combat(&mut battle, &mut card1, &mut card2, &random, ctx);

// Phase 4: Resolve round
game::resolve_round(&mut battle, &mut card1, &mut card2);
```

## Events

The contract emits events for all major actions:

- `CardMinted` - New card created
- `BattleCreated` - Battle initialized
- `CardSummoned` - Player selects a card
- `CardsRevealed` - Both cards revealed
- `CombatResolved` - Damage dealt
- `CardDestroyed` - Card sent to graveyard
- `BattleEnded` - Winner declared

## Error Codes

| Code | Error                  | Description                         |
| ---- | ---------------------- | ----------------------------------- |
| 1    | `EInvalidStats`        | HP must be > 0                      |
| 2    | `EStatsExceedCap`      | Stats must be ≤ 10,000              |
| 3    | `EInvalidDeckSize`     | Must have exactly 5 cards           |
| 4    | `ENotCardOwner`        | Only owner can transfer             |
| 5    | `ECardInBattle`        | Cannot transfer during battle       |
| 6    | `EInvalidBattlePhase`  | Action not allowed in current phase |
| 7    | `ENotPlayerInBattle`   | Only battle participants can act    |
| 8    | `ECardAlreadySummoned` | Cannot summon twice in same round   |
| 9    | `EBattleAlreadyEnded`  | Cannot act after battle ends        |
| 10   | `ECardNotInDeck`       | Must summon from your deck          |
| 11   | `EInvalidElement`      | Element must be 0-4                 |

## Architecture

### Structs

- `Card` - NFT with mutable battle stats
- `Battle` - Shared object tracking game state
- `BattleCapability` - Permission to act in a battle

### Key Functions

- `mint_card()` - Create new card NFT
- `create_battle()` - Initialize 1vs1 battle
- `summon_card()` - Select card face-down
- `execute_combat()` - Calculate damage and resolve attacks
- `resolve_round()` - Handle deaths and win conditions

## License

Apache-2.0

## Contributing

See the main project [README](../../README.md) for contribution guidelines.
