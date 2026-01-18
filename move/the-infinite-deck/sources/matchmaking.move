// Copyright (c) The Infinite Deck Contributors
// SPDX-License-Identifier: Apache-2.0

/// Matchmaking Lobby System
/// 
/// Implements "Empty Room" pattern:
/// - First player joins with their PlayerProfile and waits in lobby
/// - Second player auto-matches and creates game
/// - Initiative is pre-rolled at match creation
module infinite_deck::matchmaking {
    use std::option;
    use sui::event;
    use sui::random::{Self, Random};
    use infinite_deck::game::{Self, Card};
    use infinite_deck::player_profile::{Self, PlayerProfile};

    // ==================== Error Codes ====================
    
    const ENotInLobby: u64 = 300;
    const EProfileNotOwned: u64 = 301;

    // ==================== Structs ====================

    /// Global matchmaking lobby (Shared Object)
    /// Only holds one waiting player at a time
    public struct Lobby has key {
        id: UID,
        pending_player: Option<address>,
        pending_card_ids: Option<vector<ID>>,
        waiting_since: u64,
    }

    /// Game session created when match is found
    public struct GameSession has key {
        id: UID,
        battle_id: ID,
        player1: address,
        player2: address,
        player1_is_attacker: bool,  // Pre-rolled initiative
        created_at: u64,
    }

    // ==================== Events ====================

    public struct PlayerJoinedLobby has copy, drop {
        player: address,
        timestamp: u64,
    }

    public struct MatchFound has copy, drop {
        game_session_id: ID,
        battle_id: ID,
        player1: address,
        player2: address,
        player1_is_attacker: bool,
    }

    public struct MatchmakingCancelled has copy, drop {
        player: address,
    }

    // ==================== Initialization ====================

    /// Initialize the global lobby (one-time setup)
    fun init(ctx: &mut TxContext) {
        let lobby = Lobby {
            id: object::new(ctx),
            pending_player: option::none(),
            pending_card_ids: option::none(),
            waiting_since: 0,
        };
        transfer::share_object(lobby);
    }

    // ==================== Matchmaking Functions ====================

    /// Join matchmaking queue with your PlayerProfile
    /// If lobby empty: wait for opponent
    /// If lobby has player: create match immediately
    public entry fun join_lobby(
        lobby: &mut Lobby,
        profile: &mut PlayerProfile,
        card1: &mut Card,
        card2: &mut Card,
        card3: &mut Card,
        card4: &mut Card,
        card5: &mut Card,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let player = ctx.sender();
        
        // Verify profile ownership
        assert!(player_profile::get_profile_owner(profile) == player, EProfileNotOwned);
        
        // Get selected deck from profile
        let deck_card_ids = player_profile::get_battle_deck(profile);
        
        // Verify cards match deck
        assert!(object::id(card1) == deck_card_ids[0], EProfileNotOwned);
        assert!(object::id(card2) == deck_card_ids[1], EProfileNotOwned);
        assert!(object::id(card3) == deck_card_ids[2], EProfileNotOwned);
        assert!(object::id(card4) == deck_card_ids[3], EProfileNotOwned);
        assert!(object::id(card5) == deck_card_ids[4], EProfileNotOwned);
        
        // Check if lobby is empty
        if (lobby.pending_player.is_none()) {
            // First player - wait in lobby
            
            // Lock all cards
            game::lock_card_for_matchmaking(card1);
            game::lock_card_for_matchmaking(card2);
            game::lock_card_for_matchmaking(card3);
            game::lock_card_for_matchmaking(card4);
            game::lock_card_for_matchmaking(card5);
            
            // Store in lobby
            lobby.pending_player = option::some(player);
            lobby.pending_card_ids = option::some(deck_card_ids);
            lobby.waiting_since = 0;
            
            event::emit(PlayerJoinedLobby {
                player,
                timestamp: 0,
            });
        } else {
            // Second player - create match!
            
            let player1 = *lobby.pending_player.borrow();
            let player1_cards = *lobby.pending_card_ids.borrow();
            let player2 = ctx.sender();
            
            // Lock player2's cards
            game::lock_card_for_matchmaking(card1);
            game::lock_card_for_matchmaking(card2);
            game::lock_card_for_matchmaking(card3);
            game::lock_card_for_matchmaking(card4);
            game::lock_card_for_matchmaking(card5);
            
            // Roll initiative (50/50)
            let mut generator = random::new_generator(r, ctx);
            let initiative = random::generate_u8_in_range(&mut generator, 0, 1);
            let player1_is_attacker = initiative == 0;
            
            // Create battle
            let (battle, cap1, cap2) = game::create_battle(
                player1_cards,
                player2,
                deck_card_ids,
                ctx
            );
            
            let battle_id = object::id(&battle);
            
            // Create game session
            let session_uid = object::new(ctx);
            let session_id = object::uid_to_inner(&session_uid);
            
            let session = GameSession {
                id: session_uid,
                battle_id,
                player1,
                player2,
                player1_is_attacker,
                created_at: 0,
            };
            
            // Emit match found event
            event::emit(MatchFound {
                game_session_id: session_id,
                battle_id,
                player1,
                player2,
                player1_is_attacker,
            });
            
            // Reset lobby
            lobby.pending_player = option::none();
            lobby.pending_card_ids = option::none();
            lobby.waiting_since = 0;
            
            // Transfer objects (use public_transfer for objects with store)
            game::share_battle(battle);
            transfer::public_transfer(cap1, player1);
            transfer::public_transfer(cap2, player2);
            transfer::transfer(session, player2);
        };
    }

    /// Cancel matchmaking (only if still waiting)
    public entry fun cancel_matchmaking(
        lobby: &mut Lobby,
        profile: &mut PlayerProfile,
        card1: &mut Card,
        card2: &mut Card,
        card3: &mut Card,
        card4: &mut Card,
        card5: &mut Card,
        ctx: &mut TxContext
    ) {
        let player = ctx.sender();
        
        // Verify player is in lobby
        assert!(lobby.pending_player.is_some(), ENotInLobby);
        assert!(*lobby.pending_player.borrow() == player, ENotInLobby);
        
        // Verify profile matches
        assert!(player_profile::get_profile_owner(profile) == player, EProfileNotOwned);
        
        // Unlock all cards
        game::unlock_card_from_matchmaking(card1);
        game::unlock_card_from_matchmaking(card2);
        game::unlock_card_from_matchmaking(card3);
        game::unlock_card_from_matchmaking(card4);
        game::unlock_card_from_matchmaking(card5);
        
        // Clear lobby
        lobby.pending_player = option::none();
        lobby.pending_card_ids = option::none();
        lobby.waiting_since = 0;
        
        event::emit(MatchmakingCancelled {
            player,
        });
    }

    // ==================== View Functions ====================

    public fun get_lobby_status(lobby: &Lobby): (bool, Option<address>) {
        (lobby.pending_player.is_some(), lobby.pending_player)
    }

    public fun get_session_info(session: &GameSession): (ID, address, address, bool) {
        (session.battle_id, session.player1, session.player2, session.player1_is_attacker)
    }
}
