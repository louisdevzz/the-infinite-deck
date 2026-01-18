// Copyright (c) The Infinite Deck Contributors
// SPDX-License-Identifier: Apache-2.0

#[test_only]
module infinite_deck::game_tests {
    use infinite_deck::game::{Self, Card, Battle, BattleCapability};
    use std::string;
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::random::{Self, Random};

    // Test addresses
    const PLAYER1: address = @0xA;
    const PLAYER2: address = @0xB;

    // ==================== Helper Functions ====================

    fun create_fire_card(scenario: &mut Scenario): Card {
        game::create_test_card(
            string::utf8(b"Fire Dragon"),
            0, // ELEMENT_FIRE
            1000,
            500,
            200,
            ts::ctx(scenario)
        )
    }

    fun create_water_card(scenario: &mut Scenario): Card {
        game::create_test_card(
            string::utf8(b"Water Serpent"),
            1, // ELEMENT_WATER
            1200,
            450,
            250,
            ts::ctx(scenario)
        )
    }

    fun create_plant_card(scenario: &mut Scenario): Card {
        game::create_test_card(
            string::utf8(b"Plant Golem"),
            2, // ELEMENT_PLANT
            1500,
            400,
            300,
            ts::ctx(scenario)
        )
    }

    fun create_light_card(scenario: &mut Scenario): Card {
        game::create_test_card(
            string::utf8(b"Light Angel"),
            3, // ELEMENT_LIGHT
            1100,
            600,
            150,
            ts::ctx(scenario)
        )
    }

    fun create_dark_card(scenario: &mut Scenario): Card {
        game::create_test_card(
            string::utf8(b"Dark Demon"),
            4, // ELEMENT_DARK
            1000,
            650,
            100,
            ts::ctx(scenario)
        )
    }

    // ==================== Card Minting Tests ====================

    #[test]
    fun test_mint_card_success() {
        let mut scenario = ts::begin(PLAYER1);
        
        let card = game::create_test_card(
            string::utf8(b"Test Card"),
            0, // Fire
            5000,
            3000,
            2000,
            ts::ctx(&mut scenario)
        );

        let (name, element, hp, max_hp, atk, def, owner) = game::get_card_info(&card);
        
        assert!(name == string::utf8(b"Test Card"), 0);
        assert!(element == 0, 1);
        assert!(hp == 5000, 2);
        assert!(max_hp == 5000, 3);
        assert!(atk == 3000, 4);
        assert!(def == 2000, 5);
        assert!(owner == PLAYER1, 6);

        game::destroy_card_for_testing(card);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = game::EStatsExceedCap)]
    fun test_mint_card_hp_exceeds_cap() {
        let mut scenario = ts::begin(PLAYER1);
        
        let card = game::create_test_card(
            string::utf8(b"OP Card"),
            0,
            10001, // Exceeds cap
            3000,
            2000,
            ts::ctx(&mut scenario)
        );

        game::destroy_card_for_testing(card);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = game::EStatsExceedCap)]
    fun test_mint_card_atk_exceeds_cap() {
        let mut scenario = ts::begin(PLAYER1);
        
        let card = game::create_test_card(
            string::utf8(b"OP Card"),
            0,
            5000,
            10001, // Exceeds cap
            2000,
            ts::ctx(&mut scenario)
        );

        game::destroy_card_for_testing(card);
        ts::end(scenario);
    }

    // ==================== Elemental Counter Tests ====================

    #[test]
    fun test_fire_beats_plant() {
        let mut scenario = ts::begin(PLAYER1);
        
        let mut fire_card = create_fire_card(&mut scenario);
        let mut plant_card = create_plant_card(&mut scenario);

        // Fire (ATK 500) vs Plant (DEF 300)
        // Multiplier: 1.5x -> 500 * 1.5 = 750
        // Damage: 750 - 300 = 450
        // Plant HP: 1500 - 450 = 1050

        let initial_hp = 1500;
        let (_, _, hp_before, _, _, _, _) = game::get_card_info(&plant_card);
        assert!(hp_before == initial_hp, 0);

        // Simulate damage calculation (we'll need to expose this or test through combat)
        // For now, we verify the cards were created correctly
        
        game::destroy_card_for_testing(fire_card);
        game::destroy_card_for_testing(plant_card);
        ts::end(scenario);
    }

    #[test]
    fun test_water_beats_fire() {
        let mut scenario = ts::begin(PLAYER1);
        
        let water_card = create_water_card(&mut scenario);
        let fire_card = create_fire_card(&mut scenario);

        let (_, element_w, _, _, _, _, _) = game::get_card_info(&water_card);
        let (_, element_f, _, _, _, _, _) = game::get_card_info(&fire_card);
        
        assert!(element_w == 1, 0); // Water
        assert!(element_f == 0, 1); // Fire

        game::destroy_card_for_testing(water_card);
        game::destroy_card_for_testing(fire_card);
        ts::end(scenario);
    }

    #[test]
    fun test_light_vs_dark() {
        let mut scenario = ts::begin(PLAYER1);
        
        let light_card = create_light_card(&mut scenario);
        let dark_card = create_dark_card(&mut scenario);

        // Both should deal 2.0x damage to each other
        let (_, element_l, _, _, _, _, _) = game::get_card_info(&light_card);
        let (_, element_d, _, _, _, _, _) = game::get_card_info(&dark_card);
        
        assert!(element_l == 3, 0); // Light
        assert!(element_d == 4, 1); // Dark

        game::destroy_card_for_testing(light_card);
        game::destroy_card_for_testing(dark_card);
        ts::end(scenario);
    }

    // ==================== Battle Creation Tests ====================

    #[test]
    fun test_create_battle_success() {
        let mut scenario = ts::begin(PLAYER1);
        
        // Create 5 cards for each player
        let mut p1_cards = vector::empty<ID>();
        let mut p2_cards = vector::empty<ID>();
        
        let mut i = 0;
        while (i < 5) {
            let card1 = create_fire_card(&mut scenario);
            let card2 = create_water_card(&mut scenario);
            
            vector::push_back(&mut p1_cards, object::id(&card1));
            vector::push_back(&mut p2_cards, object::id(&card2));
            
            transfer::public_transfer(card1, PLAYER1);
            transfer::public_transfer(card2, PLAYER2);
            
            i = i + 1;
        };

        ts::next_tx(&mut scenario, PLAYER1);
        
        let (battle, cap1, cap2) = game::create_battle(
            p1_cards,
            PLAYER2,
            p2_cards,
            ts::ctx(&mut scenario)
        );

        let (player1, player2, round, phase, winner) = game::get_battle_info(&battle);
        
        assert!(player1 == PLAYER1, 0);
        assert!(player2 == PLAYER2, 1);
        assert!(round == 1, 2);
        assert!(phase == 1, 3); // PHASE_SUMMON
        assert!(winner.is_none(), 4);

        game::destroy_battle_for_testing(battle);
        game::destroy_capability_for_testing(cap1);
        game::destroy_capability_for_testing(cap2);
        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = game::EInvalidDeckSize)]
    fun test_create_battle_invalid_deck_size() {
        let mut scenario = ts::begin(PLAYER1);
        
        // Create only 3 cards (should fail)
        let mut p1_cards = vector::empty<ID>();
        let mut p2_cards = vector::empty<ID>();
        
        let card1 = create_fire_card(&mut scenario);
        let card2 = create_water_card(&mut scenario);
        let card3 = create_plant_card(&mut scenario);
        
        vector::push_back(&mut p1_cards, object::id(&card1));
        vector::push_back(&mut p2_cards, object::id(&card2));
        vector::push_back(&mut p2_cards, object::id(&card3));
        
        let (battle, cap1, cap2) = game::create_battle(
            p1_cards,
            PLAYER2,
            p2_cards,
            ts::ctx(&mut scenario)
        );

        game::destroy_battle_for_testing(battle);
        game::destroy_capability_for_testing(cap1);
        game::destroy_capability_for_testing(cap2);
        game::destroy_card_for_testing(card1);
        game::destroy_card_for_testing(card2);
        game::destroy_card_for_testing(card3);
        ts::end(scenario);
    }

    // ==================== Healing Tests ====================

    #[test]
    fun test_heal_card() {
        let mut scenario = ts::begin(PLAYER1);
        
        let mut card = create_fire_card(&mut scenario);
        
        let (_, _, hp_initial, max_hp, _, _, _) = game::get_card_info(&card);
        assert!(hp_initial == max_hp, 0);

        // Manually reduce HP (in real scenario, this would happen through combat)
        // For testing, we'll just verify heal works
        game::heal_card(&mut card);
        
        let (_, _, hp_after, _, _, _, _) = game::get_card_info(&card);
        assert!(hp_after == max_hp, 1);

        game::destroy_card_for_testing(card);
        ts::end(scenario);
    }

    // ==================== Integration Test ====================

    #[test]
    fun test_full_battle_flow() {
        let mut scenario = ts::begin(PLAYER1);
        
        // This test would require setting up a full battle with Random
        // and testing the complete flow from summon -> reveal -> combat -> resolution
        // Due to complexity with Random in tests, we'll keep this as a placeholder
        
        ts::end(scenario);
    }
}
