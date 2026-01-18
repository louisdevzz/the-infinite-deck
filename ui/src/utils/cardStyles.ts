
export const getRarityColor = (rarity: string) => {
    switch (rarity) {
        case 'Uncommon': return 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
        case 'Rare': return 'border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
        case 'Epic': return 'border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]';
        case 'Legendary': return 'border-yellow-500 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]';
        default: return 'border-white/20 text-white/60'; // Common
    }
};

export const getElementIcon = (element: string) => {
    switch (element) {
        case 'Fire': return 'local_fire_department';
        case 'Water': return 'water_drop';
        case 'Wood': return 'forest';
        case 'Light': return 'light_mode';
        case 'Dark': return 'dark_mode';
        default: return 'help';
    }
};

export const getElementColor = (element: string) => {
    switch (element) {
        case 'Fire': return 'text-red-500';
        case 'Water': return 'text-blue-400';
        case 'Wood': return 'text-green-400';
        case 'Light': return 'text-yellow-200';
        case 'Dark': return 'text-purple-400';
        default: return 'text-white';
    }
}
