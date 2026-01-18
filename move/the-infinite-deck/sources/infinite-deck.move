// Copyright (c) The Infinite Deck Contributors
// SPDX-License-Identifier: Apache-2.0

/// The Infinite Deck - A Tactical Card Game on Sui Blockchain
/// 
/// This module implements a 1vs1 turn-based card battle game with:
/// - 5-card decks per player
/// - Elemental counter system (Fire > Plant > Water > Fire; Light <> Dark)
/// - Turn-based combat with simultaneous card selection
/// - Damage calculation with ATK, DEF, and elemental multipliers
/// - Win condition: Destroy all 5 opponent cards
module infinite_deck::game {
    use std::string::{Self, String};
    use sui::event;
    use sui::random::{Self, Random};
    use infinite_deck::player_profile;

    // ==================== Error Codes ====================
    
    const EInvalidStats: u64 = 1;
    const EStatsExceedCap: u64 = 2;
    const EInvalidDeckSize: u64 = 3;
    const ENotCardOwner: u64 = 4;
    const ECardInBattle: u64 = 5;
    const EInvalidBattlePhase: u64 = 6;
    const ENotPlayerInBattle: u64 = 7;
    const ECardAlreadySummoned: u64 = 8;
    const EBattleAlreadyEnded: u64 = 9;
    const ECardNotInDeck: u64 = 10;
    const EInvalidElement: u64 = 11;
    const ECardLockedInLobby: u64 = 12;

    // ==================== Constants ====================
    
    const MAX_STAT_VALUE: u64 = 10000;
    const DECK_SIZE: u64 = 5;
    
    // Battle Phases
    const PHASE_SETUP: u8 = 0;
    const PHASE_SUMMON: u8 = 1;
    const PHASE_REVEAL: u8 = 2;
    const PHASE_COMBAT: u8 = 3;
    const PHASE_RESOLUTION: u8 = 4;
    
    // Elements
    const ELEMENT_FIRE: u8 = 0;
    const ELEMENT_WATER: u8 = 1;
    const ELEMENT_PLANT: u8 = 2;
    const ELEMENT_LIGHT: u8 = 3;
    const ELEMENT_DARK: u8 = 4;

    // ==================== Structs ====================

    /// Represents a card NFT with mutable battle stats
    public struct Card has key, store {
        id: UID,
        name: String,
        element: u8,              // For battle logic (0-4)
        element_name: String,     // For display ("Fire", "Water", etc.)
        rarity: u8,               // 0=Common, 1=Uncommon, 2=Epic, 3=Legendary
        hp: u64,
        max_hp: u64,
        atk: u64,
        def: u64,
        power_score: u64,         // Original 0-2000 score from quadratic_random
        image_url: String,
        owner: address,
        in_battle: bool,
        locked_in_lobby: bool,    // Locked during matchmaking
    }

    /// Represents an active battle between two players
    public struct Battle has key {
        id: UID,
        player1: address,
        player2: address,
        player1_deck: vector<ID>,
        player2_deck: vector<ID>,
        player1_graveyard: vector<ID>,
        player2_graveyard: vector<ID>,
        player1_active_card: Option<ID>,
        player2_active_card: Option<ID>,
        current_phase: u8,
        round_number: u64,
        winner: Option<address>,
    }

    /// Capability to manage a battle (given to both players)
    public struct BattleCapability has key, store {
        id: UID,
        battle_id: ID,
        player: address,
    }

    // ==================== Events ====================

    public struct CardMinted has copy, drop {
        card_id: ID,
        owner: address,
        name: String,
        element: u8,
        element_name: String,
        rarity: u8,
        hp: u64,
        atk: u64,
        def: u64,
        power_score: u64,
    }

    public struct BattleCreated has copy, drop {
        battle_id: ID,
        player1: address,
        player2: address,
    }

    public struct CardSummoned has copy, drop {
        battle_id: ID,
        player: address,
        card_id: ID,
        round: u64,
    }

    public struct CardsRevealed has copy, drop {
        battle_id: ID,
        player1_card: ID,
        player2_card: ID,
        round: u64,
    }

    public struct CombatResolved has copy, drop {
        battle_id: ID,
        attacker: address,
        attacker_card: ID,
        defender_card: ID,
        damage_dealt: u64,
        defender_hp_remaining: u64,
        round: u64,
    }

    public struct CardDestroyed has copy, drop {
        battle_id: ID,
        card_id: ID,
        owner: address,
        round: u64,
    }

    public struct BattleEnded has copy, drop {
        battle_id: ID,
        winner: address,
        rounds_played: u64,
    }

    public struct InitiativeRolled has copy, drop {
        battle_id: ID,
        attacker: address,
        defender: address,
        attacker_is_player1: bool,
        round: u64,
    }

    // ==================== Card Management ====================

    /// Mint a new card with specified stats
    /// Stats are validated to not exceed MAX_STAT_VALUE
    public fun mint_card(
        name: String,
        element: u8,
        element_name: String,
        rarity: u8,
        hp: u64,
        atk: u64,
        def: u64,
        power_score: u64,
        image_url: String,
        ctx: &mut TxContext
    ): Card {
        // Validate element
        assert!(element <= ELEMENT_DARK, EInvalidElement);
        
        // Validate stats don't exceed cap
        assert!(hp <= MAX_STAT_VALUE, EStatsExceedCap);
        assert!(atk <= MAX_STAT_VALUE, EStatsExceedCap);
        assert!(def <= MAX_STAT_VALUE, EStatsExceedCap);
        assert!(hp > 0, EInvalidStats);

        let card_uid = object::new(ctx);
        let card_id = object::uid_to_inner(&card_uid);
        let owner = ctx.sender();

        event::emit(CardMinted {
            card_id,
            owner,
            name,
            element,
            element_name,
            rarity,
            hp,
            atk,
            def,
            power_score,
        });

        Card {
            id: card_uid,
            name,
            element,
            element_name,
            rarity,
            hp,
            max_hp: hp,
            atk,
            def,
            power_score,
            image_url,
            owner,
            in_battle: false,
            locked_in_lobby: false,
        }
    }

    /// Transfer card to another address
    public fun transfer_card(card: Card, recipient: address) {
        assert!(!card.in_battle, ECardInBattle);
        assert!(!card.locked_in_lobby, ECardLockedInLobby);
        transfer::public_transfer(card, recipient);
    }

    /// Get card information (read-only)
    public fun get_card_info(card: &Card): (String, u8, String, u8, u64, u64, u64, u64, u64, address) {
        (card.name, card.element, card.element_name, card.rarity, card.hp, card.max_hp, card.atk, card.def, card.power_score, card.owner)
    }

    /// Get card display info
    public fun get_card_display(card: &Card): (String, String, String) {
        (card.name, card.element_name, card.image_url)
    }

    // ==================== Battle Initialization ====================

    /// Create a new battle between two players
    /// Both players must provide exactly 5 cards
    public fun create_battle(
        player1_cards: vector<ID>,
        player2: address,
        player2_cards: vector<ID>,
        ctx: &mut TxContext
    ): (Battle, BattleCapability, BattleCapability) {
        let player1 = ctx.sender();
        
        // Validate deck sizes
        assert!(player1_cards.length() == DECK_SIZE, EInvalidDeckSize);
        assert!(player2_cards.length() == DECK_SIZE, EInvalidDeckSize);

        let battle_uid = object::new(ctx);
        let battle_id = object::uid_to_inner(&battle_uid);

        event::emit(BattleCreated {
            battle_id,
            player1,
            player2,
        });

        let battle = Battle {
            id: battle_uid,
            player1,
            player2,
            player1_deck: player1_cards,
            player2_deck: player2_cards,
            player1_graveyard: vector::empty(),
            player2_graveyard: vector::empty(),
            player1_active_card: option::none(),
            player2_active_card: option::none(),
            current_phase: PHASE_SUMMON,
            round_number: 1,
            winner: option::none(),
        };

        let cap1 = BattleCapability {
            id: object::new(ctx),
            battle_id,
            player: player1,
        };

        let cap2 = BattleCapability {
            id: object::new(ctx),
            battle_id,
            player: player2,
        };

        (battle, cap1, cap2)
    }

    /// Share a battle object (must be called from the game module)
    /// This allows other modules to create and share battles
    public fun share_battle(battle: Battle) {
        transfer::share_object(battle);
    }

    // ==================== Battle Phases ====================

    /// Phase 1: Summon a card face-down (blind selection)
    public fun summon_card(
        battle: &mut Battle,
        cap: &BattleCapability,
        card_id: ID,
        ctx: &TxContext
    ) {
        assert!(battle.current_phase == PHASE_SUMMON, EInvalidBattlePhase);
        assert!(battle.winner.is_none(), EBattleAlreadyEnded);
        
        let player = ctx.sender();
        assert!(cap.player == player, ENotPlayerInBattle);
        assert!(object::id_to_address(&cap.battle_id) == object::id_to_address(&object::uid_to_inner(&battle.id)), ENotPlayerInBattle);

        if (player == battle.player1) {
            assert!(battle.player1_active_card.is_none(), ECardAlreadySummoned);
            assert!(vector::contains(&battle.player1_deck, &card_id), ECardNotInDeck);
            battle.player1_active_card = option::some(card_id);
        } else if (player == battle.player2) {
            assert!(battle.player2_active_card.is_none(), ECardAlreadySummoned);
            assert!(vector::contains(&battle.player2_deck, &card_id), ECardNotInDeck);
            battle.player2_active_card = option::some(card_id);
        } else {
            abort ENotPlayerInBattle
        };

        event::emit(CardSummoned {
            battle_id: object::uid_to_inner(&battle.id),
            player,
            card_id,
            round: battle.round_number,
        });

        // If both players have summoned, move to reveal phase
        if (battle.player1_active_card.is_some() && battle.player2_active_card.is_some()) {
            battle.current_phase = PHASE_REVEAL;
        };
    }

    /// Phase 2: Reveal both cards (automatic when both summoned)
    /// This is called internally after both players summon
    fun reveal_cards(battle: &mut Battle) {
        assert!(battle.current_phase == PHASE_REVEAL, EInvalidBattlePhase);
        assert!(battle.player1_active_card.is_some(), EInvalidBattlePhase);
        assert!(battle.player2_active_card.is_some(), EInvalidBattlePhase);

        let p1_card = *battle.player1_active_card.borrow();
        let p2_card = *battle.player2_active_card.borrow();

        event::emit(CardsRevealed {
            battle_id: object::uid_to_inner(&battle.id),
            player1_card: p1_card,
            player2_card: p2_card,
            round: battle.round_number,
        });

        battle.current_phase = PHASE_COMBAT;
    }

    /// Phase 3a: Roll initiative to determine who attacks first
    /// Frontend should call this first to know the attacker
    /// Returns true if player1 attacks first, false if player2 attacks first
    public fun roll_initiative(
        battle: &Battle,
        r: &Random,
        ctx: &mut TxContext
    ): bool {
        // Can only roll initiative in REVEAL or COMBAT phase
        assert!(battle.current_phase == PHASE_REVEAL || battle.current_phase == PHASE_COMBAT, EInvalidBattlePhase);
        assert!(battle.winner.is_none(), EBattleAlreadyEnded);

        let mut generator = random::new_generator(r, ctx);
        let initiative = random::generate_u8_in_range(&mut generator, 0, 1);
        
        let attacker_is_player1 = initiative == 0;
        
        // Emit event for frontend
        event::emit(InitiativeRolled {
            battle_id: object::uid_to_inner(&battle.id),
            attacker: if (attacker_is_player1) { battle.player1 } else { battle.player2 },
            defender: if (attacker_is_player1) { battle.player2 } else { battle.player1 },
            attacker_is_player1,
            round: battle.round_number,
        });
        
        attacker_is_player1 // true = player1 attacks first, false = player2 attacks first
    }

    /// Phase 3b: Execute combat with predetermined attacker
    /// Frontend calls roll_initiative() first, then calls this with the result
    public fun execute_combat(
        battle: &mut Battle,
        card1: &mut Card,
        card2: &mut Card,
        attacker_is_player1: bool,
    ) {
        // Auto-reveal if needed
        if (battle.current_phase == PHASE_REVEAL) {
            reveal_cards(battle);
        };

        assert!(battle.current_phase == PHASE_COMBAT, EInvalidBattlePhase);
        assert!(battle.winner.is_none(), EBattleAlreadyEnded);

        let card1_id = object::id(card1);
        let card2_id = object::id(card2);

        // Verify these are the active cards
        assert!(battle.player1_active_card.is_some() && *battle.player1_active_card.borrow() == card1_id, EInvalidBattlePhase);
        assert!(battle.player2_active_card.is_some() && *battle.player2_active_card.borrow() == card2_id, EInvalidBattlePhase);

        // Determine attacker/defender based on initiative result
        let (attacker, defender, attacker_card, defender_card, attacker_addr, defender_addr) = 
            if (attacker_is_player1) {
                (card1, card2, card1_id, card2_id, battle.player1, battle.player2)
            } else {
                (card2, card1, card2_id, card1_id, battle.player2, battle.player1)
            };

        // First attack
        let damage1 = calculate_damage(attacker.atk, attacker.element, defender.def, defender.element);
        apply_damage(defender, damage1);

        event::emit(CombatResolved {
            battle_id: object::uid_to_inner(&battle.id),
            attacker: attacker_addr,
            attacker_card,
            defender_card,
            damage_dealt: damage1,
            defender_hp_remaining: defender.hp,
            round: battle.round_number,
        });

        // Counter-attack if defender still alive
        if (defender.hp > 0) {
            let damage2 = calculate_damage(defender.atk, defender.element, attacker.def, attacker.element);
            apply_damage(attacker, damage2);

            event::emit(CombatResolved {
                battle_id: object::uid_to_inner(&battle.id),
                attacker: defender_addr,
                attacker_card: defender_card,
                defender_card: attacker_card,
                damage_dealt: damage2,
                defender_hp_remaining: attacker.hp,
                round: battle.round_number,
            });
        };

        battle.current_phase = PHASE_RESOLUTION;
    }

    /// Phase 4: Resolve round outcome
    public fun resolve_round(
        battle: &mut Battle,
        card1: &mut Card,
        card2: &mut Card,
    ) {
        assert!(battle.current_phase == PHASE_RESOLUTION, EInvalidBattlePhase);

        let card1_id = object::id(card1);
        let card2_id = object::id(card2);
        let battle_id = object::uid_to_inner(&battle.id);

        let card1_dead = card1.hp == 0;
        let card2_dead = card2.hp == 0;

        // Handle card deaths
        if (card1_dead) {
            // Remove from deck, add to graveyard
            let (exists, idx) = vector::index_of(&battle.player1_deck, &card1_id);
            if (exists) {
                vector::remove(&mut battle.player1_deck, idx);
            };
            vector::push_back(&mut battle.player1_graveyard, card1_id);
            battle.player1_active_card = option::none();
            card1.in_battle = false;

            event::emit(CardDestroyed {
                battle_id,
                card_id: card1_id,
                owner: battle.player1,
                round: battle.round_number,
            });
        };

        if (card2_dead) {
            let (exists, idx) = vector::index_of(&battle.player2_deck, &card2_id);
            if (exists) {
                vector::remove(&mut battle.player2_deck, idx);
            };
            vector::push_back(&mut battle.player2_graveyard, card2_id);
            battle.player2_active_card = option::none();
            card2.in_battle = false;

            event::emit(CardDestroyed {
                battle_id,
                card_id: card2_id,
                owner: battle.player2,
                round: battle.round_number,
            });
        };

        // Check win condition
        if (battle.player1_deck.is_empty()) {
            battle.winner = option::some(battle.player2);
            event::emit(BattleEnded {
                battle_id,
                winner: battle.player2,
                rounds_played: battle.round_number,
            });
            return
        };

        if (battle.player2_deck.is_empty()) {
            battle.winner = option::some(battle.player1);
            event::emit(BattleEnded {
                battle_id,
                winner: battle.player1,
                rounds_played: battle.round_number,
            });
            return
        };

        // Both cards dead or both alive - clear active cards and prepare for next round
        if (card1_dead || card2_dead) {
            battle.player1_active_card = option::none();
            battle.player2_active_card = option::none();
        };

        // Move to next round
        battle.round_number = battle.round_number + 1;
        battle.current_phase = PHASE_SUMMON;
    }

    /// Resolve round and update player profiles (optional)
    /// Use this version when you want to track battle results in player profiles
    public fun resolve_round_with_profiles(
        battle: &mut Battle,
        card1: &mut Card,
        card2: &mut Card,
        profile1: &mut player_profile::PlayerProfile,
        profile2: &mut player_profile::PlayerProfile,
    ) {
        use infinite_deck::player_profile;
        
        // First resolve the round normally
        resolve_round(battle, card1, card2);
        
        // If battle ended, update profiles
        if (battle.winner.is_some()) {
            let battle_id = object::uid_to_inner(&battle.id);
            let winner = *battle.winner.borrow();
            
            if (winner == battle.player1) {
                player_profile::record_win(profile1, battle_id);
                player_profile::record_loss(profile2, battle_id);
            } else {
                player_profile::record_win(profile2, battle_id);
                player_profile::record_loss(profile1, battle_id);
            };
        };
    }

    /// Surrender the battle
    public fun surrender(
        battle: &mut Battle,
        cap: &BattleCapability,
        ctx: &TxContext
    ) {
        let player = ctx.sender();
        assert!(cap.player == player, ENotPlayerInBattle);
        assert!(object::id_to_address(&cap.battle_id) == object::id_to_address(&object::uid_to_inner(&battle.id)), ENotPlayerInBattle);
        assert!(battle.winner.is_none(), EBattleAlreadyEnded);

        let winner = if (player == battle.player1) {
            battle.player2
        } else {
            battle.player1
        };

        battle.winner = option::some(winner);
        
        event::emit(BattleEnded {
            battle_id: object::uid_to_inner(&battle.id),
            winner,
            rounds_played: battle.round_number,
        });
    }

    /// Surrender and update player profiles
    public entry fun surrender_with_profiles(
        battle: &mut Battle,
        cap: &BattleCapability,
        profile1: &mut player_profile::PlayerProfile,
        profile2: &mut player_profile::PlayerProfile,
        ctx: &TxContext
    ) {
        surrender(battle, cap, ctx);

        let battle_id = object::uid_to_inner(&battle.id);
        let winner = *battle.winner.borrow();
        
        if (winner == battle.player1) {
            player_profile::record_win(profile1, battle_id);
            player_profile::record_loss(profile2, battle_id);
        } else {
            player_profile::record_win(profile2, battle_id);
            player_profile::record_loss(profile1, battle_id);
        };
    }

    // ==================== Helper Functions ====================

    /// Calculate damage based on ATK, DEF, and elemental multipliers
    fun calculate_damage(atk: u64, atk_element: u8, def: u64, def_element: u8): u64 {
        let multiplier = get_element_multiplier(atk_element, def_element);
        let raw_damage = (atk * multiplier) / 100; // Multiplier is in percentage (100 = 1.0x)
        
        if (raw_damage > def) {
            raw_damage - def
        } else {
            0
        }
    }

    /// Apply damage to a card, reducing HP (minimum 0)
    fun apply_damage(card: &mut Card, damage: u64) {
        if (damage >= card.hp) {
            card.hp = 0;
        } else {
            card.hp = card.hp - damage;
        };
    }

    /// Get elemental multiplier (in percentage, 100 = 1.0x)
    /// Fire > Plant (150%), Plant > Water (150%), Water > Fire (150%)
    /// Light <> Dark (200% both ways)
    fun get_element_multiplier(attacker: u8, defender: u8): u64 {
        // Fire vs Plant
        if (attacker == ELEMENT_FIRE && defender == ELEMENT_PLANT) {
            return 150
        };
        // Plant vs Water
        if (attacker == ELEMENT_PLANT && defender == ELEMENT_WATER) {
            return 150
        };
        // Water vs Fire
        if (attacker == ELEMENT_WATER && defender == ELEMENT_FIRE) {
            return 150
        };
        // Light vs Dark
        if (attacker == ELEMENT_LIGHT && defender == ELEMENT_DARK) {
            return 200
        };
        // Dark vs Light
        if (attacker == ELEMENT_DARK && defender == ELEMENT_LIGHT) {
            return 200
        };
        // Weak matchups (reverse of strong)
        if (attacker == ELEMENT_FIRE && defender == ELEMENT_WATER) {
            return 50
        };
        if (attacker == ELEMENT_PLANT && defender == ELEMENT_FIRE) {
            return 50
        };
        if (attacker == ELEMENT_WATER && defender == ELEMENT_PLANT) {
            return 50
        };
        
        // Neutral (same element or no counter)
        100
    }

    /// Restore card HP to max (for testing/healing mechanics)
    public fun heal_card(card: &mut Card) {
        card.hp = card.max_hp;
    }

    // ==================== View Functions ====================

    public fun get_battle_info(battle: &Battle): (address, address, u64, u8, Option<address>) {
        (battle.player1, battle.player2, battle.round_number, battle.current_phase, battle.winner)
    }

    public fun get_deck_size(battle: &Battle, player: address): u64 {
        if (player == battle.player1) {
            battle.player1_deck.length()
        } else if (player == battle.player2) {
            battle.player2_deck.length()
        } else {
            0
        }
    }

    public fun get_graveyard_size(battle: &Battle, player: address): u64 {
        if (player == battle.player1) {
            battle.player1_graveyard.length()
        } else if (player == battle.player2) {
            battle.player2_graveyard.length()
        } else {
            0
        }
    }

    // ==================== Helper Functions ====================

    /// Convert element string to u8 for battle logic
    public fun element_string_to_u8(element: String): u8 {
        if (element == string::utf8(b"Fire")) { ELEMENT_FIRE }
        else if (element == string::utf8(b"Water")) { ELEMENT_WATER }
        else if (element == string::utf8(b"Plant")) { ELEMENT_PLANT }
        else if (element == string::utf8(b"Light")) { ELEMENT_LIGHT }
        else if (element == string::utf8(b"Dark")) { ELEMENT_DARK }
        else { ELEMENT_FIRE } // Default to Fire
    }

    /// Convert u8 to element string for display
    public fun element_u8_to_string(element: u8): String {
        if (element == ELEMENT_FIRE) { string::utf8(b"Fire") }
        else if (element == ELEMENT_WATER) { string::utf8(b"Water") }
        else if (element == ELEMENT_PLANT) { string::utf8(b"Plant") }
        else if (element == ELEMENT_LIGHT) { string::utf8(b"Light") }
        else if (element == ELEMENT_DARK) { string::utf8(b"Dark") }
        else { string::utf8(b"Fire") }
    }

    /// Get border color based on rarity
    public fun get_border_color(rarity: u8): String {
        if (rarity == 0) { string::utf8(b"green") }      // Common
        else if (rarity == 1) { string::utf8(b"blue") }  // Uncommon
        else if (rarity == 2) { string::utf8(b"purple") } // Epic
        else { string::utf8(b"gold") }                    // Legendary
    }

    /// Lock card for matchmaking (used by matchmaking module)
    public fun lock_card_for_matchmaking(card: &mut Card) {
        assert!(!card.in_battle, ECardInBattle);
        card.locked_in_lobby = true;
    }

    /// Unlock card from matchmaking (used by matchmaking module)
    public fun unlock_card_from_matchmaking(card: &mut Card) {
        card.locked_in_lobby = false;
    }

    // ==================== Test Helpers ====================

    #[test_only]
    public fun create_test_card(
        name: String,
        element: u8,
        hp: u64,
        atk: u64,
        def: u64,
        ctx: &mut TxContext
    ): Card {
        let element_name = element_u8_to_string(element);
        mint_card(
            name, 
            element, 
            element_name,
            0, // rarity
            hp, 
            atk, 
            def, 
            hp + atk + def, // power_score
            string::utf8(b"test.png"),
            ctx
        )
    }

    #[test_only]
    public fun destroy_card_for_testing(card: Card) {
        let Card { 
            id, 
            name: _, 
            element: _, 
            element_name: _,
            rarity: _,
            hp: _, 
            max_hp: _, 
            atk: _, 
            def: _, 
            power_score: _,
            image_url: _, 
            owner: _, 
            in_battle: _,
            locked_in_lobby: _,
        } = card;
        object::delete(id);
    }

    #[test_only]
    public fun destroy_battle_for_testing(battle: Battle) {
        let Battle { 
            id, 
            player1: _, 
            player2: _, 
            player1_deck: _, 
            player2_deck: _, 
            player1_graveyard: _, 
            player2_graveyard: _,
            player1_active_card: _,
            player2_active_card: _,
            current_phase: _, 
            round_number: _, 
            winner: _ 
        } = battle;
        object::delete(id);
    }

    #[test_only]
    public fun destroy_capability_for_testing(cap: BattleCapability) {
        let BattleCapability { id, battle_id: _, player: _ } = cap;
        object::delete(id);
    }
}
