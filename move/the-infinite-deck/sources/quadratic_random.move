module infinite_deck::quadratic_random {
    use sui::random::{Random, new_generator, RandomGenerator};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    public struct SampleResult has key, store {
        id: UID,
        value: u64,
    }

    fun f(x: u64): u64 {
        if (x > 2000) {
            return 0
        };
        
        let x_squared = x * x;
        let term1 = x_squared / 2000;
        let term2 = 2 * x;
        
        if (term2 > term1 + 2000) {
            return 0
        };
        term1 + 2000 - term2
    }

    public fun sample_quadratic(rnd: &Random, ctx: &mut TxContext): u64 {
        let mut generator = new_generator(rnd, ctx);
        sample_with_generator(&mut generator)
    }

    fun sample_with_generator(generator: &mut RandomGenerator): u64 {
        let mut attempts = 0u64;
        loop {
            let x = generator.generate_u64_in_range(0, 2000);
            let y = generator.generate_u64_in_range(0, 2000);
            let fx = f(x);
            
            if (y <= fx) {
                return x
            };
            
            attempts = attempts + 1;
            if (attempts > 1000) {
                return 0
            };
        }
    }

    entry fun create_sample(rnd: &Random, ctx: &mut TxContext) {
        let mut generator = new_generator(rnd, ctx);
        let value = sample_with_generator(&mut generator);
        
        let result = SampleResult {
            id: object::new(ctx),
            value,
        };
        
        // Transfer object về địa chỉ người gọi
        transfer::transfer(result, ctx.sender());
    }

    #[test]
    fun test_f_function() {
        assert!(f(0) == 2000, 0);
        let result = f(2000);
        assert!(result < 100, 1);
    }
}