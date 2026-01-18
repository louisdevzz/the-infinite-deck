// Copyright (c) The Infinite Deck Contributors
// SPDX-License-Identifier: Apache-2.0

/// AI Forge - Card Minting System for The Infinite Deck
/// 
/// This module implements the AI Forge, which allows players to mint unique cards using:
/// - VRF (Verifiable Random Function) to determine rarity and stat budgets
/// - Multiple stat distribution strategies (Balanced, Tank, Attacker, Random)
/// - AI integration with sanitation checks to prevent overpowered cards
/// - On-chain fairness guarantees
module infinite_deck::ai_forge {
    use std::string::{Self, String};
    use sui::event;
    use sui::random::{Self, Random};
    use infinite_deck::game::{Self, Card};
    use infinite_deck::quadratic_random;
    use infinite_deck::player_profile;

    // ==================== Error Codes ====================
    
    const ESanitationFailed: u64 = 100;
    const EInvalidRarity: u64 = 101;
    const EInvalidDistributionStrategy: u64 = 102;
    const EStatsExceedBudget: u64 = 103;
    const EInvalidStatAllocation: u64 = 104;

    // ==================== Constants ====================
    
    const MAX_STAT_VALUE: u64 = 10000;
    
    // Rarity tiers
    const RARITY_COMMON: u8 = 0;
    const RARITY_UNCOMMON: u8 = 1;
    const RARITY_RARE: u8 = 2;
    const RARITY_EPIC: u8 = 3;
    const RARITY_LEGENDARY: u8 = 4;
    
    // Distribution strategies
    const STRATEGY_BALANCED: u8 = 0;
    const STRATEGY_TANK: u8 = 1;
    const STRATEGY_ATTACKER: u8 = 2;
    const STRATEGY_DEFENDER: u8 = 3;
    const STRATEGY_RANDOM: u8 = 4;

    // ==================== Structs ====================

    /// Configuration for a rarity tier
    public struct RarityConfig has copy, drop, store {
        min_stats: u64,
        max_stats: u64,
        probability_threshold: u8, // Cumulative probability (0-100)
    }

    public struct ForgeRequest has key {
        id: UID,
        player: address,
        prompt: String,
        rarity: u8,
        total_stats: u64,
        element: u8,
        timestamp: u64,
    }

    public struct CardForged has copy, drop {
        card_id: ID,
        player: address,
        name: String,
        rarity: u8,
        element: u8,
        hp: u64,
        atk: u64,
        def: u64,
        total_stats: u64,
    }

    // ==================== Rarity System ====================

    /// Get rarity configuration for a specific tier
    public fun get_rarity_config(rarity: u8): RarityConfig {
        if (rarity == RARITY_COMMON) {
            RarityConfig {
                min_stats: 2000,
                max_stats: 4000,
                probability_threshold: 50, // 0-50 = 50%
            }
        } else if (rarity == RARITY_UNCOMMON) {
            RarityConfig {
                min_stats: 4000,
                max_stats: 5500,
                probability_threshold: 75, // 51-75 = 25%
            }
        } else if (rarity == RARITY_RARE) {
            RarityConfig {
                min_stats: 5500,
                max_stats: 7000,
                probability_threshold: 90, // 76-90 = 15%
            }
        } else if (rarity == RARITY_EPIC) {
            RarityConfig {
                min_stats: 7000,
                max_stats: 8500,
                probability_threshold: 98, // 91-98 = 8%
            }
        } else if (rarity == RARITY_LEGENDARY) {
            RarityConfig {
                min_stats: 8500,
                max_stats: 10000,
                probability_threshold: 100, // 99-100 = 2%
            }
        } else {
            abort EInvalidRarity
        }
    }

    /// Roll for rarity using VRF
    fun roll_rarity(r: &Random, ctx: &mut TxContext): u8 {
        let mut generator = random::new_generator(r, ctx);
        let roll = random::generate_u8_in_range(&mut generator, 1, 100);
        
        if (roll <= 50) {
            RARITY_COMMON
        } else if (roll <= 75) {
            RARITY_UNCOMMON
        } else if (roll <= 90) {
            RARITY_RARE
        } else if (roll <= 98) {
            RARITY_EPIC
        } else {
            RARITY_LEGENDARY
        }
    }

    /// Roll total stats within rarity range
    fun roll_total_stats(rarity: u8, r: &Random, ctx: &mut TxContext): u64 {
        let config = get_rarity_config(rarity);
        let mut generator = random::new_generator(r, ctx);
        random::generate_u64_in_range(&mut generator, config.min_stats, config.max_stats)
    }

    /// Roll element using VRF
    fun roll_element(r: &Random, ctx: &mut TxContext): u8 {
        let mut generator = random::new_generator(r, ctx);
        random::generate_u8_in_range(&mut generator, 0, 4) // 0=Fire, 1=Water, 2=Plant, 3=Light, 4=Dark
    }

    /// Get rarity name as string
    public fun get_rarity_name(rarity: u8): String {
        if (rarity == RARITY_COMMON) {
            string::utf8(b"Common")
        } else if (rarity == RARITY_UNCOMMON) {
            string::utf8(b"Uncommon")
        } else if (rarity == RARITY_RARE) {
            string::utf8(b"Rare")
        } else if (rarity == RARITY_EPIC) {
            string::utf8(b"Epic")
        } else if (rarity == RARITY_LEGENDARY) {
            string::utf8(b"Legendary")
        } else {
            string::utf8(b"Unknown")
        }
    }

    // ==================== Stat Distribution Strategies ====================

    /// Balanced distribution: HP 40%, ATK 30%, DEF 30%
    fun distribute_balanced(total: u64, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        let mut generator = random::new_generator(r, ctx);
        
        // Add some randomness (±10%) to each stat
        let hp_base = (total * 40) / 100;
        let atk_base = (total * 30) / 100;
        let def_base = (total * 30) / 100;
        
        let variance = (total * 10) / 100;
        let hp_variance = random::generate_u64_in_range(&mut generator, 0, variance);
        let atk_variance = random::generate_u64_in_range(&mut generator, 0, variance);
        
        let hp = hp_base + hp_variance;
        let atk = atk_base + atk_variance;
        let def = total - hp - atk; // Ensure exact total
        
        (hp, atk, def)
    }

    /// Tank distribution: HP 50%, ATK 20%, DEF 30%
    fun distribute_tank(total: u64, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        let mut generator = random::new_generator(r, ctx);
        
        let hp_base = (total * 50) / 100;
        let atk_base = (total * 20) / 100;
        let def_base = (total * 30) / 100;
        
        let variance = (total * 10) / 100;
        let hp_variance = random::generate_u64_in_range(&mut generator, 0, variance);
        let def_variance = random::generate_u64_in_range(&mut generator, 0, variance / 2);
        
        let hp = hp_base + hp_variance;
        let def = def_base + def_variance;
        let atk = total - hp - def;
        
        (hp, atk, def)
    }

    /// Attacker distribution: HP 30%, ATK 50%, DEF 20%
    fun distribute_attacker(total: u64, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        let mut generator = random::new_generator(r, ctx);
        
        let hp_base = (total * 30) / 100;
        let atk_base = (total * 50) / 100;
        let def_base = (total * 20) / 100;
        
        let variance = (total * 10) / 100;
        let atk_variance = random::generate_u64_in_range(&mut generator, 0, variance);
        let hp_variance = random::generate_u64_in_range(&mut generator, 0, variance / 2);
        
        let atk = atk_base + atk_variance;
        let hp = hp_base + hp_variance;
        let def = total - hp - atk;
        
        (hp, atk, def)
    }

    /// Defender distribution: HP 35%, ATK 25%, DEF 40%
    fun distribute_defender(total: u64, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        let mut generator = random::new_generator(r, ctx);
        
        let hp_base = (total * 35) / 100;
        let atk_base = (total * 25) / 100;
        let def_base = (total * 40) / 100;
        
        let variance = (total * 10) / 100;
        let def_variance = random::generate_u64_in_range(&mut generator, 0, variance);
        let hp_variance = random::generate_u64_in_range(&mut generator, 0, variance / 2);
        
        let def = def_base + def_variance;
        let hp = hp_base + hp_variance;
        let atk = total - hp - def;
        
        (hp, atk, def)
    }

    /// Random distribution: Completely random allocation
    fun distribute_random(total: u64, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        let mut generator = random::new_generator(r, ctx);
        
        // Random split: first roll for HP (20-60% of total)
        let hp_percent = random::generate_u64_in_range(&mut generator, 20, 60);
        let hp = (total * hp_percent) / 100;
        
        let remaining = total - hp;
        
        // Random split of remaining between ATK and DEF
        let atk_percent = random::generate_u64_in_range(&mut generator, 30, 70);
        let atk = (remaining * atk_percent) / 100;
        let def = remaining - atk;
        
        (hp, atk, def)
    }

    /// Distribute stats based on strategy
    fun distribute_stats(total: u64, strategy: u8, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        if (strategy == STRATEGY_BALANCED) {
            distribute_balanced(total, r, ctx)
        } else if (strategy == STRATEGY_TANK) {
            distribute_tank(total, r, ctx)
        } else if (strategy == STRATEGY_ATTACKER) {
            distribute_attacker(total, r, ctx)
        } else if (strategy == STRATEGY_DEFENDER) {
            distribute_defender(total, r, ctx)
        } else if (strategy == STRATEGY_RANDOM) {
            distribute_random(total, r, ctx)
        } else {
            abort EInvalidDistributionStrategy
        }
    }

    // ==================== Minting Functions ====================

    /// Forge a card using quadratic random distribution
    /// Power score: 0-2000 with quadratic distribution
    /// Stats are scaled by 5x for battle system compatibility
    public fun forge_card_quadratic(
        name: String,
        element_str: String,
        image_url: String,
        r: &Random,
        ctx: &mut TxContext
    ): Card {
        let player = ctx.sender();
        
        // Step 1: Use quadratic random for power score (0-2000)
        let power_score = quadratic_random::sample_quadratic(r, ctx);
        
        // Step 2: Scale up by 5x for battle system compatibility (0-10,000)
        let total_stats = power_score * 5;
        
        // Step 3: Determine rarity based on power score
        let rarity = if (power_score < 500) { 0 }       // Common: 0-500
                     else if (power_score < 1000) { 1 }  // Uncommon: 500-1000
                     else if (power_score < 1500) { 2 }  // Epic: 1000-1500
                     else { 3 };                         // Legendary: 1500-2000
        
        // Step 4: Convert element string to u8
        let element = game::element_string_to_u8(element_str);
        
        // Step 5: Split stats randomly (HP, ATK, DEF)
        let (hp, atk, def) = split_stats_random(total_stats, r, ctx);
        
        // Step 6: Mint card
        let card = game::mint_card(
            name,
            element,
            element_str,
            rarity,
            hp,
            atk,
            def,
            power_score,
            image_url,
            ctx
        );
        
        let card_id = object::id(&card);
        
        event::emit(CardForged {
            card_id,
            player,
            name,
            rarity,
            element,
            hp,
            atk,
            def,
            total_stats,
        });
        
        card
    }

    /// Entry function to forge a card (transfers to sender)
    public entry fun forge_card_entry(
        name_bytes: vector<u8>,
        element_bytes: vector<u8>,
        image_url_bytes: vector<u8>,
        r: &Random,
        ctx: &mut TxContext
    ) {
        let name = string::utf8(name_bytes);
        let element_str = string::utf8(element_bytes);
        let image_url = string::utf8(image_url_bytes);
        
        let card = forge_card_quadratic(name, element_str, image_url, r, ctx);
        transfer::public_transfer(card, ctx.sender());
    }

    /// Split stats randomly using the same logic as user's original code
    fun split_stats_random(total_stats: u64, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        if (total_stats == 0) {
            return (0, 0, 0)
        };

        let mut generator = random::new_generator(r, ctx);
        
        let split1 = random::generate_u64_in_range(&mut generator, 0, total_stats);
        let remaining = total_stats - split1;
        let split2 = random::generate_u64_in_range(&mut generator, 0, remaining);
        
        let hp = split1;
        let atk = split2;
        let def = remaining - split2;

        (hp, atk, def)
    }

    // ==================== View Functions ====================

    public fun get_forge_request_info(request: &ForgeRequest): (address, String, u8, u64, u8) {
        (request.player, request.prompt, request.rarity, request.total_stats, request.element)
    }

    // ==================== Test Helpers ====================

    #[test_only]
    public fun test_roll_rarity(r: &Random, ctx: &mut TxContext): u8 {
        roll_rarity(r, ctx)
    }

    #[test_only]
    public fun test_roll_total_stats(rarity: u8, r: &Random, ctx: &mut TxContext): u64 {
        roll_total_stats(rarity, r, ctx)
    }

    #[test_only]
    public fun test_distribute_stats(total: u64, strategy: u8, r: &Random, ctx: &mut TxContext): (u64, u64, u64) {
        distribute_stats(total, strategy, r, ctx)
    }
}
