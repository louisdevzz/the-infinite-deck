
// Mock Data Source for UI Tai
export interface UserProfile {
    id: string;
    username: string;
    level: number;
    walletAddress: string;
    avatarUrl: string;
    currency: {
        sui: number;
        gems: number;
        gold: number;
    };
}


export type RarityType = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Void';
export type ElementType = 'Light' | 'Dark' | 'Void' | 'Neon' | 'Fire' | 'Water' | 'Wood';

export interface CyberCard {
    // Shared / Common
    id: string;
    name: string;      // ui_tai preferred
    title: string;     // ui_nam preferred (will mirror name)
    type: string;
    rarity: RarityType;
    element: ElementType;
    description: string;

    // Images
    image: string;     // ui_tai preferred
    img: string;       // ui_nam preferred (will mirror image)

    // Stats (Unified)
    hp: number;        // ui_nam
    atk: number;       // ui_nam (mapped to power for tai)
    def: number;       // ui_nam

    // UI Tai Specifics
    price?: number;
    status: 'CONSTRUCTING' | 'READY' | 'ON_SALE' | 'SOLD' | 'IN_DECK';
    stats: {           // ui_tai nested stats object
        power: number;     // mirror atk
        integrity: number; // mirror hp
        stability?: string;
    };
    metadata?: {
        weaponry?: string;
        origin?: string;
        pilot?: string;
    };
}

export interface SystemLog {
    timestamp: string;
    message: string;
}

export interface MarketState {
    indexStable: number;
    volume24h: number;
    networkStatus: 'OPTIMAL' | 'CONGESTED';
    latency: number;
}

// --- MOCK DATA ---

export const MOCK_USER: UserProfile = {
    id: "pilot_01",
    username: "PILOT_ZERO_ONE",
    level: 42,
    walletAddress: "0x8a...2e1",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-lm__GPFZdL17KWul5U5M8IlyIH_SP7NGIeaLJTCbGBsibp8JTrQaliklIDKaYOewa8MP0ltZa9xuqdStYmSbxgeeAe2VOU3CrG6TX_iUKWTRcyRlSJhb2BiAboMda7di4OSAtkXTUcvnhZYdMcJJDLexOic2PEhUnyXh7k2bJxe8RnqUcYf50PQvWzVUCihJsbwpzq0gGseNmK1M05T5QHYvin5MV4h_UcpoLgH_LzDKVluFkLbhYAs0oTYdIwqTQj0dve6XlA",
    currency: {
        sui: 154.2,
        gems: 2500,
        gold: 15000
    }
};

export const MOCK_HOME_DATA = {
    activeConstruction: {
        id: "c_001",
        name: "CYBER DRAGON",
        title: "CYBER DRAGON",
        type: "Construct",
        rarity: "Legendary" as RarityType,
        element: "Neon" as ElementType,
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
        img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000&auto=format&fit=crop",
        description: "A legendary cyber construct.",
        status: "CONSTRUCTING",
        hp: 8450,
        atk: 0,
        def: 5000,
        stats: {
            power: 0,
            integrity: 8450
        },
        progress: 87
    }
};

export const MOCK_FORGE_DATA: { logs: SystemLog[], activeCard: CyberCard } = {
    logs: [
        { timestamp: "[14:02:11]", message: "INITIALIZING NEURAL LINK..." },
        { timestamp: "[14:02:12]", message: "CALIBRATING SYNAPTIC CHIP..." },
        { timestamp: "[14:02:15]", message: "CONNECTION ESTABLISHED." },
        { timestamp: "[14:02:18]", message: "SCANNING AVAILABLE ASSETS..." },
        { timestamp: "[14:02:20]", message: 'SYNTHESIZING ARCHETYPE: "CYBERPUNK_WARRIOR"' },
        { timestamp: "[14:02:22]", message: "CORE STABILIZED. READY FOR COMMAND." }
    ],
    activeCard: {
        id: "f_001",
        name: "X-NEON",
        title: "X-NEON",
        type: "Cyber Entity",
        rarity: "Legendary",
        element: "Neon",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_XHTrS5SEPY4723ikHgM9M-CcQ3lq_A3g-l9H-ZNu-BSW6Eyg_KdOmec0sv52JRZWUNojRxtONf4lc3f0PL-Q3v5HYbAHKJ5WDekj6Xa7wh5kJEM6yzuh7GaIRNNXxDM458LBX6uy72TgUAu2nCnWfi3Kj3vtUmZu-WPX2yNhjCrvnig79tXhEl9Ul1JU51tRVbas-6K3gvvsMzZVPf85ai4qcUNevhZHkULzI2aU-929abRLzQeu5lIecpjAFZkEUSd_g8e_ZA",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_XHTrS5SEPY4723ikHgM9M-CcQ3lq_A3g-l9H-ZNu-BSW6Eyg_KdOmec0sv52JRZWUNojRxtONf4lc3f0PL-Q3v5HYbAHKJ5WDekj6Xa7wh5kJEM6yzuh7GaIRNNXxDM458LBX6uy72TgUAu2nCnWfi3Kj3vtUmZu-WPX2yNhjCrvnig79tXhEl9Ul1JU51tRVbas-6K3gvvsMzZVPf85ai4qcUNevhZHkULzI2aU-929abRLzQeu5lIecpjAFZkEUSd_g8e_ZA",
        description: "Generated neon warrior.",
        status: "READY",
        hp: 8450,
        atk: 99,
        def: 5000,
        stats: {
            power: 99, // Level 99
            integrity: 8450,
            stability: "98%"
        },
        metadata: {
            weaponry: "PLASMA_BLADE_MK2",
            origin: "Forge_Systems_Sector_0"
        }
    }
};

// Merged CARDS_DATA from ui_nam/src/data/mockCards.ts
export const CARDS_DATA: Record<string, CyberCard> = {
    'PULSE_LANCER': {
        id: 'PULSE_LANCER',
        name: 'Pulse Lancer',
        title: 'Pulse Lancer',
        type: 'Cyber Entity',
        hp: 2000,
        atk: 1800,
        def: 1200,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_XHTrS5SEPY4723ikHgM9M-CcQ3lq_A3g-l9H-ZNu-BSW6Eyg_KdOmec0sv52JRZWUNojRxtONf4lc3f0PL-Q3v5HYbAHKJ5WDekj6Xa7wh5kJEM6yzuh7GaIRNNXxDM458LBX6uy72TgUAu2nCnWfi3Kj3vtUmZu-WPX2yNhjCrvnig79tXhEl9Ul1JU51tRVbas-6K3gvvsMzZVPf85ai4qcUNevhZHkULzI2aU-929abRLzQeu5lIecpjAFZkEUSd_g8e_ZA',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_XHTrS5SEPY4723ikHgM9M-CcQ3lq_A3g-l9H-ZNu-BSW6Eyg_KdOmec0sv52JRZWUNojRxtONf4lc3f0PL-Q3v5HYbAHKJ5WDekj6Xa7wh5kJEM6yzuh7GaIRNNXxDM458LBX6uy72TgUAu2nCnWfi3Kj3vtUmZu-WPX2yNhjCrvnig79tXhEl9Ul1JU51tRVbas-6K3gvvsMzZVPf85ai4qcUNevhZHkULzI2aU-929abRLzQeu5lIecpjAFZkEUSd_g8e_ZA',
        rarity: 'Legendary',
        element: 'Light',
        description: 'When this node is initialized, you can target 1 encrypted card in your back-row; decrypt it and add it to your processing queue.',
        status: 'IN_DECK',
        stats: { power: 1800, integrity: 2000 }
    },
    'D_SYNC': {
        id: 'D_SYNC',
        name: 'D_SYNC',
        title: 'D_SYNC',
        type: 'Program',
        hp: 1200,
        atk: 1000,
        def: 0,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk6vJe8Q3vBe_A_lWdhHCbKz6WqUGeJeI0mz_X0S68UMp72P4Nt9JmfKdgGFh4KIniZyjtwdUI4okoCS_34FYTCtezybnxe-fAuTSQclJbIMI_d0KY2LAVdxX5ivEVQEF1xwojeQWuxduNOBV1YaFnPeXiKSmzh3r3g23S6A79vuOe_HULr4slEb17BQpA6Di4xV1H3T7fJZ7QtedlkVGI9gejtgNSFsYD6-IKJsL-XKLmGNAvCnJCjtUcLaQp0yufgeFdrkjBuQ',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk6vJe8Q3vBe_A_lWdhHCbKz6WqUGeJeI0mz_X0S68UMp72P4Nt9JmfKdgGFh4KIniZyjtwdUI4okoCS_34FYTCtezybnxe-fAuTSQclJbIMI_d0KY2LAVdxX5ivEVQEF1xwojeQWuxduNOBV1YaFnPeXiKSmzh3r3g23S6A79vuOe_HULr4slEb17BQpA6Di4xV1H3T7fJZ7QtedlkVGI9gejtgNSFsYD6-IKJsL-XKLmGNAvCnJCjtUcLaQp0yufgeFdrkjBuQ',
        rarity: 'Rare',
        element: 'Dark',
        description: 'Desynchronizes the opponent\'s network connection for 1 turn, negating their first played card effect.',
        status: 'READY',
        stats: { power: 1000, integrity: 1200 }
    },
    'ROOTKIT': {
        id: 'ROOTKIT',
        name: 'ROOTKIT',
        title: 'ROOTKIT',
        type: 'Virus',
        hp: 1500,
        atk: 1400,
        def: 800,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0llPJ6CowJuliQh7RjcS-XCgyxjf7TUoXGdctsWnbNwvNXIepZMb90LnQHmtmBpeYPKdxPK1GgES93EhdNrSnOgSJ8o1wJtn6Xk-u7F_Gziufhv-_X2hh7L_kOh0eiA6tbBujZEfAL4XxWlak7d81FCi8XMZ5AeN8tHK6frDT5jgvwYBfy0ZKpizcbMst_aVl327eM-WNPOZu6-ahWw1nUAGddiDgihUHHasPONjGwp456l8s8P8H3-sVPRVa25HqhlTR8_TXVw',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0llPJ6CowJuliQh7RjcS-XCgyxjf7TUoXGdctsWnbNwvNXIepZMb90LnQHmtmBpeYPKdxPK1GgES93EhdNrSnOgSJ8o1wJtn6Xk-u7F_Gziufhv-_X2hh7L_kOh0eiA6tbBujZEfAL4XxWlak7d81FCi8XMZ5AeN8tHK6frDT5jgvwYBfy0ZKpizcbMst_aVl327eM-WNPOZu6-ahWw1nUAGddiDgihUHHasPONjGwp456l8s8P8H3-sVPRVa25HqhlTR8_TXVw',
        rarity: 'Epic',
        element: 'Fire',
        description: 'Infiltrates the opponent\'s hand. Look at their hand and discard one card of your choice.',
        status: 'READY',
        stats: { power: 1400, integrity: 1500 }
    },
    'LOGIC_B': {
        id: 'LOGIC_B',
        name: 'LOGIC_B',
        title: 'LOGIC_B',
        type: 'Utility',
        hp: 1800,
        atk: 500,
        def: 2000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx_ciAi0u63jU9KVmxr8vRv6GGC_dAi1Ew5ZOVDURNww0lQlvB541YnFlnfwxoJ1AVWnO4qP8xaSC1ZUPuvJRfIw6zvXnEXTy_SEvYpPX5QXI5nnvbmLN5Kmy3YksBFbHJQCQtypaiyBsHhF1FeN8vujEHlu1KpDtNhbBE-yuVbGotPwfNHKdhjPDoZRYZPcE4r1IRlPjs0HfImTxCptCIEDOuFmzBS6bH34NzEYMq1hKDWtElWvkEFFFbBNWrQ1z-ypgFVxtQsw',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx_ciAi0u63jU9KVmxr8vRv6GGC_dAi1Ew5ZOVDURNww0lQlvB541YnFlnfwxoJ1AVWnO4qP8xaSC1ZUPuvJRfIw6zvXnEXTy_SEvYpPX5QXI5nnvbmLN5Kmy3YksBFbHJQCQtypaiyBsHhF1FeN8vujEHlu1KpDtNhbBE-yuVbGotPwfNHKdhjPDoZRYZPcE4r1IRlPjs0HfImTxCptCIEDOuFmzBS6bH34NzEYMq1hKDWtElWvkEFFFbBNWrQ1z-ypgFVxtQsw',
        rarity: 'Common',
        element: 'Water',
        description: 'A basic logic gate blocker. High defense capabilities against brute force attacks.',
        status: 'READY',
        stats: { power: 500, integrity: 1800 }
    },
    'SHREDDER': {
        id: 'SHREDDER',
        name: 'SHREDDER',
        title: 'SHREDDER',
        type: 'Malware',
        hp: 1000,
        atk: 1200,
        def: 400,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmcLb5iRUK08cAXEeKf5LLm9fQperHFbkvjHRP-rZ7P4ab1X6Isa3G-kRgUWA_lhhVzo8DQjI8HObMeldDn3l2v59o81lPG6ZrUuv2UnHf_fhuMz8g5X3xGqJ9upUSi6w76G4_Cpcf_OEi1R_4t_gqtZ5Vu_ZU0rksTy0M84WCf-eUTail3HS6Pb5NIWVb8iYlgF39jGXuQt1E7tY1xH4crKrkFmm6_wcy84mdIwmvjpVZ_QDhC-0SOBJTAt57MqSP13j1s3U9Ww',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmcLb5iRUK08cAXEeKf5LLm9fQperHFbkvjHRP-rZ7P4ab1X6Isa3G-kRgUWA_lhhVzo8DQjI8HObMeldDn3l2v59o81lPG6ZrUuv2UnHf_fhuMz8g5X3xGqJ9upUSi6w76G4_Cpcf_OEi1R_4t_gqtZ5Vu_ZU0rksTy0M84WCf-eUTail3HS6Pb5NIWVb8iYlgF39jGXuQt1E7tY1xH4crKrkFmm6_wcy84mdIwmvjpVZ_QDhC-0SOBJTAt57MqSP13j1s3U9Ww',
        rarity: 'Uncommon',
        element: 'Wood',
        description: 'Deals 2x damage if the opponent is in defense mode.',
        status: 'READY',
        stats: { power: 1200, integrity: 1000 }
    },
    'VOID_EYE': {
        id: 'VOID_EYE',
        name: 'VOID_EYE',
        title: 'VOID_EYE',
        type: 'Construct',
        hp: 2500,
        atk: 0,
        def: 3000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8RKtBZwa_iOuANwQq1SIa3UuuSfV_FWNxvO-If5Hos_QCrQ0v-mXYBpweG65HPl6cpi-O1sdhPtjRtd8civ5SK77F-uOxDv2DzU5r-nf6qNF7kiKIPdAP9tjzjAx7bUCu6XWbKGf66pCZPgiSN_3rGCJ7A5MWGC54wn9gH6i5ZECB6uwx5DymMoDhLK5glJ-opXdXcmCyb-mT0rZXHdBpDcGDVuvDe9TlJOpmYlSh2fZcVcV9QQ3RWd1jwulEi5F225lEcy2lhw',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8RKtBZwa_iOuANwQq1SIa3UuuSfV_FWNxvO-If5Hos_QCrQ0v-mXYBpweG65HPl6cpi-O1sdhPtjRtd8civ5SK77F-uOxDv2DzU5r-nf6qNF7kiKIPdAP9tjzjAx7bUCu6XWbKGf66pCZPgiSN_3rGCJ7A5MWGC54wn9gH6i5ZECB6uwx5DymMoDhLK5glJ-opXdXcmCyb-mT0rZXHdBpDcGDVuvDe9TlJOpmYlSh2fZcVcV9QQ3RWd1jwulEi5F225lEcy2lhw',
        rarity: 'Legendary',
        element: 'Dark',
        description: 'The eye that sees all. Prevents the opponent from activating Trap cards.',
        status: 'READY',
        stats: { power: 0, integrity: 2500 }
    }
};

export const MOCK_MARKET_DATA: { stats: MarketState; listings: CyberCard[] } = {
    stats: {
        indexStable: 1242.50,
        volume24h: 24105,
        networkStatus: "OPTIMAL",
        latency: 14
    },
    listings: [
        {
            id: "#8821",
            name: "The Black Monk",
            title: "The Black Monk",
            rarity: "Legendary",
            element: "Void",
            price: 150,
            status: "ON_SALE",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoWOP4iB8BKcN1amFzI-DsJu-jvsRTG7jQdEzLF-wM8CIeCc-8KlSPTGgHANEGWJ7IVugcjcVUF5h2080rbPV4hy1v6rR0ahBa9_w-zTUk7d3skZmYv_Kn5jq_SGBSXTJD-67t3ashWULQeU7BS8au5dHLkyj2Q54wAiHwtzx_PX0bwU3N6iITkcaqr1QDVZYKr7ExIfk_us_NTy6mwITODgItP0H5P4jhuxaMGtDbhLgJrpcBRLtk0dp0tgZ21WLpLLxH371nUA",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoWOP4iB8BKcN1amFzI-DsJu-jvsRTG7jQdEzLF-wM8CIeCc-8KlSPTGgHANEGWJ7IVugcjcVUF5h2080rbPV4hy1v6rR0ahBa9_w-zTUk7d3skZmYv_Kn5jq_SGBSXTJD-67t3ashWULQeU7BS8au5dHLkyj2Q54wAiHwtzx_PX0bwU3N6iITkcaqr1QDVZYKr7ExIfk_us_NTy6mwITODgItP0H5P4jhuxaMGtDbhLgJrpcBRLtk0dp0tgZ21WLpLLxH371nUA",
            stats: { power: 85, integrity: 6000 },
            hp: 6000,
            atk: 85,
            def: 2000,
            description: "A shadowy figure from the void.",
            type: "Avatar"
        },
        {
            id: "#0412",
            name: "The Golden Knight",
            title: "The Golden Knight",
            rarity: "Legendary",
            element: "Light",
            price: 320,
            status: "ON_SALE",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqS9F0_VVjhCBgmq6cx6uz2xXuuaxNQmIhO6Kc6_VunGSI_29VFTsPsla-28d9Rx2FLOJYxhxbArPD5QN98B19agipfLPWIFP0k43oZIdfNeFTaTFaMpI1eUZKOKyFYBQt9Z_I4yYCcn8jYTKiXMDXlhEMEnTBYKc0DtrudHBFa-m7DiB5vwF9mYktxLFyFAHVzcCfiLl-otDyXZ7YjgZNJBaX_kaOF02dOIW2dkDON_oSaremusWUQi5AlKj23Lt4j7gWLdfa0Q",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqS9F0_VVjhCBgmq6cx6uz2xXuuaxNQmIhO6Kc6_VunGSI_29VFTsPsla-28d9Rx2FLOJYxhxbArPD5QN98B19agipfLPWIFP0k43oZIdfNeFTaTFaMpI1eUZKOKyFYBQt9Z_I4yYCcn8jYTKiXMDXlhEMEnTBYKc0DtrudHBFa-m7DiB5vwF9mYktxLFyFAHVzcCfiLl-otDyXZ7YjgZNJBaX_kaOF02dOIW2dkDON_oSaremusWUQi5AlKj23Lt4j7gWLdfa0Q",
            stats: { power: 92, integrity: 9500 },
            hp: 9500,
            atk: 92,
            def: 4000,
            description: "A shining beacon of hope.",
            type: "Avatar"
        },
        {
            id: "#1101",
            name: "Shadow Weaver",
            title: "Shadow Weaver",
            rarity: "Mythic",
            element: "Dark",
            price: 1200,
            status: "SOLD",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcKCH-yXiYaph7rDhyQUpj3SFSkaQIQAUSCt05wfNsUXRYPtDbTSc3p3uMLW2CfbrAsKQ7IaHfbf4UR-FcNmWU_7LCskZtvXTSb6YCQHahilMvYJG5ERxX4zREDHS9fGbJNhlnYRdVEz3uXvhFia-Jaq6gSjDdU9oyWINM-oQgbQAHNPC2gaFOX_VDs423TdObMPqxMPDa-WbfBZhfYEd_S8Gl22P0URTn2eMyjmuue4QyMK4onL2p9g8N4EUrCOu3Rm7MtCaaOQ",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcKCH-yXiYaph7rDhyQUpj3SFSkaQIQAUSCt05wfNsUXRYPtDbTSc3p3uMLW2CfbrAsKQ7IaHfbf4UR-FcNmWU_7LCskZtvXTSb6YCQHahilMvYJG5ERxX4zREDHS9fGbJNhlnYRdVEz3uXvhFia-Jaq6gSjDdU9oyWINM-oQgbQAHNPC2gaFOX_VDs423TdObMPqxMPDa-WbfBZhfYEd_S8Gl22P0URTn2eMyjmuue4QyMK4onL2p9g8N4EUrCOu3Rm7MtCaaOQ",
            stats: { power: 98, integrity: 8800 },
            hp: 8800,
            atk: 98,
            def: 4500,
            description: "Weaves shadows into weapons.",
            type: "Avatar"
        }
    ]
};
