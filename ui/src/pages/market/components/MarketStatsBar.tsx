import React from 'react';
import { MOCK_MARKET_DATA } from '../../../data/mockData';

export type ViewMode = 'FEED' | 'MY_LISTINGS';
export type ElementType = 'ALL' | 'Light' | 'Dark' | 'Void' | 'Neon';
export type RarityType = 'ALL' | 'Common' | 'Rare' | 'Legendary' | 'Mythic' | 'Void';
export type SortType = 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST';

interface MarketStatsBarProps {
    activeView: ViewMode;
    filterElement: ElementType;
    filterRarity: RarityType;
    onViewChange: (view: ViewMode) => void;
    onFilterChange: (type: 'ELEMENT' | 'RARITY', value: string) => void;
    onSearchChange: (value: string) => void;
}

export const MarketStatsBar: React.FC<MarketStatsBarProps> = ({
    activeView,
    filterElement,
    filterRarity,
    onViewChange,
    onFilterChange,
    onSearchChange
}) => {
    const { stats } = MOCK_MARKET_DATA;

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1">
                        <button
                            onClick={() => onViewChange('FEED')}
                            className={`flex items-center px-6 py-2 font-bold text-xs tracking-widest uppercase rounded-sm border transition-all ${activeView === 'FEED' ? 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'bg-surface/40 text-primary/60 border-primary/10 hover:border-primary/40'}`}
                        >
                            Market Feed
                        </button>
                        <button
                            onClick={() => onViewChange('MY_LISTINGS')}
                            className={`flex items-center px-6 py-2 font-bold text-xs tracking-widest uppercase rounded-sm border transition-all ${activeView === 'MY_LISTINGS' ? 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'bg-surface/40 text-primary/60 border-primary/10 hover:border-primary/40'}`}
                        >
                            My Listings
                        </button>
                    </div>

                    {/* Integrated Search Bar */}
                    <div className="relative w-64 h-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-lg">search</span>
                        <input
                            className="w-full bg-surface/40 border border-primary/20 rounded-sm py-2 pl-10 pr-4 text-[10px] font-bold tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-0 transition-all uppercase h-[34px]"
                            placeholder="SEARCH ASSETS..."
                            type="text"
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-mono">
                    Index_Stable: <span className="text-primary tabular-nums">{stats.indexStable.toLocaleString('de-DE', { minimumFractionDigits: 2 })} SUI</span>
                </div>
            </div>
            <div className="flex gap-4 mb-8 flex-wrap p-1 border-y border-primary/10 py-4">

                {/* Element Filter */}
                <div className="relative group">
                    <div className="flex h-9 items-center justify-center gap-x-3 rounded-sm bg-surface border border-primary/20 px-4 hover:border-primary transition-colors">
                        <span className="text-primary/50 text-[10px] font-bold uppercase tracking-tighter">Element</span>
                        <select
                            value={filterElement}
                            onChange={(e) => onFilterChange('ELEMENT', e.target.value)}
                            className="bg-transparent text-white text-xs font-bold uppercase focus:outline-none appearance-none pr-4 cursor-pointer"
                        >
                            <option value="ALL">All Elements</option>
                            <option value="Light">Light</option>
                            <option value="Dark">Dark</option>
                            <option value="Void">Void</option>
                            <option value="Neon">Neon</option>
                        </select>
                        <span className="material-symbols-outlined text-primary text-sm absolute right-2 pointer-events-none">expand_more</span>
                    </div>
                </div>

                {/* Rarity Filter */}
                <div className="relative group">
                    <div className="flex h-9 items-center justify-center gap-x-3 rounded-sm bg-surface border border-primary/20 px-4 hover:border-primary transition-colors">
                        <span className="text-primary/50 text-[10px] font-bold uppercase tracking-tighter">Rarity</span>
                        <select
                            value={filterRarity}
                            onChange={(e) => onFilterChange('RARITY', e.target.value)}
                            className="bg-transparent text-white text-xs font-bold uppercase focus:outline-none appearance-none pr-4 cursor-pointer"
                        >
                            <option value="ALL">All Rarities</option>
                            <option value="Common">Common</option>
                            <option value="Rare">Rare</option>
                            <option value="Legendary">Legendary</option>
                            <option value="Mythic">Mythic</option>
                        </select>
                        <span className="material-symbols-outlined text-primary text-sm absolute right-2 pointer-events-none">expand_more</span>
                    </div>
                </div>

                <div className="flex-1"></div>
                <div className="flex items-center gap-2 bg-primary/5 rounded px-3 border border-primary/10">
                    <span className="material-symbols-outlined text-xs text-primary">bar_chart</span>
                    <span className="text-[10px] font-bold text-primary/60 tracking-widest uppercase">Volume: {stats.volume24h.toLocaleString()} SUI</span>
                </div>
            </div>
        </>
    );
};
