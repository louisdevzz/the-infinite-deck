module card_generator::card {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::random::{Random, new_generator};
    use std::string::{Self, String};
    use sui::event;
    
    use custom_random::quadratic_random;

    /// Rarity levels
    const COMMON: u8 = 0;
    const UNCOMMON: u8 = 1;
    const EPIC: u8 = 2;
    const LEGENDARY: u8 = 3;

    /// Card struct
    public struct Card has key, store {
        id: UID,
        name: String,           
        element: String,       
        rarity: u8,
        atk: u64,
        def: u64,
        hp: u64,
        power_score: u64,
        user_prompt: String,
        final_prompt: String,
        image_url: String,
        border_color: String,
    }

    /// Event emitted when card is created
    public struct CardCreated has copy, drop {
        card_id: address,
        name: String,        
        element: String,    
        rarity: u8,
        power_score: u64,
        final_prompt: String,
    }

    /// Calculate rarity based on power score
    fun get_rarity(power_score: u64): u8 {
        if (power_score < 500) {
            COMMON
        } else if (power_score < 1000) {
            UNCOMMON
        } else if (power_score < 1500) {
            EPIC
        } else {
            LEGENDARY
        }
    }

    /// Get border color based on rarity
    fun get_border_color(rarity: u8): String {
        if (rarity == COMMON) {
            string::utf8(b"green")
        } else if (rarity == UNCOMMON) {
            string::utf8(b"blue")
        } else if (rarity == EPIC) {
            string::utf8(b"purple")
        } else {
            string::utf8(b"gold")
        }
    }

    /// Split power score into atk, def, hp randomly
    fun split_stats(
        power_score: u64,
        generator: &mut sui::random::RandomGenerator
    ): (u64, u64, u64) {
        if (power_score == 0) {
            return (0, 0, 0)
        };

        let split1 = sui::random::generate_u64_in_range(generator, 0, power_score);
        let remaining = power_score - split1;
        let split2 = sui::random::generate_u64_in_range(generator, 0, remaining);
        
        let atk = split1;
        let def = split2;
        let hp = remaining - split2;

        (atk, def, hp)
    }

    /// Main function to create a card
    public entry fun create_card(
        r: &Random,
        user_prompt_bytes: vector<u8>,
        name_bytes: vector<u8>,        
        element_bytes: vector<u8>,    
        ctx: &mut TxContext
    ) {
        let mut generator = new_generator(r, ctx);
        
        // Get power score from custom random (0-2000)
        let power_score = quadratic_random::sample_with_generator(&mut generator);
        
        // Determine rarity
        let rarity = get_rarity(power_score);
        let border_color = get_border_color(rarity);
        
        // Split stats
        let (atk, def, hp) = split_stats(power_score, &mut generator);
        
        // Process inputs
        let user_prompt = string::utf8(user_prompt_bytes);
        let name = string::utf8(name_bytes);           
        let element = string::utf8(element_bytes);    
        
        // 🆕 Build final prompt with card name + element + user description
        let mut final_prompt_str = name;
        string::append_utf8(&mut final_prompt_str, b", ");
        string::append(&mut final_prompt_str, element);
        string::append_utf8(&mut final_prompt_str, b" element, ");
        string::append(&mut final_prompt_str, user_prompt);
        string::append_utf8(
            &mut final_prompt_str,
            b", fantasy trading card game art, detailed character illustration, professional card game artwork, centered composition"
        );
        
        let card_id = object::new(ctx);
        let card_address = object::uid_to_address(&card_id);
        
        // Emit event for off-chain processing
        event::emit(CardCreated {
            card_id: card_address,
            name,                  
            element,               
            rarity,
            power_score,
            final_prompt: final_prompt_str,
        });
        
        let card = Card {
            id: card_id,
            name,                 
            element,               
            rarity,
            atk,
            def,
            hp,
            power_score,
            user_prompt,
            final_prompt: final_prompt_str,
            image_url: string::utf8(b""),
            border_color,
        };
        
        transfer::transfer(card, tx_context::sender(ctx));
    }

    /// Update card image URL (called by backend after Walrus upload)
    public entry fun update_image_url(
        card: &mut Card,
        image_url_bytes: vector<u8>,
        _ctx: &mut TxContext
    ) {
        card.image_url = string::utf8(image_url_bytes);
    }

    // Getter functions
    public fun get_name(card: &Card): String { card.name }           
    public fun get_element(card: &Card): String { card.element }     
    public fun get_rarity_value(card: &Card): u8 { card.rarity }
    public fun get_atk(card: &Card): u64 { card.atk }
    public fun get_def(card: &Card): u64 { card.def }
    public fun get_hp(card: &Card): u64 { card.hp }
    public fun get_power_score(card: &Card): u64 { card.power_score }
}
