// Copyright (c) The Infinite Deck Contributors
// SPDX-License-Identifier: Apache-2.0

/// Player Profile System for The Infinite Deck
/// 
/// Tracks player statistics, battle history, and ranking points
module infinite_deck::player_profile {
    use std::string::{Self, String};
    use sui::event;
    use sui::table::{Self, Table};

    // ==================== Error Codes ====================
    
    const EProfileAlreadyExists: u64 = 200;
    const EProfileNotFound: u64 = 201;
    const EInvalidUsername: u64 = 202;
    const ENotProfileOwner: u64 = 203;
    const ECardNotInCollection: u64 = 204;
    const EInvalidDeckSize: u64 = 205;

    // ==================== Constants ====================
    
    const INITIAL_RANKING_POINTS: u64 = 1000;
    const WIN_POINTS: u64 = 25;
    const LOSS_POINTS: u64 = 15;

    // ==================== Structs ====================

    /// Player profile with statistics and deck
    public struct PlayerProfile has key {
        id: UID,
        player: address,
        username: String,
        total_battles: u64,
        wins: u64,
        losses: u64,
        cards_forged: u64,
        highest_power_card: u64,
        ranking_points: u64,
        created_at: u64,
        // Deck management (integrated)
        all_cards: vector<ID>,           // All cards owned by player
        selected_deck: vector<ID>,       // 5 cards selected for battle
    }

    /// Battle record for history tracking
    public struct BattleRecord has store, drop, copy {
        battle_id: ID,
        opponent: address,
        result: u8, // 0=loss, 1=win
        rounds_played: u64,
        timestamp: u64,
    }

    /// Battle history storage
    public struct BattleHistory has key {
        id: UID,
        player: address,
        battles: vector<BattleRecord>,
    }

    /// Global registry of profiles (optional, for leaderboard)
    public struct ProfileRegistry has key {
        id: UID,
        profiles: Table<address, ID>, // address -> ProfileID
    }

    // ==================== Events ====================

    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        player: address,
        username: String,
    }

    public struct BattleResultRecorded has copy, drop {
        player: address,
        battle_id: ID,
        result: u8,
        new_ranking_points: u64,
    }

    public struct CardForgedRecorded has copy, drop {
        player: address,
        power_score: u64,
        new_highest: u64,
    }

    // ==================== Profile Management ====================

    /// Create a new player profile
    public fun create_profile(
        username: String,
        ctx: &mut TxContext
    ): PlayerProfile {
        let player = ctx.sender();
        
        // Validate username (non-empty)
        assert!(username.length() > 0, EInvalidUsername);
        
        let profile_uid = object::new(ctx);
        let profile_id = object::uid_to_inner(&profile_uid);
        
        event::emit(ProfileCreated {
            profile_id,
            player,
            username,
        });
        
        PlayerProfile {
            id: profile_uid,
            player,
            username,
            total_battles: 0,
            wins: 0,
            losses: 0,
            cards_forged: 0,
            highest_power_card: 0,
            ranking_points: INITIAL_RANKING_POINTS,
            created_at: 0, // Could use Clock for timestamp
            all_cards: vector::empty(),
            selected_deck: vector::empty(),
        }
    }

    /// Create profile as entry function (transfers to sender)
    public entry fun create_profile_entry(
        username_bytes: vector<u8>,
        ctx: &mut TxContext
    ) {
        let username = string::utf8(username_bytes);
        let profile = create_profile(username, ctx);
        transfer::transfer(profile, ctx.sender());
    }

    /// Create battle history for a player
    public fun create_battle_history(ctx: &mut TxContext): BattleHistory {
        BattleHistory {
            id: object::new(ctx),
            player: ctx.sender(),
            battles: vector::empty(),
        }
    }

    // ==================== Battle Recording ====================

    /// Record a win for the player
    public fun record_win(profile: &mut PlayerProfile, battle_id: ID) {
        profile.total_battles = profile.total_battles + 1;
        profile.wins = profile.wins + 1;
        profile.ranking_points = profile.ranking_points + WIN_POINTS;
        
        event::emit(BattleResultRecorded {
            player: profile.player,
            battle_id,
            result: 1,
            new_ranking_points: profile.ranking_points,
        });
    }

    /// Record a loss for the player
    public fun record_loss(profile: &mut PlayerProfile, battle_id: ID) {
        profile.total_battles = profile.total_battles + 1;
        profile.losses = profile.losses + 1;
        
        // Prevent ranking points from going below 0
        if (profile.ranking_points >= LOSS_POINTS) {
            profile.ranking_points = profile.ranking_points - LOSS_POINTS;
        } else {
            profile.ranking_points = 0;
        };
        
        event::emit(BattleResultRecorded {
            player: profile.player,
            battle_id,
            result: 0,
            new_ranking_points: profile.ranking_points,
        });
    }

    /// Add battle to history
    public fun add_battle_to_history(
        history: &mut BattleHistory,
        battle_id: ID,
        opponent: address,
        result: u8,
        rounds_played: u64,
    ) {
        let record = BattleRecord {
            battle_id,
            opponent,
            result,
            rounds_played,
            timestamp: 0, // Could use Clock
        };
        
        vector::push_back(&mut history.battles, record);
    }

    // ==================== Card Forging ====================

    /// Record that a card was forged
    public fun record_card_forged(profile: &mut PlayerProfile, power_score: u64) {
        profile.cards_forged = profile.cards_forged + 1;
        
        // Update highest power card if needed
        if (power_score > profile.highest_power_card) {
            profile.highest_power_card = power_score;
            
            event::emit(CardForgedRecorded {
                player: profile.player,
                power_score,
                new_highest: power_score,
            });
        };
    }

    // ==================== View Functions ====================

    public fun get_profile_info(profile: &PlayerProfile): (address, String, u64, u64, u64, u64) {
        (profile.player, profile.username, profile.total_battles, profile.wins, profile.losses, profile.ranking_points)
    }

    public fun get_profile_owner(profile: &PlayerProfile): address {
        profile.player
    }

    public fun get_battle_deck(profile: &PlayerProfile): vector<ID> {
        profile.selected_deck
    }

    public fun get_win_rate(profile: &PlayerProfile): u64 {
        if (profile.total_battles == 0) {
            return 0
        };
        (profile.wins * 100) / profile.total_battles
    }

    public fun get_ranking_points(profile: &PlayerProfile): u64 {
        profile.ranking_points
    }

    public fun get_cards_forged(profile: &PlayerProfile): u64 {
        profile.cards_forged
    }

    public fun get_highest_power_card(profile: &PlayerProfile): u64 {
        profile.highest_power_card
    }

    public fun get_battle_history_count(history: &BattleHistory): u64 {
        history.battles.length()
    }

    // ==================== Update Functions ====================

    /// Add a card to player's collection
    public fun add_card_to_collection(
        profile: &mut PlayerProfile, 
        card_id: ID, 
        ctx: &TxContext
    ) {
        assert!(profile.player == ctx.sender(), ENotProfileOwner);
        
        if (!vector::contains(&profile.all_cards, &card_id)) {
            vector::push_back(&mut profile.all_cards, card_id);
        };
    }

    /// Select 5 cards for battle deck
    public fun select_battle_deck(
        profile: &mut PlayerProfile,
        card_ids: vector<ID>,
        ctx: &TxContext
    ) {
        assert!(profile.player == ctx.sender(), ENotProfileOwner);
        assert!(card_ids.length() == 5, EInvalidDeckSize);

        // Verify ownership
        let len = card_ids.length();
        let mut i = 0;
        while (i < len) {
            let id = *vector::borrow(&card_ids, i);
            assert!(vector::contains(&profile.all_cards, &id), ECardNotInCollection);
            i = i + 1;
        };

        profile.selected_deck = card_ids;
    }

    /// Update username
    public fun update_username(profile: &mut PlayerProfile, new_username: String) {
        assert!(new_username.length() > 0, EInvalidUsername);
        profile.username = new_username;
    }

    // ==================== Test Helpers ====================

    #[test_only]
    public fun create_test_profile(player: address, ctx: &mut TxContext): PlayerProfile {
        let profile_uid = object::new(ctx);
        PlayerProfile {
            id: profile_uid,
            player,
            username: string::utf8(b"TestPlayer"),
            total_battles: 0,
            wins: 0,
            losses: 0,
            cards_forged: 0,
            highest_power_card: 0,
            ranking_points: INITIAL_RANKING_POINTS,
            created_at: 0,
        }
    }

    #[test_only]
    public fun destroy_profile_for_testing(profile: PlayerProfile) {
        let PlayerProfile {
            id,
            player: _,
            username: _,
            total_battles: _,
            wins: _,
            losses: _,
            cards_forged: _,
            highest_power_card: _,
            ranking_points: _,
            created_at: _,
            all_cards: _,
            selected_deck: _,
        } = profile;
        object::delete(id);
    }

    #[test_only]
    public fun destroy_history_for_testing(history: BattleHistory) {
        let BattleHistory { id, player: _, battles: _ } = history;
        object::delete(id);
    }
}
